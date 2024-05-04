import { Timestamp, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import AuthFunction from "../Auth";
import ListGroup from "./ListGroup";

function TripFunc() {
  const Auth = AuthFunction.getInstance();
  const db = Auth.db;
  const [tripData, setTripData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [confirmTrip, setConfirmTrip] = useState<any | null>();
  const dataRef = db.collection("TripData");
  const auth = Auth.requestAuth();
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const querySnapshot = await getDocs(dataRef);
      const datas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(datas);
      setTripData(datas);
      setLoading(true);
    };
    fetchUser();
  }, [loading]);
  useEffect(() => {
    const fetchUser = async () => {
      const UserRef = db.collection("UserData").doc(auth?.uid);
      const docSnap = await getDoc(UserRef);
      if (docSnap.exists()) {
        setUserData({ uid: docSnap.id, ...docSnap.data() });
        // console.log(docSnap.id);
      } else {
        // console.log(docSnap);
        console.log("No Document");
      }
      setUserLoading(true);
    };
    fetchUser();
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const start = form.elements.namedItem("startInput") as HTMLInputElement;
    const end = form.elements.namedItem("endInput") as HTMLInputElement;
    const vehicleSelect = form.elements.namedItem(
      "vehicleTypeSelection"
    ) as HTMLInputElement;
    // console.log(start.value, end.value, vehicleSelect.value);
    Auth.createTrip({
      start: start.value,
      end: end.value,
      vehicleType: vehicleSelect.value,
    });
  };
  const handleConfirm = () => {
    const time = Timestamp.now().toDate();
    Auth.finishTrip(time, confirmTrip);
  };
  document.title = "Chuyến Đi";
  return (
    <>
      {tripData && userLoading ? (
        <div>
          <ListGroup name={"Chuyến Đi"} />
          <div className="container-fluid text-center my-5">
            {/* Not showing for driver, only for admin and customer */}
            {(userData?.admin || !userData) && (
              <button
                className="btn btn-primary btn-lg"
                data-bs-toggle="modal"
                data-bs-target="#createTrip"
              >
                Tạo chuyến đi
              </button>
            )}
            {/* Create Trip Modal */}
            <div
              className="modal fade"
              id="createTrip"
              aria-labelledby="createTripLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="createTripLabel">
                      Yêu cầu chuyến đi
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body text-start">
                      {/* Điểm xuất phát */}
                      <div className="mb-1">
                        <label className="mb-2">Điểm Xuất Phát:</label>
                        <select
                          className="form-select"
                          key="startInput"
                          id="startInput"
                          name="startInput"
                        >
                          <option value="HCMC">Thành phố Hồ Chí Minh</option>
                          <option value="HN">Hà Nội</option>
                          <option value="VT">Vũng Tàu</option>
                        </select>
                      </div>
                      {/* Điểm Đến */}
                      <div className="mb-1">
                        <label className="mb-2">Điểm Đến</label>
                        <select
                          className="form-select"
                          key="endInput"
                          id="endInput"
                          name="endInput"
                        >
                          <option value="HCMC">Thành phố Hồ Chí Minh</option>
                          <option value="HN">Hà Nội</option>
                          <option value="VT">Vũng Tàu</option>
                        </select>
                      </div>
                      {/* Vehicle Type Selection */}
                      <div className="mb-1">
                        <label className="mb-2">Phương tiện</label>
                        <select
                          className="form-select"
                          key="vehicleTypeSelection"
                          id="vehicleTypeSelection"
                          name="vehicleTypeSelection"
                        >
                          <option value="Coach">Xe Du Lịch</option>
                          <option value="Container">Xe Container</option>
                          <option value="Truck">Xe Tải</option>
                          <option value="SUV">Xe SUV</option>
                          <option value="Sports">Xe Thể Thao</option>
                          <option value="Sedan">Xe Sedan</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">
                        Tạo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {tripData.length > 0 ? (
            <div>
              <p className="display-5 text-center">Chuyến đi đang thực hiện</p>
              {tripData.map((item: any, index: number) => (
                <div className="card m-5" key={index}>
                  {item.status == "active" && (
                    <div className="position-absolute top-0 start-100 translate-middle p-3 spinner-grow text-success"></div>
                  )}
                  {item.status == "pending" && (
                    <div className="position-absolute top-0 start-100 translate-middle p-3 spinner-grow text-warning"></div>
                  )}
                  <div className="card-body" key={"card_" + index}>
                    <h5 className="card-title" key={"trip_" + index}>
                      Chuyến đi {index + 1}
                    </h5>
                    <p className="card-text" key={"id_" + index}>
                      Mã chuyến đi: {item.id}
                    </p>
                    <p className="card-text" key={"dist_" + index}>
                      Điểm xuất phát - Điểm đến: {item.start} - {item.end}
                    </p>
                    <p className="card-text" key={"time_" + index}>
                      Thời gian dự kiến: {item.timeEst} (giờ)
                    </p>
                    <p className="card-text" key={"cost_" + index}>
                      Giá chuyến đi dự kiến: {item.cost * 1000} (VND)
                    </p>
                    <p className="card-text" key={"driver_" + index}>
                      Tài xế phụ trách: {item.driver.name}
                    </p>
                    <p className="card-text" key={"vehicle_" + index}>
                      Phương tiện sử dụng: {item.vehicle.model} (
                      {item.vehicle.plate})
                    </p>
                    <p className="card-text" key={"timeStart_" + index}>
                      Thời gian bắt đầu: {item.timeStart?.toDate().toString()}
                    </p>
                    <p className="card-text" key={"status_" + index}>
                      Trạng thái: {item.status}
                    </p>
                  </div>
                  <div className="card-footer">
                    {userData &&
                      (userData.admin || item.driver.uid == userData.uid) &&
                      ((item.status == "active" && (
                        <div>
                          <button
                            className="btn btn-outline-success m-2"
                            key={"successBut_" + index}
                            data-bs-toggle="modal"
                            data-bs-target="#confirmTrip"
                            onClick={() => {
                              setConfirmTrip({
                                timeStart: item.timeStart.toDate(),
                                timeEst: item.timeEst,
                                tripId: item.id,
                                userUID: item.driver.uid,
                                vehicleType: item.vehicleType,
                                vehiclePlate: item.vehicle.plate,
                              });
                            }}
                          >
                            Hoàn thành chuyến đi
                          </button>
                          <button
                            className="btn btn-outline-danger m-2"
                            key={"rejectBut_" + index}
                            onClick={() => {
                              Auth.rejectTrip({
                                rejectFirst: false,
                                tripId: item.id,
                                userUID: item.driver.uid,
                                vehicleType: item.vehicleType,
                                vehiclePlate: item.vehicle.plate,
                              });
                            }}
                          >
                            Hủy chuyến đi
                          </button>
                        </div>
                      )) ||
                        (item.status == "pending" && (
                          <div>
                            <button
                              className="btn btn-outline-warning m-2"
                              key={"confirmBut_" + index}
                              onClick={() => {
                                Auth.confirmTrip(item.id);
                              }}
                            >
                              Xác nhận chuyến đi
                            </button>
                            <button
                              className="btn btn-outline-danger m-2"
                              key={"rejectBut_" + index}
                              onClick={() => {
                                Auth.rejectTrip({
                                  rejectFirst: true,
                                  tripId: item.id,
                                  userUID: item.driver.uid,
                                  vehicleType: item.vehicleType,
                                  vehiclePlate: item.vehicle.plate,
                                });
                              }}
                            >
                              Từ chối
                            </button>
                          </div>
                        )))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="container-fluid p-5">
              <p className="display-5 text-center">
                Hiện tại chưa có chuyến đi
              </p>
            </div>
          )}
          {/* Confirm Trip Modal */}
          <div
            className="modal fade"
            id="confirmTrip"
            aria-labelledby="confirmTripLabel"
            // aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông báo</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Xác nhận hoàn thành chuyến đi?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={handleConfirm}
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="justify-content-center">
          <div className="spinner-border text-info m-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default TripFunc;
