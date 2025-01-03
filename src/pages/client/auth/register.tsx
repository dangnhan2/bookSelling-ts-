import { doRegister } from "@/services/api";
import { App, Button, Checkbox, Divider, Form, Input } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type FieldType = {
  fullName?: string;
  password?: string;
  email?: string;
  phone?: string;
};

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, password, email, phone } = values;
    const res = await doRegister(fullName!, password!, email!, phone!);
    if (res && res.data) {
      navigate("/login");
      message.success("Đăng ký thành công");
    } else {
      notification.error({
        message: "Đăng ký thất bại",
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
            height: "80vh",
            border: "1px solid transparent",
            borderRadius: "5px",
            backgroundColor: "white",
            padding: "20px 30px",
          }}
        >
          <div>
            <h1>Đăng kí tài khoản</h1>
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
                label="Họ tên"
                name="fullName"
                rules={[
                  { required: true, message: "Họ tên không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="email"
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

              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={{ textAlign: "center" }}>
            <Divider>Or</Divider>
            <span>
              Đã có tài khoản ?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Đăng nhập
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
