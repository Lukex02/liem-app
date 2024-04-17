// import "../style/accCard.css";
import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { db } from "../Auth";

function VehicleFunc() {
  const [vehicleData, setVehicleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const dataRef = db.collection("VehicleData");

  useEffect(() => {
    // console.log("useEffect has used");
    const fetchUser = async () => {
      const querySnapshot = await getDocs(dataRef);
      const datas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicleData(datas);
      // console.log(datas);
      setLoading(true);
    };
    fetchUser();
  }, [loading]);
  return (
    <>
      {vehicleData ? (
        <div>
          <ListGroup name={"Đội Xe"} />
          <div className="mx-auto">
            {vehicleData.map((type: any) => (
              <li className="list-group list-group-flush m-4 col">
                <div className="list-group-item">
                  <h5 className="text-uppercase">{type.name}</h5>
                  <div className="row row-cols-auto grid gap-3">
                    {type.available &&
                      type.available.map((item: any) => {
                        return (
                          <div className="card col" style={{ width: "400px" }}>
                            <div className="card-body">
                              <p className="card-text">Mã hiệu: {item.model}</p>
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
                                Trọng tải: {item.weight} (kg)
                              </p>
                              <p className="card-text">
                                Kích thước (DxRxC): {item.dimension.length} x{" "}
                                {item.dimension.width} x {item.dimension.height}{" "}
                                (mm)
                              </p>
                              <p className="card-text">
                                Lịch sử bảo dưỡng:{" "}
                                {item.maintenanceHistory.join(", ")}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </li>
            ))}
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
