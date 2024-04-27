import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  // and,
  // arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  // or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const firebaseCfg = {
  apiKey: "AIzaSyAHG2MnxuKj2sR9JpFiK0EW13mCO6DgiZM",
  authDomain: "liem-transport.firebaseapp.com",
  databaseURL:
    "https://liem-transport-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "liem-transport",
  storageBucket: "liem-transport.appspot.com",
  messagingSenderId: "217198337863",
  appId: "1:217198337863:web:d847f24b6e7cf307dc7662",
};
export const app = firebase.initializeApp(firebaseCfg);

const auth = getAuth();
export const db = firebase.firestore();
// const db = getFirestore(app);
// const firestore = firebase.firestore();

interface CredentialProps {
  em: string;
  pass: string;
}
interface InfoProps {
  admin?: boolean;
  email: string;
  experience?: number;
  efficiency?: number;
  license: string;
  name: string;
  phone: string;
  private: {
    password: string;
    address: string;
  };
  status?: string;
  trip?: number;
}
export interface VehicleProps {
  type: string;
  dimension: {
    height: number;
    length: number;
    width: number;
  };
  fuel: string;
  maintenanceHistory: [];
  model: string;
  odometer: number;
  status: "active";
  weight: number;
  yearMade: number;
}

interface TripProps {
  // start: keyof typeof Location;
  // end: keyof typeof Location;
  // start: number;
  // end: number;
  start: string;
  end: string;
  timeEst?: number;
  vehicleType: string;
  // vehicle?: string;
  // driver?: string;
  [key: string]: any;
}

enum Location {
  HCMC = 1,
  HN = 30,
  VT = 3,
}
enum License {
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5,
}
enum vehicleLicense {
  SUV = "B",
  Sedan = "B",
  Sports = "B",
  Coach = "D",
  Truck = "C",
  Container = "F",
}
enum vehiclePrice {
  SUV = 0.07,
  Sedan = 0.1,
  Sports = 0.3,
  Coach = 0.03,
  Truck = 0.08,
  Container = 0.12,
}
//
// ---------------USER FUNCTION
//
function CreateAcc(info: InfoProps) {
  const email = info.email;
  const password = info.private.password;

  // console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      // location.replace(location.href);
      let thingsRef = db.collection("UserData");

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // console.log(user.uid);
          thingsRef
            .doc(user.uid)
            .set({
              ...info,
              licenseRank: License[info.license as keyof typeof License],
            })
            .then(() => {
              console.log("SignUp successful");
              alert(
                "Bạn đã tạo tài khoản thành công, hệ thống sẽ tự đăng nhập"
              );
              console.log("Document successfully written!");
              location.reload();
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      });
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      alert("Đăng ký xảy ra lỗi, vui lòng đăng ký lại");
    });
}
function Login({ em, pass }: CredentialProps) {
  const email = em;
  const password = pass;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      console.log("SignIn");
      // console.log(user);
      alert("Bạn đã đăng nhập thành công");
      location.reload();
      // location.replace(location.href);
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      // console.log("asdf", errorCode);
      console.log(errorMessage);
      alert("Tài khoản này chưa được đăng ký hoặc sai thông tin");
    });
}

function SignOut() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Signed Out");
      alert("Bạn đã đăng xuất thành công");
    })
    .catch((error) => {
      // An error happened.
      console.log(error.message);
    });
}

function Status() {
  const [user] = useAuthState(auth);
  if (user) {
    return (
      <div className="dropdown position-sticky bottom-0 start-100 mx-4 z-1">
        <button
          className="btn btn-daark dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <a type="button" className="dropdown-item" href="/account">
              Thông tin cá nhân
            </a>
          </li>
          <li>
            <a
              type="button"
              className="dropdown-item"
              href="/"
              onClick={SignOut}
            >
              Đăng Xuất
            </a>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-primary allign-self-end ms-auto p-2 order-1 m-2"
          data-bs-toggle="modal"
          data-bs-target="#CreateAccModal"
        >
          Đăng Ký
        </button>
        <button
          type="button"
          className="btn btn-outline-primary allgin-self-end p-2 order-2 m-2"
          data-bs-toggle="modal"
          data-bs-target="#AuthModal"
        >
          Đăng Nhập
        </button>
      </>
    );
  }
}

