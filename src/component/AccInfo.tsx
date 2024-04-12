import Auth from "../Auth";
import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { db } from "../Auth";

function AccInfo() {
  const [userData, setUserData] = useState<any | null>();
  const [loading, setLoading] = useState(false);
  const auth = Auth.requestAuth();
  const dataRef = db.collection("UserData").doc(auth?.uid);

  useEffect(() => {
    // console.log("useEffect has used");
    const fetchUser = async () => {
      // const querySnapshot = await getDocs(collection(db, "UserData"));
      // const datas = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // setUserData(datas);
      // console.log(datas);
      const docSnap = await getDoc(dataRef);
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
    // console.log("end");
  }, [loading]);
  return (
    <>
      {userData ? (
        <div>
          <ListGroup name={"Thông tin cá nhân"} />

          <div className="card m-5">
            <div className="card-body">
              <h5 className="card-title">Thông tin người dùng</h5>
              <p className="card-text">Tên: {userData.name}</p>
              <p className="card-text">Email: {userData.email}</p>
              <p className="card-text">Địa chỉ: {userData.address}</p>
            </div>
          </div>
          <div className="card m-5">
            <div className="card-body">
              <h5 className="card-title">Kinh nghiệm (giờ)</h5>
              <p className="card-text">
                Level: {Math.floor(userData.experience / 100)} (
                {userData.experience} giờ)
              </p>
              <div
                className="progress"
                role="progressbar"
                aria-label="Experience"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${userData.experience % 100}%` }}
                ></div>
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

export default AccInfo;
