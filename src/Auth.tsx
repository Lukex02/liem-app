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
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  // and,
  // arrayRemove,
  // arrayUnion,
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
// import { useState } from "react";

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
  experience: number;
  efficency: number;
  license: string;
  name: string;
  phone: string;
  private: {
    password: string;
    address: string;
  };
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
          console.log(user.uid);
          thingsRef
            .doc(user.uid)
            .set(info)
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
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("SignIn");
      console.log(user);
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
            <a type="button" className="dropdown-item" href="../account.html">
              Thông tin cá nhân
            </a>
          </li>
          <li>
            <a
              type="button"
              className="dropdown-item"
              href="../index.html"
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

function requestAuth() {
  const [user] = useAuthState(auth);

  return user;
}

function uploadVehicle(vehicle: VehicleProps, plate: string) {
  // console.log(plate);
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

// function updateVehicle(vehicle: VehicleProps, oldVehicle: any) {
function updateVehicle(vehicle: VehicleProps, plate: string) {
  // console.log(plate);
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
  // console.log("OLD");
  // console.log(vehicle);
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

async function createTrip(tripInfo: TripProps) {
  const vehiclePrice = [0.03, 0.08, 0.12];
  const dist = Math.abs(
    Location[tripInfo.start as keyof typeof Location] -
      Location[tripInfo.end as keyof typeof Location]
  );
  const timeEst = dist > 0 ? dist : 0.5;
  const vehicleRef = collection(
    db,
    "VehicleData/",
    tripInfo.vehicleType,
    "available"
  );
  const userRef = collection(db, "UserData");
  const tripRef = collection(db, "TripData");

  const userQuery = query(
    userRef,
    where("experience", ">=", timeEst * 10),
    where("status", "==", "active"),
    where("admin", "==", false),
    orderBy("experience"),
    limit(1)
  );

  const vehicleQuery = query(
    vehicleRef,
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
  let vehicleCost = 1;

  const vehicleQuerySnapshot = await getDocs(vehicleQuery);
  const vehicleInfo = await Promise.all(
    vehicleQuerySnapshot.docs.map((doc) => {
      // console.log(doc.id, " => ", doc.data());
      if (doc.data().type == "Coach") {
        vehicleCost = vehiclePrice[0];
      }
      if (doc.data().type == "Truck") {
        vehicleCost = vehiclePrice[1];
      }
      if (doc.data().type == "Container") {
        vehicleCost = vehiclePrice[2];
      }
      // }
      return {
        plate: doc.id,
        model: doc.data().model,
      };
    })
  );
  if (driverInfo.length > 0 && vehicleInfo.length > 0) {
    updateDoc(doc(userRef, driverInfo[0].uid), { status: "busy" });
    updateDoc(doc(vehicleRef, vehicleInfo[0].plate), { status: "busy" });

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
      // addDoc(tripRef, { ...tripInfo, timeStart: Timestamp.now().toDate() })
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
  const vehicleRef = doc(
    db,
    "VehicleData",
    trip.vehicleType,
    "available",
    trip.vehiclePlate
  );
  getDoc(userRef)
    .then((doc) => {
      const currEfficiency = doc.data()?.efficiency;
      const calcEfficiency = Math.floor(((currEfficiency + H) / 2) * 100) / 100;
      const newEfficiency = calcEfficiency > 1 ? 1 : calcEfficiency;
      // console.log(newEfficiency);
      updateDoc(userRef, {
        status: "active",
        efficiency: newEfficiency,
        trip: increment(1),
        experience: increment(exp),
      }).then(() => {
        console.log("Update status of User successful");
        updateDoc(vehicleRef, { status: "active" }).then(() => {
          deleteDoc(tripRef);
          console.log("Update status of Vehicle successful");
          alert("Xác nhận hoàn thành chuyến đi thành công");
          location.reload();
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

const UserFunc = {
  Login,
  SignOut,
  Status,
  CreateAcc,
  requestAuth,
  uploadVehicle,
  updateUser,
  updateVehicle,
  deleteVehicle,
  createTrip,
  finishTrip,
  confirmTrip,
  rejectTrip,
};
export default UserFunc;
