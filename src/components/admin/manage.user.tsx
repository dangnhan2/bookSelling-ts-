import { doDeleteUser, getUsers } from "@/services/api";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { IoPencil } from "react-icons/io5";
import { dateRangeValidate } from "./helper";
import DrawerUser from "./drawer/drawer.user";
import AddUser from "./modal/add.user";
import ImportCsv from "./modal/import.csv";
import { CSVLink } from "react-csv";
import EditUser from "./modal/edit.user";
type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

// copyable: true,
// ellipsis: true,
// tooltip: "标题过长会自动收缩",
// formItemProps: {
//   rules: [
//     {
//       required: true,
//       message: "此项为必填项",
//     },
//   ],
// },

const ManageUser = () => {
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",

      render: (_, record) => (
        <a onClick={() => doClickDetails(record)}>{record._id}</a>
      ),
      hideInSearch: true,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      valueType: "date",
      hideInSearch: true,
      sorter: true,
    },
    {
      title: "Created at",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
      // sorter: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (text, record) => {
        // console.log(record);
        return (
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                borderRadius: "1px solid transparent",
                cursor: "pointer",
                marginRight: "5px",
                backgroundColor: "transparent",
              }}
              onClick={() => handleUpdate(record)}
            >
              <IoPencil></IoPencil>
            </button>

            <Popconfirm
              placement="bottomLeft"
              title="Do you want to delete this user?"
              description="Delete this user?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record)}
              okButtonProps={{ loading: isDeleteUser }}
            >
              <button
                style={{
                  borderRadius: "1px solid transparent",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              >
                <HiTrash />
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const { message, notification } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [sortQuery, setSortQuery] = useState<string>("&sort=-createdAt");
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenImport, setIsModalOpenImport] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [userData, setUserData] = useState<IUserTable>();
  const [data, setData] = useState<IUserTable[]>([]);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  //console.log(data);
  const doClickDetails = (data: IUserTable) => {
    console.log(data);
    setUserData(data);
    setOpen(true);
  };

  const handleUpdate = (record: IUserTable) => {
    // console.log(record);
    setIsModalOpenEdit(true);
    setUserData(record);
  };

  const handleDelete = async (record: IUserTable) => {
    setIsDeleteUser(true);
    const res = await doDeleteUser(record._id);
    setIsDeleteUser(false);
    if (res && res.data) {
      message.success("Xóa người dùng thành công");
      reload();
    } else {
      notification.error({
        message: "Xóa người dùng thất bại",
        description: res.message,
        duration: 5,
      });
    }
    // console.log(record);
    // todo delete user
  };

  // const onShowSizeChange = (current: number, pageSize: number) => {
  //   setCurrent(current);
  //   setPageSize(pageSize);
  // };

  const reload = () => {
    actionRef.current?.reload();
  };

  // const onPageChange = (current: number, pageSize: number) => {
  //   setCurrent(current);
  //   setPageSize(pageSize);
  // };
  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          // console.log(params);
          console.log(sort);

          let query = `?current=${params.current}&pageSize=${params.pageSize}`;

          if (params.fullName) {
            query += `&fullName=/${params.fullName}/i`;
          }
          if (params.email) {
            query += `&email=/${params.email}/i`;
          }
          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange) {
            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
          }
          if (sort.createdAt) {
            const querySorter =
              sort.createdAt === "ascend"
                ? `&sort=createdAt`
                : `&sort=-createdAt`;
            setSortQuery(querySorter);
            query += sortQuery;
          } else {
            query += sortQuery;
          }
          if (sort.fullName) {
            const querySorter =
              sort.fullName === "ascend" ? `&sort=fullName` : `&sort=-fullName`;
            setSortQuery(querySorter);
            query += sortQuery;
          }

          const res = await getUsers(query);
          if (res && res.data) {
            setData(res.data?.result);
          }
          return {
            // data: data.data,
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          pageSizeOptions: [5, 10, 15, 20],
          defaultPageSize: 5,
          showSizeChanger: true,
          // onChange: (page, pageSize) => onPageChange(page, pageSize),
          // onShowSizeChange: onShowSizeChange,
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<CloudUploadOutlined />}
            onClick={() => setIsModalOpenImport(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button icon={<CloudDownloadOutlined />} type="primary">
            <CSVLink data={data} filename="export.csv">
              Export
            </CSVLink>
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <DrawerUser
        open={open}
        setOpen={setOpen}
        userData={userData}
      ></DrawerUser>

      <AddUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        reload={reload}
      ></AddUser>

      <ImportCsv
        isModalOpenImport={isModalOpenImport}
        setIsModalOpenImport={setIsModalOpenImport}
        reload={reload}
      ></ImportCsv>

      <EditUser
        isModalOpenEdit={isModalOpenEdit}
        setIsModalOpenEdit={setIsModalOpenEdit}
        reload={reload}
        userData={userData}
        setUserData={setUserData}
      ></EditUser>
    </>
  );
};
export default ManageUser;
