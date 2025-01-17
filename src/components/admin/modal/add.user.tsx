import { doCreateUser } from "@/services/api";
import { App, Input, Modal, Form, Divider } from "antd";
import type { FormProps } from "antd";
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  reload: () => void;
}

type FieldType = {
  fullName?: string;
  password?: string;
  email?: string;
  phone?: string;
};
const AddUser = (props: IProps) => {
  const { setIsModalOpen, isModalOpen, reload } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const handleSubmit = async (values: FieldType) => {
    const { fullName, password, email, phone } = values;
    const res = await doCreateUser(fullName!, password!, email!, phone!);
    if (res && res.data) {
      form.resetFields();
      message.success("Tạo tài khoản thành công");
      setIsModalOpen(false);
      reload();
    } else {
      notification.error({
        message: "Tạo tài khoản thất bại",
        description: res.message,
        duration: 5,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      okText="Tạo mới"
      cancelText="Hủy"
    >
      <Divider></Divider>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item<FieldType>
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddUser;
