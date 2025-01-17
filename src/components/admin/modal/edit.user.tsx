import { doEditUser } from "@/services/api";
import { App, Divider, Form, Input, Modal } from "antd";
import { useEffect } from "react";

type FieldType = {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
};

interface IProps {
  isModalOpenEdit: boolean;
  setIsModalOpenEdit: (value: boolean) => void;
  reload: () => void;
  userData: IUserTable | undefined;
  setUserData: (value: IUserTable | null) => void;
}
const EditUser = (props: IProps) => {
  const { message, notification } = App.useApp();
  const { isModalOpenEdit, setIsModalOpenEdit, reload, userData, setUserData } =
    props;
  console.log(userData);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpenEdit(false);
  };

  useEffect(() => {
    form.setFieldsValue(userData);
  }, [userData]);

  const handleSubmit = async (values: FieldType) => {
    const { _id, email, fullName, phone } = values;
    const res = await doEditUser(_id!, fullName!, phone!);
    // console.log(res);
    if (res && res.data) {
      message.success("Cập nhật thành công");
      setUserData(null);
      setIsModalOpenEdit(false);
      reload();
    } else {
      notification.error({
        message: "Cập nhật thất bại",
        description: res.message,
        duration: 5,
      });
    }
  };

  return (
    <Modal
      title="Cập nhật người dùng"
      open={isModalOpenEdit}
      onOk={form.submit}
      onCancel={handleCancel}
      okText="Cập nhật"
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
            label="_id"
            name="_id"
            rules={[{ required: true, message: "Please input your username!" }]}
            hidden
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
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
export default EditUser;
