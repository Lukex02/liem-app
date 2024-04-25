export function confirmModal() {
  return (
    <div
      className="modal fade"
      id="confirm"
      aria-labelledby="confirmLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thông báo</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Bạn có chắc chắn chưa?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-outline-success">
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
