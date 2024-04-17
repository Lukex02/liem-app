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
import { arrayUnion, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { getFirestore } from "firebase/firestore";
// import { getFirestore } from "firebase/firestore";
// import {
//   getFirestore,
//   doc,
//   setDoc,
// } from "firebase/firestore";
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
  email: string;
  experience: number;
  license: string;
  name: string;
  phone: string;
  private: {
    password: string;
    addr: string;
  };
}
interface VehicleProps {
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

function uploadVehicle(vehicle: VehicleProps) {
  // console.log(vehicle.name);
  const dataRef = db.collection("VehicleData").doc(vehicle.type);
  updateDoc(dataRef, { available: arrayUnion(vehicle) }).catch((err) => {
    console.log(err);
  });
  console.log("Update vehicle successful");
  alert("Bạn đã thêm phương tiện thành công!");
  location.reload();
}
function updateUser(info: InfoProps, uid: any) {
  const dataRef = db.collection("UserData").doc(uid);
  updateDoc(dataRef, info).catch((err) => {
    console.log(err);
  });
  console.log("Update user info successful");
  alert("Bạn đã cập nhật thông tin thành công!");
  // location.reload();
}
const UserFunc = {
  Login,
  SignOut,
  Status,
  CreateAcc,
  requestAuth,
  uploadVehicle,
  updateUser,
};
export default UserFunc;
