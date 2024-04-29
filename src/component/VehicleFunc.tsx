import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore";
import AuthFunction, { VehicleProps } from "../Auth";
import { displayAddVehicle } from "./utilities";

function VehicleFunc() {
  const Auth = AuthFunction.getInstance();
  const db = Auth.db;
  const [vehicleData, setVehicleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ item: null, type: null });
  const [oldVehicle, setOldVehicle] = useState<VehicleProps | any>();
  const [updModalOpen, setUpdModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [deleteVehicle, setDeleteVehicle] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const auth = Auth.requestAuth();
  const dataRef = collection(db, "VehicleData");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const type = form.elements.namedItem("type") as HTMLInputElement;
    const model = form.elements.namedItem("model") as HTMLInputElement;
    const len = form.elements.namedItem("length") as HTMLInputElement;
    const wid = form.elements.namedItem("width") as HTMLInputElement;
    const hei = form.elements.namedItem("height") as HTMLInputElement;
    const wei = form.elements.namedItem("weight") as HTMLInputElement;
    const yMade = form.elements.namedItem("yearMade") as HTMLInputElement;
    const o = form.elements.namedItem("odo") as HTMLInputElement;
    const fuel = form.elements.namedItem("fuel") as HTMLInputElement;
    const plate = form.elements.namedItem("plate") as HTMLInputElement;
    Auth.uploadVehicle(
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
      plate.value
    );
  };
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
              disabled
            >
              <option value="Coach">Xe Du Lịch</option>
              <option value="Container">Xe Container</option>
              <option value="Truck">Xe Tải</option>
              <option value="SUV">Xe SUV</option>
              <option value="Sports">Xe Thể Thao</option>
              <option value="Sedan">Xe Sedan</option>
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
                // pattern="^\d{4}$"
                maxLength={4}
                minLength={4}
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
                maxLength={4}
                minLength={4}
                pattern="[0-9]*"
                defaultValue={item.dimension.width}
                required
              ></input>
              <span className="input-group-text">x</span>
              <input
                type="text"
                className="form-control"
                name="updHeight"
                id="updHeight"
                maxLength={4}
                minLength={4}
                pattern="[0-9]*"
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
                minLength={4}
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
                minLength={4}
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
  const handleMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const report = form.elements.namedItem(
      "maintenanceReport"
    ) as HTMLInputElement;
    Auth.maintenanceVehicleReport(report.value, oldVehicle);
  };
  const handleFix = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const report = form.elements.namedItem("fixReport") as HTMLInputElement;
    // console.log(report.value);
    Auth.fixVehicleReport(report.value, oldVehicle);
  };
  function displayMaintenanceReport() {
    return (
      <div className="modal-body">
        {/* Maintenance Report Modal */}
        <label className="dispMaintenanceModalLabel pb-2">
          Vấn đề phát sinh:
        </label>
        <form onSubmit={handleMaintenance}>
          <textarea
            className="form-control"
            name="maintenanceReport"
            placeholder="Xe bị hư ở abc..."
          ></textarea>
          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={() => {
                setMaintenanceModalOpen(false);
              }}
            >
              Đóng
            </button>
            <button type="submit" name="report" className="btn btn-success">
              Báo cáo
            </button>
          </div>
        </form>
      </div>
    );
  }
  function displayFixReport() {
    return (
      <div className="modal-body">
        {/* Maintenance Report Modal */}
        <label className="dispFixModalLabel pb-2">Công việc bảo dưỡng:</label>
        <form onSubmit={handleFix}>
          <textarea
            className="form-control"
            name="fixReport"
            placeholder="Xe đã sửa abc..."
          ></textarea>
          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={() => {
                setFixModalOpen(false);
              }}
            >
              Đóng
            </button>
            <button type="submit" name="report" className="btn btn-success">
              Báo cáo
            </button>
          </div>
        </form>
      </div>
    );
  }
  useEffect(() => {
    function handleDelete() {
      if (oldVehicle != null && deleteVehicle) {
        Auth.deleteVehicle(oldVehicle);
        setDeleteVehicle(false);
      }
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
                    {type.available?.map((item: any, index: any) => {
                      return (
                        <div
                          className="card col"
                          style={{ width: "30rem" }}
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
                          <h4 className="card-title mt-3 ms-3">{item.model}</h4>
                          <div className="card-body">
                            <img
                              src={"/pics/default_car.png"}
                              className="card-img-top p-3 rounded-3"
                              alt="..."
                            ></img>
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
                              Trạng thái: {item.status}
                            </p>
                            {/* Tài xế và admin có thể xem vấn đề của xe */}
                            {userData && (
                              <div>
                                <p className="card-text">
                                  Lịch sử bảo dưỡng:{" "}
                                  {item.maintenanceHistory.join(", ")}
                                </p>
                                <p className="card-text">
                                  Vấn đề xe đang bị: {item.problem}
                                </p>
                              </div>
                            )}
                          </div>
                          {userData.admin && (
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
                                    maintenanceHistory: item.maintenanceHistory,
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
                              {item.status == "maintenance" ? (
                                <button
                                  type="button"
                                  className="btn btn-outline-warning mx-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#fixReport"
                                  onClick={() => {
                                    setOldVehicle({
                                      type: type.id,
                                      plate: item.id,
                                    });
                                    setFixModalOpen(true);
                                  }}
                                >
                                  Bảo dưỡng hoàn tất
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-outline-warning mx-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#maintenanceReport"
                                  onClick={() => {
                                    setOldVehicle({
                                      type: type.id,
                                      plate: item.id,
                                    });
                                    setMaintenanceModalOpen(true);
                                  }}
                                >
                                  Bảo dưỡng
                                </button>
                              )}
                              {item.status == "busy" ? (
                                <button
                                  type="button"
                                  className="btn btn-danger m-2"
                                  key={"remove_" + index}
                                  disabled
                                >
                                  Xóa
                                </button>
                              ) : (
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
                              )}
                            </div>
                          )}
                          {userData &&
                            !userData.admin &&
                            item.status == "active" && (
                              <div className="card-footer">
                                <button
                                  type="button"
                                  className="btn btn-outline-warning mx-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#maintenanceReport"
                                  onClick={() => {
                                    setOldVehicle({
                                      type: type.id,
                                      plate: item.id,
                                    });
                                    setMaintenanceModalOpen(true);
                                  }}
                                >
                                  Bảo dưỡng
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
            {/* Maintenance Report Modal */}
            <div
              className="modal fade"
              id="maintenanceReport"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Báo cáo bảo dưỡng</h5>
                  </div>
                  {maintenanceModalOpen && displayMaintenanceReport()}
                </div>
              </div>
            </div>
            {/* Maintenance Fix Modal */}
            <div
              className="modal fade"
              id="fixReport"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Báo cáo bảo dưỡng</h5>
                  </div>
                  {fixModalOpen && displayFixReport()}
                </div>
              </div>
            </div>
          </div>
          {userData?.admin && (
            <div className="position-absolute start-50 translate-middle-x pb-3">
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#addVehicle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-car-front"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276" />
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z" />
                </svg>
                Thêm Phương Tiện
              </button>
            </div>
          )}
          {/* Add Vehicle Modal */}
          <div className="modal fade" id="addVehicle">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm Phương Tiện</h5>
                </div>
                <form onSubmit={handleSubmit}>{displayAddVehicle()}</form>
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
