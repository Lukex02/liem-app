import AuthFunction from "../Auth";

interface Props {
  name: string;
}

function ListGroup({ name }: Props) {
  const Auth = AuthFunction.getInstance();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("pass") as HTMLInputElement;
    Auth.Login(email.value, password.value);
  };
  const createAcc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("pass") as HTMLInputElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const address = form.elements.namedItem("address") as HTMLInputElement;
    const license = form.elements.namedItem("license") as HTMLInputElement;
    Auth.CreateAcc(
      {
        admin: false,
        email: email.value,
        experience: 0,
        efficiency: 1,
        license: license.value,
        name: name.value,
        phone: phone.value,
        status: "active",
        trip: 0,
      },
      {
        password: password.value,
        address: address.value,
      }
    );
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
            <a className="nav-item nav-link" href="/">
              Trang Chủ
            </a>
            <a className="nav-item nav-link" href="/trip">
              Chuyến Đi
            </a>
            <a className="nav-item nav-link" href="/vehicle">
              Đội Xe
            </a>
            <a className="nav-item nav-link" href="/driver">
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
                  {/* Số điện thoại */}
                  <div className="mb-3">
                    <label htmlFor="validationPhonearea" className="form-label">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      maxLength={10}
                      minLength={10}
                      className="form-control"
                      id="validationPhonearea"
                      placeholder="0123456789"
                      pattern="[0-9]*"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Vui lòng nhập số điện thoại (10 chữ số).
                    </div>
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
                  <p className="text">GPLX</p>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck_B"
                      value="B"
                      // onChange={onOptionChange}
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck_B"
                    >
                      Hạng B
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck_C"
                      value="C"
                      // onChange={onOptionChange}
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck_C"
                    >
                      Hạng C
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck_D"
                      value="D"
                      // onChange={onOptionChange}
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck_D"
                    >
                      Hạng D
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck_E"
                      value="E"
                      // onChange={onOptionChange}
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck_E"
                    >
                      Hạng E
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="radio"
                      name="license"
                      className="form-check-input"
                      id="validationLicenseCheck_F"
                      value="F"
                      // onChange={onOptionChange}
                      required
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor="validationLicenseCheck_F"
                    >
                      Hạng F
                    </label>
                    <div className="invalid-feedback">Xác nhận GPLX</div>
                    {/* <div className="valid-feedback">
                        Bạn đảm bảo mọi trách nhiệm về thông tin GPLX của bạn
                      </div> */}
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
