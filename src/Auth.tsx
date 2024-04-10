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
// import { documentId } from "firebase/firestore";
// import {
//   getFirestore,
//   doc,
//   setDoc,
// } from "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAHG2MnxuKj2sR9JpFiK0EW13mCO6DgiZM",
  authDomain: "liem-transport.firebaseapp.com",
  databaseURL:
    "https://liem-transport-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "liem-transport",
  storageBucket: "liem-transport.appspot.com",
  messagingSenderId: "217198337863",
  appId: "1:217198337863:web:d847f24b6e7cf307dc7662",
});

const auth = getAuth();
const db = firebase.firestore();
// const firestore = firebase.firestore();

interface CredentialProps {
  em: string;
  pass: string;
}
interface InfoProps {
  credential: {
    email: string;
    password: string;
  };
  na: string;
  addr: string;
  lic: boolean;
}

function CreateAcc({ credential, na, addr, lic }: InfoProps) {
  const email = credential.email;
  const password = credential.password;

  // console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("SignUp successful");
      console.log(user);
      alert("Bạn đã tạo tài khoản thành công, hệ thống sẽ tự đăng nhập");
      // location.replace(location.href);
      let thingsRef = db.collection("UserData");

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // console.log(user);
          thingsRef
            .add({
              email: credential.email,
              password: credential.password,
              name: na,
              address: addr,
              lic: lic,
              experience: 0,
            })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      });
      location.reload();
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
      <button
        type="button"
        className="btn btn-outline-primary position-sticky bottom-50 start-50 translate-middle-x"
        onClick={SignOut}
      >
        Đăng Xuất
      </button>
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

const UserFunc = {
  Login,
  SignOut,
  Status,
  CreateAcc,
  requestAuth,
};
export default UserFunc;
