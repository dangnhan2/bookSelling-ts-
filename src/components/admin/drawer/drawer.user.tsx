import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  userData: IUserTable | undefined;
}
const DrawerUser = (props: IProps) => {
  const { open, setOpen, userData } = props;

  const onClose = () => {
    setOpen(false);
  };

  const createDate = dayjs(userData?.createdAt).format("YYYY-MM-DD").toString();

  const updateDate = dayjs(userData?.updatedAt).format("YYYY-MM-DD").toString();

  const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    userData?.avatar
  }`;
  return (
    <Drawer
      title="Chi tiết người dùng"
      onClose={onClose}
      open={open}
      width={800}
    >
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="ID" span={2}>
          {userData?._id}
        </Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị" span={2}>
          {userData?.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {userData?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone" span={2}>
          {userData?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={2}>
          <Badge status="processing" text={userData?.role} />
        </Descriptions.Item>
        <Descriptions.Item label="Avatar" span={2}>
          <Avatar size="large" src={avatar} />
        </Descriptions.Item>
        <Descriptions.Item label="Created at" span={2}>
          {createDate}
        </Descriptions.Item>
        <Descriptions.Item label="Updated at" span={2}>
          {updateDate}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DrawerUser;