function updateUser(info: InfoProps, uid: any) {
  const dataRef = db.collection("UserData").doc(uid);
  updateDoc(dataRef, info)
    .then(() => {
      console.log("Update user info successful");
      alert("Bạn đã cập nhật thông tin thành công!");
      // location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}

function requestAuth() {
  const [user] = useAuthState(auth);

  return user;
}
function deleteAuth(user: any) {
  // console.log(user);
  deleteUser(user)
    .then(() => {
      console.log("User deleted");
      deleteDoc(doc(db, "UserData", user.uid))
        .then(() => {
          console.log("User document deleted from database");
          alert("Tài khoản bị xóa thành công");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}
//
// ---------------VEHICLE FUNCTION
//
function uploadVehicle(vehicle: VehicleProps, plate: string) {
  const dataRef = doc(
    collection(db, "VehicleData/" + vehicle.type + "/available/"),
    plate
  );
  setDoc(dataRef, vehicle)
    .then(() => {
      console.log("Update vehicle successful");
      alert("Bạn đã thêm phương tiện thành công!");
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateVehicle(vehicle: VehicleProps, plate: string) {
  const dataRef = db
    .collection("VehicleData/" + vehicle.type + "/available/")
    .doc(plate);
  updateDoc(dataRef, vehicle)
    .then(() => {
      console.log("Update vehicle successful");
      alert("Bạn đã cập nhật phương tiện thành công!");
      location.reload();
    })
    .catch((err) => {
      if (err.code === "permission-denied")
        alert("Bạn cần đăng nhập để sử dụng tính năng này");
      console.log(err);
    });
}
function deleteVehicle(vehicle: any) {
  const dataRef = doc(
    db,
    "VehicleData/" + vehicle.type + "/available/" + vehicle.plate
  );
  deleteDoc(dataRef)
    .then(() => {
      console.log("Remove vehicle successful");
      location.reload();
    })
    .catch((err) => {
      if (err.code === "permission-denied")
        alert("Bạn cần đăng nhập để sử dụng tính năng này");
      console.log(err);
    });
}
function maintenanceVehicleReport(report: string, vehicle: any) {
  const dataRef = db
    .collection("VehicleData/" + vehicle.type + "/available/")
    .doc(vehicle.plate);
  updateDoc(dataRef, { status: "maintenance", problem: report })
    .then(() => {
      console.log("Report maintenance vehicle successful");
      alert("Bạn đã báo cáo vấn đề thành công!");
      location.reload();
    })
    .catch((err) => {
      if (err.code === "permission-denied")
        alert("Bạn cần đăng nhập để sử dụng tính năng này");
      console.log(err);
    });
}
function fixVehicleReport(report: string, vehicle: any) {
  const dataRef = db
    .collection("VehicleData/" + vehicle.type + "/available/")
    .doc(vehicle.plate);
  updateDoc(dataRef, {
    status: "active",
    maintenanceHistory: arrayUnion(report),
    problem: "",
  })
    .then(() => {
      console.log("Report maintenance vehicle successful");
      alert("Bạn đã báo cáo vấn đề thành công!");
      location.reload();
    })
    .catch((err) => {
      if (err.code === "permission-denied")
        alert("Bạn cần đăng nhập để sử dụng tính năng này");
      console.log(err);
    });
}
//
// ---------------TRIP FUNCTION
//
async function createTrip(tripInfo: TripProps) {
  const dist = Math.abs(
    Location[tripInfo.start as keyof typeof Location] -
      Location[tripInfo.end as keyof typeof Location]
  );
  const vehicleRef = collection(
    db,
    "VehicleData/",
    tripInfo.vehicleType,
    "available"
  );
  const timeEst = dist > 0 ? dist : 0.5;
  const userRef = collection(db, "UserData");
  const tripRef = collection(db, "TripData");
  const vehicleType = tripInfo.vehicleType as keyof typeof vehicleLicense;

  const userQuery = query(
    userRef,
    where(
      "licenseRank", // Prioritize the lowest License for optimal selection
      ">=", // Save the higher License for a higher requirement trip
      License[vehicleLicense[vehicleType] as keyof typeof License]
    ),
    orderBy("licenseRank", "asc"),
    where("experience", ">=", dist > 0 ? timeEst * 10 : 0), // Query for experience = timeEst * 10
    orderBy("experience", "desc"), // Order by higher experience
    where("status", "==", "active"), // Query for active user
    where("admin", "==", false), // Query for driver not admin

    limit(1)
  );

  const vehicleQuery = query(
    vehicleRef,
    // Query for active vehicle
    where("status", "==", "active"),
    limit(1)
  );

  const userQuerySnapshot = await getDocs(userQuery);
  const driverInfo = await Promise.all(
    userQuerySnapshot.docs.map((doc) => {
      return {
        uid: doc.id,
        name: doc.data().name,
      };
    })
  );
  // console.log(driverInfo[0]);

  let vehicleCost = 1;

  const vehicleQuerySnapshot = await getDocs(vehicleQuery);
  const vehicleInfo = await Promise.all(
    vehicleQuerySnapshot.docs.map((doc) => {
      vehicleCost = vehiclePrice[doc.data().type as keyof typeof vehiclePrice];
      return {
        plate: doc.id,
        model: doc.data().model,
      };
    })
  );
  if (driverInfo.length > 0 && vehicleInfo.length > 0) {
    updateDoc(doc(userRef, driverInfo[0].uid), { status: "busy" });
    updateDoc(doc(vehicleRef, vehicleInfo[0].plate), { status: "busy" });
    // Cost đã được tính vào tiền loại xe và xăng xe, các chi phí trừ khác
    // Vì đã bao gồm loại xe nên hạng GPLX của tài xế cũng đã bao gồm
    // Nên tiền tài xế cũng đã được gộp chung vào hệ số vehicleCost
    // Lương nhân viên không tính theo kinh nghiệm vì như thế sẽ mất công bằng
    tripInfo.cost = timeEst * 1000 * vehicleCost;
    tripInfo.status = "pending";
    tripInfo.driver = {
      uid: driverInfo[0].uid,
      name: driverInfo[0].name,
    };
    tripInfo.vehicle = {
      plate: vehicleInfo[0].plate,
      model: vehicleInfo[0].model,
    };
    tripInfo.timeEst = timeEst;
    // console.log(tripInfo.cost);
    addDoc(tripRef, tripInfo)
      .then(() => {
        console.log("Create trip successful");
        alert("Gửi yêu cầu chuyến đi thành công, vui lòng chờ xác nhận");
        location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      });
  } else {
    console.log(driverInfo);
    console.log(vehicleInfo);
    console.log("No driver or vehicle available");
    alert(
      "Hiện không tìm được tài xế hoặc phương tiện phù hợp, yêu cầu chuyến đi không thành công."
    );
  }
}

function finishTrip(time: Date, trip: any) {
  // Exp count in minutes instead hours for research purposes
  // To convert it to hours divide by 60 one more
  const exp =
    Math.floor(((time.getTime() - trip.timeStart) / 1000 / 60) * 100) / 100;
  // If late then timeEst > exp => degrade H
  // If early then timeEst < exp => H > 1 => upgrade H
  const H = Math.floor((trip.timeEst / exp) * 100) / 100;
  const tripRef = doc(db, "TripData", trip.tripId);
  const userRef = doc(db, "UserData", trip.userUID);
  // console.log(exp);
  const vehicleRef = doc(
    db,
    "VehicleData",
    trip.vehicleType,
    "available",
    trip.vehiclePlate
  );
  // 1. Get User Doc
  getDoc(userRef)
    .then((userDoc) => {
      const currEfficiency = userDoc.data()?.efficiency;
      const calcEfficiency = Math.floor(((currEfficiency + H) / 2) * 100) / 100;
      const newEfficiency = calcEfficiency > 1 ? 1 : calcEfficiency;
      // 2. Update User Doc
      updateDoc(userRef, {
        status: "active",
        efficiency: newEfficiency,
        trip: increment(1),
        experience: increment(exp),
      }).then(() => {
        console.log("Update status of User successful");
        // 3. Update Vehicle Doc
        updateDoc(vehicleRef, { status: "active" }).then(() => {
          // 4. Store Trip Completed Doc
          getDoc(tripRef)
            .then((tripDoc) => {
              const completeRef = doc(db, "Revenue", "RevenueData");
              const completedTrip = tripDoc.data();
              // 5. Update Sum Revenue
              updateDoc(completeRef, { sum: increment(completedTrip?.cost) })
                .then(() => {
                  // 6. Store Completed Trip
                  setDoc(
                    doc(
                      db,
                      "Revenue",
                      "RevenueData",
                      "TripCompleted",
                      trip.tripId
                    ),
                    { ...completedTrip, timeFinish: time }
                  )
                    .then(() => {
                      // 7. Complete and delete current Trip Doc
                      console.log("Store completed trip successful");
                      deleteDoc(tripRef);
                      console.log("Update status of Vehicle successful");
                      alert("Xác nhận hoàn thành chuyến đi thành công");
                      location.reload();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    })
    .catch((err) => {
      console.log("Get Doc error");
      console.log(err);
    });
}
function confirmTrip(tripId: any) {
  const tripRef = doc(db, "TripData", tripId);
  updateDoc(tripRef, { status: "active", timeStart: Timestamp.now().toDate() })
    .then(() => {
      console.log("Trip confirmed");
      alert("Chuyến đi được xác nhận thành công");
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
function rejectTrip(trip: any) {
  const tripRef = doc(db, "TripData", trip.tripId);
  const userRef = doc(db, "UserData", trip.userUID);
  const vehicleRef = doc(
    db,
    "VehicleData",
    trip.vehicleType,
    "available",
    trip.vehiclePlate
  );
  getDoc(userRef).then((doc) => {
    const currEfficiency = doc.data()?.efficiency;
    // If reject first then don't affect efficiency
    // If declined after confirm then assume efficiency = 0, degrade driver efficiency
    const newEfficiency = trip.rejectFirst
      ? currEfficiency
      : Math.floor(((currEfficiency + 0) / 2) * 100) / 100;
    // console.log(newEfficiency);
    updateDoc(userRef, { status: "active", efficiency: newEfficiency }).then(
      () => {
        console.log("Update status of User successful");
        updateDoc(vehicleRef, { status: "active" }).then(() => {
          deleteDoc(tripRef);
          console.log("Update status of Vehicle successful");
          alert("Xác nhận hủy bỏ chuyến đi thành công");
          location.reload();
        });
      }
    );
  });
}
//
// --------------- Revenue FUNCTION
//
function resetRevenue() {
  const revenueRef = doc(db, "Revenue", "RevenueData");
  // 5. Update Sum Revenue
  updateDoc(revenueRef, { sum: 0 })
    .then(() => {
      console.log("Reset Revenue successful");
      alert("Reset doanh thu thành công");
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
const UserFunc = {
  Login,
  SignOut,
  Status,
  CreateAcc,
  requestAuth,
  deleteAuth,
  uploadVehicle,
  updateUser,
  updateVehicle,
  deleteVehicle,
  maintenanceVehicleReport,
  fixVehicleReport,
  createTrip,
  finishTrip,
  confirmTrip,
  rejectTrip,
  resetRevenue,
};
export default UserFunc;
