// import "../style/accCard.css";
import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Auth";

function DriverFunc() {
  const [driverData, setDriverData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const dataRef = collection(db, "UserData");

  useEffect(() => {
    // console.log("useEffect has used");
    const fetchUser = async () => {
      const querySnapshot = await getDocs(dataRef);
      const datas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDriverData(datas);
      // console.log(datas);
      setLoading(true);
    };
    fetchUser();
  }, [loading]);
  return (
    <>
      {driverData ? (
        <div>
          <ListGroup name={"Đội Tài Xế"} />
          <div className="row row-cols-auto mx-auto">
            {driverData.map((item: any) => (
              <div className="card m-4 col" style={{ width: "400px" }}>
                {item.status == "active" && (
                  <span className="position-absolute top-0 start-100 translate-middle p-3 bg-success border border-light rounded-circle"></span>
                )}
                {item.status == "busy" && (
                  <span className="position-absolute top-0 start-100 translate-middle p-3 bg-danger border border-light rounded-circle"></span>
                )}
                {item.status == "maintenance" && (
                  <span className="position-absolute top-0 start-100 translate-middle p-3 bg-warning border border-light rounded-circle"></span>
                )}
                <div className="card-body">
                  <h5 className="card-title text-uppercase">{item.name}</h5>
                  <p className="card-text">Email: {item.email}</p>
                  <p className="card-text">Số điện thoại: {item.phone}</p>
                  <p className="card-text">GPLX hiện có: {item.license}</p>
                  <p className="card-text">
                    Kinh nghiệm: {item.experience} (giờ)
                  </p>
                  {/* <a type="button" className="btn btn-primary">
                    Chi tiết (in dev)
                  </a> */}
                </div>
              </div>
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

export default DriverFunc;
