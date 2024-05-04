import AuthFunction from "../Auth";
import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { displayAddVehicle } from "./utilities";

function AccInfo() {
  const Auth = AuthFunction.getInstance();
  const [userData, setUserData] = useState<any | null>(null);
  const [revenueData, setRevenueData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = Auth.requestAuth();
  const dataRef = Auth.db.collection("UserData").doc(auth?.uid);
  const RevenueRef = Auth.db.collection("Revenue").doc("RevenueData");

  useEffect(() => {
    const fetchUser = async () => {
      const docSnap = await getDoc(dataRef);
      setLoading(true);
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        const privateData = await getDoc(
          doc(dataRef, "private", "privateData")
        );
        if (privateData.exists()) {
          setUserData({ ...docSnap.data(), ...privateData.data() });
        } else {
          // console.log(docSnap);
          console.log("No Document");
        }
      } else {
        // console.log(docSnap);
        console.log("No Document");
      }
    };
    fetchUser();
  }, [loading]);
  // console.log(userData);
  useEffect(() => {
    const fetchRevenue = async () => {
      const docSnap = await getDoc(RevenueRef);
      setLoading(true);
      if (docSnap.exists()) {
        setRevenueData(docSnap.data());
        // console.log(docSnap.data());
      } else {
        // console.log(docSnap);
        console.log("No Document");
      }
    };
    fetchRevenue();
  }, [loading]);

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
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const address = form.elements.namedItem("address") as HTMLInputElement;
    const license = form.elements.namedItem("license") as HTMLInputElement;
    Auth.updateUser(
      {
        email: email.value,
        license: license.value,
        name: name.value,
        phone: phone.value,
      },
      {
        address: address.value,
      }
    );
  };
  const handleDeleteAcc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const oldPassword = form.elements.namedItem("oldPass") as HTMLInputElement;
    if (oldPassword.value == userData.password) {
      Auth.deleteAuth(oldPassword.value);
    } else {
      console.log("Old password doesn't match");
      alert("Mật khẩu cũ không khớp");
    }
  };
  const handleUpdatePass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const oldPassword = form.elements.namedItem("oldPass") as HTMLInputElement;
    const newPassword = form.elements.namedItem("newPass") as HTMLInputElement;
    const newRePassword = form.elements.namedItem(
      "newRePass"
    ) as HTMLInputElement;
    if (oldPassword.value == userData.password) {
      if (newPassword.value == newRePassword.value) {
        Auth.updatePass(newPassword.value, oldPassword.value);
      } else {
        console.log("New password doesn't match");
        alert("Mật khẩu mới và nhập lại mật khẩu mới không khớp");
      }
    } else {
      console.log("Old password doesn't match");
      alert("Mật khẩu cũ không khớp");
    }
  };
  document.title = "Tài Khoản";
  return (
    <>
      {userData ? (
        <div>
          <ListGroup name={"Thông tin cá nhân"} />
          {/* Info Card */}
          <div className="card m-5 position-relative">
            <div className="card-body">
              <h5 className="card-title">Thông tin người dùng</h5>
              <p className="card-text">Tên: {userData.name}</p>
              <p className="card-text">Email: {userData.email}</p>
              <p className="card-text">Địa chỉ: {userData.address}</p>
              <p className="card-text">Số điện thoại: {userData.phone}</p>
              <p className="card-text">GPLX hạng: {userData.license}</p>
              {userData.admin && (
                <div>
                  <p className="card-text text-warning fs-4">
                    Tài khoản có quyền ADMIN
                  </p>
                  <p className="card-text text-warning fs-4">
                    Doanh thu hiện tại: {revenueData.sum * 1000} (VND)
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      Auth.resetRevenue();
                    }}
                  >
                    RESET DOANH THU
                  </button>
                </div>
              )}
            </div>
            <img
              src={"/pics/default_avatar.jpg"}
              className="card-img-top p-3 rounded-3 position-absolute end-0 d-none d-sm-block"
              alt="..."
              style={{ width: "13rem" }}
            ></img>
            {/* Update Info Button */}
            <div>
              <button
                type="button"
                className="btn btn-outline-primary m-3"
                data-bs-toggle="modal"
                data-bs-target="#updateInfo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-fill-gear"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                </svg>
                Cập nhật thông tin
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-outline-warning m-3"
                data-bs-toggle="modal"
                data-bs-target="#updatePass"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-lock"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                </svg>
                Cập nhật mật khẩu
              </button>
            </div>
            {/* Update Info Modal */}
            <div className="modal fade" id="updateInfo">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Cập nhật thông tin</h5>
                  </div>
                  <form className="was-validated" onSubmit={handleUpdate}>
                    <div className="modal-body">
                      {/* Email */}
                      <div className="mb-3">
                        <label htmlFor="updateEmailarea" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="updateEmailarea"
                          placeholder="example@example.com"
                          defaultValue={userData.email}
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập email đăng ký.
                        </div>
                      </div>
                      {/* Password */}
                      <div className="mb-3">
                        <label
                          htmlFor="updatePasswordarea"
                          className="form-label"
                        >
                          Mật Khẩu
                        </label>
                        <input
                          type="password"
                          name="pass"
                          minLength={6}
                          className="form-control"
                          id="updatePasswordarea"
                          placeholder="******"
                          defaultValue={userData.password}
                          required
                          disabled
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                        </div>
                      </div>
                      {/* Tên */}
                      <div className="mb-3">
                        <label htmlFor="updateNamearea" className="form-label">
                          Tên
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          id="updateNamearea"
                          placeholder="Nguyễn Văn A"
                          defaultValue={userData.name}
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập Tên.
                        </div>
                      </div>
                      {/* Số điện thoại */}
                      <div className="mb-3">
                        <label htmlFor="updatePhonearea" className="form-label">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          name="phone"
                          maxLength={10}
                          minLength={10}
                          className="form-control"
                          id="updatePhonearea"
                          placeholder="0123456789"
                          pattern="[0-9]*"
                          defaultValue={userData.phone}
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập số điện thoại (10 chữ số).
                        </div>
                      </div>
                      {/* Địa Chỉ */}
                      <div className="mb-3">
                        <label
                          htmlFor="updateAddressarea"
                          className="form-label"
                        >
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          id="updateAddressarea"
                          placeholder="Đường XYZ P6 Q9"
                          defaultValue={userData.address}
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập địa chỉ.
                        </div>
                      </div>
                      {/* GPLX */}
                      <p className="text">GPLX</p>
                      <div className="form-check mb-3">
                        <input
                          type="radio"
                          name="license"
                          className="form-check-input"
                          id="updateLicenseCheck_B"
                          value="B"
                          required
                        ></input>
                        <label
                          className="form-check-label"
                          htmlFor="updateLicenseCheck_B"
                        >
                          Hạng B
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="radio"
                          name="license"
                          className="form-check-input"
                          id="updateLicenseCheck_C"
                          value="C"
                          required
                        ></input>
                        <label
                          className="form-check-label"
                          htmlFor="updateLicenseCheck_C"
                        >
                          Hạng C
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="radio"
                          name="license"
                          className="form-check-input"
                          id="updateLicenseCheck_D"
                          value="D"
                          required
                        ></input>
                        <label
                          className="form-check-label"
                          htmlFor="updateLicenseCheck_D"
                        >
                          Hạng D
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="radio"
                          name="license"
                          className="form-check-input"
                          id="updateLicenseCheck_E"
                          value="E"
                          required
                        ></input>
                        <label
                          className="form-check-label"
                          htmlFor="updateLicenseCheck_E"
                        >
                          Hạng E
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="radio"
                          name="license"
                          className="form-check-input"
                          id="updateLicenseCheck_F"
                          value="F"
                          required
                        ></input>
                        <label
                          className="form-check-label"
                          htmlFor="updateLicenseCheck_F"
                        >
                          Hạng F
                        </label>
                        <div className="invalid-feedback">Xác nhận GPLX</div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        name="add"
                        className="btn btn-primary"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Update Password Modal */}
            <div className="modal fade" id="updatePass">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Thay đổi mật khẩu</h5>
                  </div>
                  <form className="was-validated" onSubmit={handleUpdatePass}>
                    <div className="modal-body">
                      {/* Old Password */}
                      <div className="mb-3">
                        <label htmlFor="oldPasswordarea" className="form-label">
                          Nhập lại mật khẩu cũ
                        </label>
                        <input
                          type="password"
                          name="oldPass"
                          minLength={6}
                          className="form-control"
                          id="oldPasswordarea"
                          placeholder="******"
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                        </div>
                      </div>
                      {/* New Password */}
                      <div className="mb-3">
                        <label htmlFor="newPasswordarea" className="form-label">
                          Nhập mật khẩu mới
                        </label>
                        <input
                          type="password"
                          name="newPass"
                          minLength={6}
                          className="form-control"
                          id="newPasswordarea"
                          placeholder="******"
                          required
                        ></input>
                        <div className="invalid-feedback">
                          Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                        </div>
                      </div>
                      {/* New Repeat Password */}
                      <div className="mb-3">
                        <label
                          htmlFor="newRePasswordarea"
                          className="form-label"
                        >
                          Nhập lại mật khẩu mới
                        </label>
                        <input
                          type="password"
                          name="newRePass"
                          minLength={6}
                          className="form-control"
                          id="newRePasswordarea"
                          placeholder="******"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        name="add"
                        className="btn btn-danger"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="card m-5">
            <div className="card-body">
              <h5 className="card-title">
                Kinh nghiệm: {Math.floor(userData.experience * 100) / 100} (giờ)
              </h5>
              <p className="card-text">
                Số chuyến đi đã thực hiện: {userData.trip}
              </p>
              <div className="progress m-3">
                <div
                  className="progress-bar"
                  style={{ width: `${userData.efficiency * 100}%` }}
                ></div>
              </div>
              <p className="card-text">
                Hiệu suất của tài xế: {userData.efficiency * 100}%
              </p>
            </div>
          </div>
          {/* Delete Account Button */}
          {userData.status == "busy" ? (
            <div className="text-center p-3">
              <button type="button" className="btn btn-danger" disabled>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-x-fill"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708"
                  />
                </svg>
                Xóa tài khoản
              </button>
            </div>
          ) : (
            <div className="text-center p-3">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteAcc"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-x-fill"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708"
                  />
                </svg>
                Xóa tài khoản
              </button>
            </div>
          )}
          {/* Delete Account Modal */}
          <div className="modal fade" id="deleteAcc">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xóa tài khoản</h5>
                </div>
                <form className="was-validated" onSubmit={handleDeleteAcc}>
                  <div className="modal-body">
                    {/* Old Password */}
                    <div className="mb-3">
                      <label
                        htmlFor="oldPasswordDeletearea"
                        className="form-label"
                      >
                        Nhập lại mật khẩu cũ
                      </label>
                      <input
                        type="password"
                        name="oldPass"
                        minLength={6}
                        className="form-control"
                        id="oldPasswordDeletearea"
                        placeholder="******"
                        required
                      ></input>
                      <div className="invalid-feedback">
                        Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Đóng
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Xóa
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Add Vehicle Button */}
          {userData.admin && (
            <div className="text-center p-3">
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
                <form onSubmit={handleSubmit}>
                  {/* Chọn loại Xe */}
                  {displayAddVehicle()}
                </form>
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
