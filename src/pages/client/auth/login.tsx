import { doLogin } from "@/services/api";
import { Button, Divider, Form, Input, App } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type FieldType = {
  username?: string;
  password?: string;
};
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setIsLoading(true);
    const res = await doLogin(username!, password!);
    setIsLoading(false);
    if (res && res.data) {
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/");
      message.success("Đăng nhập thành công");
    } else {
      notification.error({
        message: "Đăng nhập thất bại",
        description: res.message,
        duration: 5,
      });
    }
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
                <Button type="primary" htmlType="submit" loading={isLoading}>
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
