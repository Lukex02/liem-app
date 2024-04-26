export function displayAddVehicle() {
  return (
    <div>
      <div className="m-3">
        <select className="form-select" id="type" name="type">
          <option>Chọn loại xe</option>
          <option value="Coach">Xe Du Lịch</option>
          <option value="Container">Xe Container</option>
          <option value="Truck">Xe Tải</option>
          <option value="SUV">Xe SUV</option>
          <option value="Sports">Xe Thể Thao</option>
          <option value="Sedan">Xe Sedan</option>
        </select>
      </div>
      {/* Mã hiệu */}
      <div className="m-3">
        <label htmlFor="model" className="form-label">
          Mã hiệu
        </label>
        <input type="text" className="form-control" id="model"></input>
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
            minLength={4}
            pattern="[0-9]*"
            required
          ></input>
          <span className="input-group-text">x</span>
          <input
            type="text"
            className="form-control"
            id="width"
            name="width"
            maxLength={4}
            minLength={4}
            pattern="[0-9]*"
          ></input>
          <span className="input-group-text">x</span>
          <input
            type="text"
            className="form-control"
            name="height"
            id="height"
            maxLength={4}
            minLength={4}
            pattern="[0-9]*"
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
            minLength={4}
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
            minLength={4}
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
          <option>Loại xăng sử dụng</option>
          <option value="diesel">Diesel</option>
          <option value="gas">Xăng</option>
          <option value="e85">E85</option>
        </select>
      </div>
      {/* Biển Số Xe */}
      <div className="m-3">
        <label htmlFor="plate" className="form-label">
          Biển Số Xe (Định dạng: 00F12345)
        </label>
        <input
          type="text"
          className="form-control"
          id="plate"
          name="plate"
          maxLength={8}
          pattern="\d{2}[A-Z]\d{5}"
          required
        ></input>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Đóng
        </button>
        <button type="submit" name="add" className="btn btn-primary">
          Lưu vào hệ thống
        </button>
      </div>
    </div>
  );
}
