import { Button, Divider, Form, Input } from "antd";
import type { FormProps } from "antd";
import { Link } from "react-router-dom";
type FieldType = {
  username?: string;
  password?: string;
};
const LoginPage = () => {
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#F0F4F8",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "30vw",
            height: "60vh",
            border: "1px solid transparent",
            borderRadius: "5px",
            backgroundColor: "white",
            padding: "20px 30px",
          }}
        >
          <div>
            <h1>Đăng nhập</h1>
            <Divider></Divider>
          </div>
          <div>
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={{ textAlign: "center" }}>
            <Divider>Or</Divider>
            <span>
              Chưa có tài khoản ?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Đăng ký
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
