// import Form from "react-bootstrap/Form";
// import { useState } from "react";
import Auth from "../Auth";

interface Props {
  name: string;
}

function ListGroup({ name }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("pass") as HTMLInputElement;
    Auth.Login({ em: email.value, pass: password.value });
  };

  const createAcc = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("abc");
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("pass") as HTMLInputElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const address = form.elements.namedItem("address") as HTMLInputElement;
    const license = form.elements.namedItem("license") as HTMLInputElement;
    Auth.CreateAcc({
      credential: {
        email: email.value,
        password: password.value,
      },
      na: name.value,
      addr: address.value,
      lic: license.checked,
    });
  };

  return (
    <nav className="nav navbar navbar-expand-md bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand p-3 disabled" aria-disabled="true">
          {name}
        </a>
        <div className="navbar-collapse collapse" id="navbarToggler">
          <ul className="nav-underline nav-pills nav-fill navbar-nav me-auto mb-2 mb-lg-0 navbar-nav-scroll">
            <a className="nav-item nav-link" href="../../index.html">
              Trang Chủ
            </a>
            <a className="nav-item nav-link" href="../../Trip/trip.html">
              Lịch Trình
            </a>
            <a className="nav-item nav-link" href="../../Vehicle/vehicle.html">
              Đội Xe
            </a>
            <a className="nav-item nav-link" href="../../Driver/driver.html">
              Đội Tài Xế
            </a>
          </ul>
        </div>
        {Auth.Status()}

        {/* Modal */}
        <div
          className="modal fade"
          id="AuthModal"
          aria-labelledby="AuthModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="AuthModalLabel">
                  Đăng Nhập Tài Khoản
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Email */}
                  <div className="mb-1">
                    <label htmlFor="emailInput" className="mb-2">
                      Email:
                    </label>
                    <input
                      id="emailInput"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="example@example.com"
                    ></input>
                  </div>
                  {/* Password */}
                  <div className="mb-1">
                    <label htmlFor="passInput" className="mb-2">
                      Mật Khẩu:
                    </label>
                    <input
                      id="passInput"
                      name="pass"
                      type="password"
                      className="form-control"
                      placeholder="******"
                    ></input>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    name="login"
                    className="btn btn-primary"
                    // data-bs-dismiss="modal"
                  >
                    Đăng Nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Create Acc Modal */}
        <div
          className="modal fade"
          id="CreateAccModal"
          aria-labelledby="CreateAccModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="CreateAccModalLabel">
                  Đăng Ký Tài Khoản
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form className="was-validated" onSubmit={createAcc}>
                <div className="modal-body">
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="validationEmailarea" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="validationEmailarea"
                      placeholder="example@example.com"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Vui lòng nhập email đăng ký.
                    </div>
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="validationPasswordarea"
                      className="form-label"
                    >
                      Mật Khẩu
                    </label>
                    <input
                      type="password"
                      name="pass"
                      minLength={6}
                      className="form-control"
                      id="validationPasswordarea"
                      placeholder="******"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                    </div>
                  </div>
                  {/* Tên */}
                  <div className="mb-3">
                    <label htmlFor="validationNamearea" className="form-label">
                      Tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="validationNamearea"
                      placeholder="Nguyễn Văn A"
                      required
                    ></input>
                    <div className="invalid-feedback">Vui lòng nhập Tên.</div>
                  </div>
                  {/* Địa Chỉ */}
                  <div className="mb-3">
                    <label
                      htmlFor="validationAddressarea"
                      className="form-label"
                    >
                      Địa Chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      id="validationAddressarea"
                      placeholder="Đường XYZ P6 Q9"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Vui lòng nhập địa chỉ.
                    </div>
                  </div>
                  {/* GPLX */}
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck"
                      value=""
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck"
                    >
                      GPLX
                    </label>
                    <div className="invalid-feedback">Xác nhận bạn có GPLX</div>
                    <div className="valid-feedback">
                      Bạn chịu mọi trách nhiệm về thông tin GPLX của bạn
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    name="signup"
                    className="btn btn-success"
                    // data-bs-dismiss="modal"
                  >
                    Đăng Ký
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default ListGroup;
