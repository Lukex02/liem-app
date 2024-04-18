import Auth from "../Auth";
import "../style/utilities.css";
import ListGroup from "../component/ListGroup";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { db } from "../Auth";

function AccInfo() {
  const [userData, setUserData] = useState<any | null>(null);
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
    Auth.uploadVehicle({
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
    });
  };
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("pass") as HTMLInputElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const address = form.elements.namedItem("address") as HTMLInputElement;
    const license = form.elements.namedItem("license") as HTMLInputElement;
    Auth.updateUser(
      {
        email: email.value,
        experience: 0,
        license: license.value,
        name: name.value,
        phone: phone.value,
        private: {
          password: password.value,
          address: address.value,
        },
      },
      auth?.uid
    );
  };
  return (
    <>
      {userData ? (
        <div>
          <ListGroup name={"Thông tin cá nhân"} />
          {/* Info Card */}
          <div className="card m-5">
            <div className="card-body">
              <h5 className="card-title">Thông tin người dùng</h5>
              <p className="card-text">Tên: {userData.name}</p>
              <p className="card-text">Email: {userData.email}</p>
              <p className="card-text">Địa chỉ: {userData.private.address}</p>
              <p className="card-text">Số điện thoại: {userData.phone}</p>
              <p className="card-text">GPLX hạng: {userData.license}</p>
            </div>
            {/* Update Info Button */}
            <div>
              <button
                type="button"
                className="btn btn-primary m-3"
                data-bs-toggle="modal"
                data-bs-target="#updateInfo"
              >
                Cập nhật thông tin
              </button>
            </div>
            {/* Update Info Modal */}
            <div className="modal fade" id="updateInfo">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Thêm Phương Tiện</h5>
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
                          defaultValue={userData.private.password}
                          required
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
                          defaultValue={userData.private.addr}
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
          </div>
          {/* Progress Bar */}
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
          {/* Add Vehicle button */}
          <div className="position-absolute start-50 translate-middle-x">
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#addVehicle"
            >
              Thêm Phương Tiện
            </button>
          </div>
          {/* Add Vehicle Modal */}
          <div className="modal fade" id="addVehicle">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm Phương Tiện</h5>
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Chọn loại Xe */}
                  <div className="m-3">
                    <select className="form-select" id="type" name="type">
                      <option selected>Chọn loại xe</option>
                      <option value="Coach">Xe Du Lịch</option>
                      <option value="Container">Xe Container</option>
                      <option value="Truck">Xe Tải</option>
                    </select>
                  </div>
                  {/* Mã hiệu */}
                  <div className="m-3">
                    <label htmlFor="model" className="form-label">
                      Mã hiệu
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="model"
                    ></input>
                  </div>
                  {/* Kích thước */}
                  <div className="m-3">
                    <label className="form-label" htmlFor="length">
                      Kích thước (D x R x C)
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="length"
                        name="length"
                        maxLength={4}
                        pattern="[0-9]*"
                        required
                      ></input>
                      <span className="input-group-text">x</span>
                      <input
                        type="text"
                        className="form-control"
                        id="width"
                        name="width"
                        pattern="[0-9]*"
                        maxLength={4}
                      ></input>
                      <span className="input-group-text">x</span>
                      <input
                        type="text"
                        className="form-control"
                        name="height"
                        id="height"
                        pattern="[0-9]*"
                        maxLength={4}
                      ></input>
                    </div>
                  </div>
                  <div className="row g-2 m-3">
                    {/* Tải Trọng */}
                    <div className="col-md-4 mx-auto">
                      <label htmlFor="weight" className="form-label">
                        Tải trọng
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="weight"
                        name="weight"
                        maxLength={4}
                        pattern="[0-9]*"
                        required
                      ></input>
                    </div>
                    {/* Năm sản xuất */}
                    <div className="col-md-4 mx-auto">
                      <label htmlFor="yearMade" className="form-label">
                        Năm sản xuất
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="yearMade"
                        name="yearMade"
                        maxLength={4}
                        pattern="[0-9]*"
                        required
                      ></input>
                    </div>
                    {/* ODO */}
                    <div className="col-md-4 mx-auto">
                      <label htmlFor="odo" className="form-label">
                        ODO (km)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="odo"
                        name="odo"
                        required
                      ></input>
                    </div>
                  </div>
                  {/* Loại nhiên liệu */}
                  <div className="m-3">
                    <select className="form-select" id="fuel" name="fuel">
                      <option selected>Loại xăng sử dụng</option>
                      <option value="diesel">Diesel</option>
                      <option value="gas">Xăng</option>
                      <option value="e85">E85</option>
                    </select>
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
                      Lưu vào hệ thống
                    </button>
                  </div>
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
