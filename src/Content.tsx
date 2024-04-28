import { useEffect, useState } from "react";
import AuthFunction from "./Auth";
import ListGroup from "./component/ListGroup";

function Content() {
  const Auth = AuthFunction.getInstance();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  function reDirect() {
    const user = Auth.requestAuth();
    // console.log(user);
    if (isLoading) {
      return (
        <div className="justify-content-center">
          <div className="spinner-border text-info m-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div>
          <ListGroup name={"Trang Chủ"} />
        </div>
        {/* Welcome Background */}
        <div className="container-fluid mb-3 p-0 m-0 position-relative">
          <img src={"/pics/homefull.jpg"} className="img-fluid"></img>
          <div
            className="figure-img display-2 position-absolute"
            style={{
              fontSize: "6.5vw",
              left: "1rem",
              bottom: "1rem",
            }}
          >
            The Liem Transport
            {user ? (
              <div className="fs-5 fw-light fst-italic text-center mt-2 d-none d-md-block">
                Chào bạn {user.email}
              </div>
            ) : (
              <div className="fs-5 fw-light fst-italic text-center mt-2">
                Hãy đăng nhập để trở thành tài xế của chúng tôi
              </div>
            )}
          </div>
        </div>
        {/* Vehicle Showcase */}
        <h1 className="p-3 m-0 text-center">Phương tiện</h1>
        <div className="py-3">
          <div
            id="carouselIntro"
            className="carousel slide mx-auto"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active position-relative">
                <img
                  src={"/pics/truck.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-light d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe Tải</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Đội ngũ xe tải hiện đại đa dạng
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={"/pics/container.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-light d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe Container</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Đội ngũ xe container chuyên nghiệp
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={"/pics/coach.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-dark d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe Khách</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Đội ngũ xe du lịch cao cấp sang trọng
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={"/pics/lx600.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-light d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe SUV</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Đa dạng từ 4 chỗ bình dân tới 7 chỗ hạng sang
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={"/pics/sedan.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-light d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe Sedan</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Đầy đủ từ cơ bản tới sang trọng và cao cấp
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={"/pics/911gt3rs.jpg"}
                  className="d-block w-100"
                  alt="..."
                ></img>
                <div
                  className="carousel-caption text-light d-none d-md-block position-absolute"
                  style={{
                    left: "2rem",
                    bottom: "1rem",
                  }}
                >
                  <h1 className="d-flex justify-content-start">Xe Thể Thao</h1>
                  <p className="d-flex fs-3 justify-content-start">
                    Hứa hẹn 1 trải nghiệm khó quên
                  </p>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselIntro"
              data-bs-slide="prev"
              style={{
                objectFit: "cover",
              }}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselIntro"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        {/* Driver Showcase */}
        <h1 className="p-3 m-0 text-center">Nhân viên</h1>
        <div className="container-fluid text-center pt-3 pb-3 p-0 m-0 position-relative">
          <img
            src={"/pics/driver.jpg"}
            className="img-fluid"
            style={{
              width: "100%",
              height: "100%",
            }}
          ></img>
          <div
            className="figure-img fs-1 position-absolute text-end d-none d-sm-block"
            style={{
              width: "40%",
              fontSize: "6.5vw",
              right: "2rem",
              bottom: "6rem",
            }}
          >
            Đội ngũ tài xế chuyên nghiệp
          </div>
        </div>
        {/* Recruiting */}
        <div className="container-fluid d-flex justify-content-center my-5 position-relative">
          <img
            src={"/pics/recruit.jpg"}
            className="img-fluid rounded-5 mx-auto d-block m-4 mb-0"
            style={{
              width: "40rem",
            }}
          ></img>
        </div>
        <p className="fs-4 text-center">
          Đặt chuyến đi ngay{" "}
          <a className="breadcrumb-item" href="/trip.html">
            tại đây
          </a>
        </p>
      </div>
    );
  }
  return <>{reDirect()}</>;
}

export default Content;
