import Auth from "./Auth";

function Content() {
  function reDirect() {
    let user = Auth.requestAuth();
    // console.log(user);
    if (!user) {
      return (
        <>
          <section className="container-fluid position-absolute text-center my-5">
            <h1 className="display-1">
              Chào mừng tới với The Liem Transport
              <img
                src="../pics/home.jpg"
                className="img-fluid rounded mx-auto d-block m-4"
                alt="..."
              ></img>
              <div className="fs-3 fw-light fst-italic">
                Hãy đăng nhập để trở thành tài xế của chúng tôi
              </div>
            </h1>
          </section>
        </>
      );
    } else {
      return (
        <>
          <section className="container-fluid position-absolute text-center my-5">
            <h1 className="display-1">
              Chào mừng tới với The Liem Transport
              <img
                src="../pics/home.jpg"
                className="img-fluid rounded mx-auto d-block m-4"
                alt="..."
              ></img>
              <div className="fs-3 fw-light fst-italic">
                Chào bạn {user.email}
              </div>
            </h1>
          </section>
        </>
      );
    }
  }
  return (
    <>
      <div>{reDirect()}</div>
    </>
  );
}

export default Content;
