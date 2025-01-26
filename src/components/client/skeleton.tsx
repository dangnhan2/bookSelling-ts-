import { Col, Row, Skeleton } from "antd";

const SkeletonBook = () => {
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <div>
                <Skeleton.Node
                  active={true}
                  style={{ width: "40vw", height: "50vh" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px 0",
                  gap: "10px",
                }}
              >
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
              </div>
            </Col>
            <Col md={2} sm={0} xs={0}></Col>
            <Col md={12} sm={0} xs={0}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
                }}
              >
                <Skeleton style={{ width: "40vw" }} active={true} />
                <Skeleton style={{ width: "40vw" }} active={true} />
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                <Skeleton.Button active={true} />
                <Skeleton.Button active={true} />
              </div>
            </Col>

            <Col md={0} sm={24} xs={24}>
              <div>
                <Skeleton.Node
                  active={true}
                  style={{ width: "90vw", height: "50vh" }}
                />
              </div>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px 0",
                  gap: "10px",
                }}
              >
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
              </div> */}
            </Col>
            {/* <Col md={2} sm={0} xs={0}></Col> */}
            <Col md={0} sm={24} xs={24}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
                }}
              >
                <Skeleton style={{ width: "100%" }} active={true} />
                <Skeleton style={{ width: "100vw" }} active={true} />
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                <Skeleton.Button active={true} />
                <Skeleton.Button active={true} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default SkeletonBook;
