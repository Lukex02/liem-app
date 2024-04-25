import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore";
import Auth, { db, VehicleProps } from "../Auth";

function VehicleFunc() {
  const [vehicleData, setVehicleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ item: null, type: null });
  const [oldVehicle, setOldVehicle] = useState<VehicleProps | any>();
  const [updModalOpen, setUpdModalOpen] = useState(false);
  const [deleteVehicle, setDeleteVehicle] = useState(false);
  const dataRef = collection(db, "VehicleData");
  const auth = Auth.requestAuth();
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      type obj = {
        id: String;
        name: String;
        available: {}[];
      };

      const querySnapshot = await getDocs(dataRef);
      const Datas = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const availableRef = collection(
            db,
            "VehicleData",
            doc.id,
            "available"
          );
          const availableQuery = await getDocs(availableRef);
          const subData = await Promise.all(
            availableQuery.docs.map((subDoc) => {
              return {
                id: subDoc.id,
                ...subDoc.data(),
              };
            })
          );
          const vehicleObj: obj = {
            id: doc.id,
            name: doc.data().name,
            available: subData,
          };
          return vehicleObj;
        })
      );
      // console.log(Datas);
      setVehicleData(Datas);
      setLoading(true);
    };
    fetchVehicle();
  }, [loading]);

  useEffect(() => {
    const fetchUser = async () => {
      const UserRef = db.collection("UserData").doc(auth?.uid);
      const docSnap = await getDoc(UserRef);
      setLoading(true);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        // console.log(docSnap.data());
      } else {
        // console.log(docSnap);
        console.log("No Document");
      }
    };
    fetchUser();
  }, [loading]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const type = form.elements.namedItem("updType") as HTMLInputElement;
    const model = form.elements.namedItem("updModel") as HTMLInputElement;
    const len = form.elements.namedItem("updLength") as HTMLInputElement;
    const wid = form.elements.namedItem("updWidth") as HTMLInputElement;
    const hei = form.elements.namedItem("updHeight") as HTMLInputElement;
    const wei = form.elements.namedItem("updWeight") as HTMLInputElement;
    const yMade = form.elements.namedItem("updYearMade") as HTMLInputElement;
    const o = form.elements.namedItem("updOdo") as HTMLInputElement;
    const fuel = form.elements.namedItem("updFuel") as HTMLInputElement;
    const plate = form.elements.namedItem("plate") as HTMLInputElement;
    // console.log(plate.value);
    Auth.updateVehicle(
      {
        type: type.value,
        dimension: {
          height: +hei.value,
          length: +len.value,
          width: +wid.value,
        },
        fuel: fuel.value,
        maintenanceHistory: [],
        model: model.value,
        odometer: +o.value,
        status: "active",
        weight: +wei.value,
        yearMade: +yMade.value,
      },
      // oldVehicle,
      plate.value
    );
  };

  function displayUpdVehMod(content: any) {
    const item = content.item;
    const type = content.type;
    // console.log(item.id);
    // console.log(type);
    return (
      <div>
        {/* Update Vehicle Modal */}
        <form onSubmit={handleUpdate}>
          {/* Chọn loại Xe */}
          <div className="m-3">
            <select
              className="form-select"
              id="updType"
              name="updType"
              defaultValue={type}
            >
              <option value="Coach">Xe Du Lịch</option>
              <option value="Container">Xe Container</option>
              <option value="Truck">Xe Tải</option>
            </select>
          </div>
          {/* Mã hiệu */}
          <div className="m-3">
            <label htmlFor="updModel" className="form-label">
              Mã hiệu
            </label>
            <input
              type="text"
              className="form-control"
              id="updModel"
              name="updModel"
              defaultValue={item.model}
            ></input>
          </div>
          {/* Kích thước */}
          <div className="m-3">
            <label className="form-label" htmlFor="updLength">
              Kích thước (D x R x C)
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="updLength"
                name="updLength"
                maxLength={4}
                pattern="[0-9]*"
                defaultValue={item.dimension.length}
                required
              ></input>
              <span className="input-group-text">x</span>
              <input
                type="text"
                className="form-control"
                id="updWidth"
                name="updWidth"
                pattern="[0-9]*"
                maxLength={4}
                defaultValue={item.dimension.width}
                required
              ></input>
              <span className="input-group-text">x</span>
              <input
                type="text"
                className="form-control"
                name="updHeight"
                id="updHeight"
                pattern="[0-9]*"
                maxLength={4}
                defaultValue={item.dimension.height}
                required
              ></input>
            </div>
          </div>
          <div className="row g-2 m-3">
            {/* Tải Trọng */}
            <div className="col-md-4 mx-auto">
              <label htmlFor="updWeight" className="form-label">
                Tải trọng
              </label>
              <input
                type="text"
                className="form-control"
                id="updWeight"
                name="updWeight"
                maxLength={4}
                pattern="[0-9]*"
                defaultValue={item.weight}
                required
              ></input>
            </div>
            {/* Năm sản xuất */}
            <div className="col-md-4 mx-auto">
              <label htmlFor="updYearMade" className="form-label">
                Năm sản xuất
              </label>
              <input
                type="text"
                className="form-control"
                id="updYearMade"
                name="updYearMade"
                maxLength={4}
                pattern="[0-9]*"
                defaultValue={item.yearMade}
                required
              ></input>
            </div>
            {/* ODO */}
            <div className="col-md-4 mx-auto">
              <label htmlFor="updOdo" className="form-label">
                ODO (km)
              </label>
              <input
                type="number"
                className="form-control"
                id="updOdo"
                name="updOdo"
                defaultValue={item.odometer}
                required
              ></input>
            </div>
          </div>
          {/* Loại nhiên liệu */}
          <div className="m-3">
            <label htmlFor="updFuel" className="form-label">
              Loại xăng sử dụng
            </label>
            <select
              className="form-select"
              id="updFuel"
              name="updFuel"
              defaultValue={item.fuel}
            >
              <option value="diesel">Diesel</option>
              <option value="gas">Xăng</option>
              <option value="e85">E85</option>
            </select>
          </div>
          {/* Biển Số Xe */}
          <div className="m-3">
            <label htmlFor="plate" className="form-label">
              Biển số xe
            </label>
            <input
              type="text"
              className="form-control"
              id="plate"
              name="plate"
              defaultValue={item.id}
              disabled
            ></input>
          </div>
          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={() => {
                setUpdModalOpen(false);
              }}
            >
              Đóng
            </button>
            <button type="submit" name="add" className="btn btn-success">
              Lưu vào hệ thống
            </button>
          </div>
        </form>
      </div>
    );
  }

  useEffect(() => {
    function handleDelete() {
      setDeleteVehicle(false);
      if (oldVehicle != null) Auth.deleteVehicle(oldVehicle);
    }
    handleDelete();
  }, [deleteVehicle]);
  return (
    <>
      {vehicleData ? (
        <div>
          <ListGroup name={"Đội Xe"} />
          <div className="mx-auto">
            {vehicleData.map((type: any, typeIdx: any) => (
              <li
                className="list-group list-group-flush m-4 col"
                key={"vehicleList_" + typeIdx}
              >
                <div className="list-group-item">
                  <h5 className="text-uppercase">{type.name}</h5>
                  <div className="row row-cols-auto grid gap-4">
                    {type.available &&
                      type.available.map((item: any, index: any) => {
                        return (
                          <div
                            className="card col"
                            style={{ width: "400px" }}
                            key={"card_" + index}
                          >
                            {item.status == "active" && (
                              <span className="position-absolute top-0 start-100 translate-middle p-3 bg-success border border-light rounded-circle"></span>
                            )}
                            {item.status == "busy" && (
                              <span className="position-absolute top-0 start-100 translate-middle p-3 bg-danger border border-light rounded-circle"></span>
                            )}
                            {item.status == "maintenance" && (
                              <span className="position-absolute top-0 start-100 translate-middle p-3 bg-warning border border-light rounded-circle"></span>
                            )}
                            <h4 className="card-title mt-3 ms-3">
                              {item.model}
                            </h4>
                            <div className="card-body">
                              <p className="card-text"></p>
                              <p className="card-text">
                                Trạng thái: {item.status}
                              </p>
                              <p className="card-text">
                                Năm sản xuất: {item.yearMade}
                              </p>
                              <p className="card-text">
                                ODO: {item.odometer} (km)
                              </p>
                              <p className="card-text">
                                Tải trọng: {item.weight} (kg)
                              </p>
                              <p className="card-text">
                                Loại nhiên liệu sử dụng: {item.fuel}
                              </p>
                              <p className="card-text">
                                Kích thước (DxRxC): {item.dimension.length} x{" "}
                                {item.dimension.width} x {item.dimension.height}{" "}
                                (mm)
                              </p>
                              <p className="card-text">Biển số xe: {item.id}</p>
                              <p className="card-text">
                                Lịch sử bảo dưỡng:{" "}
                                {item.maintenanceHistory.join(", ")}
                              </p>
                            </div>
                            {userData && userData.admin && (
                              <div className="card-footer">
                                <button
                                  type="button"
                                  className="btn btn-outline-success mx-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#updateVehicle"
                                  onClick={() => {
                                    // console.log(item);
                                    setModalData({
                                      item: item,
                                      type: type.id,
                                    });
                                    setOldVehicle({
                                      type: type.id,
                                      dimension: item.dimension,
                                      fuel: item.fuel,
                                      maintenanceHistory:
                                        item.maintenanceHistory,
                                      model: item.model,
                                      odometer: item.odometer,
                                      status: item.status,
                                      weight: item.weight,
                                      yearMade: item.yearMade,
                                    });
                                    setUpdModalOpen(true);
                                  }}
                                >
                                  Cập nhật
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-warning mx-2"
                                  onClick={() => {
                                    // setOldVehicle({
                                    //   type: type.id,
                                    //   dimension: item.dimension,
                                    //   fuel: item.fuel,
                                    //   maintenanceHistory:
                                    //     item.maintenanceHistory,
                                    //   model: item.model,
                                    //   odometer: item.odometer,
                                    //   status: item.status,
                                    //   weight: item.weight,
                                    //   yearMade: item.yearMade,
                                    // });
                                    // setDeleteVehicle(true);
                                  }}
                                >
                                  Bảo dưỡng (dev)
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger m-2"
                                  key={"remove_" + index}
                                  onClick={() => {
                                    setOldVehicle({
                                      type: type.id,
                                      plate: item.id,
                                    });
                                    setDeleteVehicle(true);
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </li>
            ))}
            {/* Update Vehicle Modal */}
            <div
              className="modal fade"
              id="updateVehicle"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Cập nhật thông tin của phương tiện
                    </h5>
                  </div>
                  {updModalOpen && displayUpdVehMod(modalData)}
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

export default VehicleFunc;
