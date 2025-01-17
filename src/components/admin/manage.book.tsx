import { doDeleteBook, getBooks } from "@/services/api";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { IoPencil } from "react-icons/io5";
import { dateRangeValidate } from "./helper";
import DrawerBook from "./drawer/drawer.book";
import AddBook from "./modal/add.book";
import EditBook from "./modal/edit.book";
import { HiTrash } from "react-icons/hi";
import { CSVLink } from "react-csv";

type TSearch = {
  mainText: string;
  author: string;
  createdAt: string;
  createdAtRange: string;
};
const ManageBook = () => {
  const actionRef = useRef<ActionType>();
  const { message, notification } = App.useApp();
  const [data, setData] = useState<IBookTable[]>([]);
  const [sortQuery, setSortQuery] = useState("&sort=-createdAt");
  const [open, setOpen] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [bookData, setBookData] = useState<IBookTable>();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [isDeleteBook, setIsDeleteBook] = useState(false);
  console.log(data);
  const doClickDetails = (record: IBookTable) => {
    setOpen(true);
    setBookData(record);
  };

  const handleUpdate = (record: IBookTable) => {
    setOpenModalEdit(true);
    setBookData(record);
  };
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const reload = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (record: IBookTable) => {
    const res = await doDeleteBook(record._id);
    if (res && res.data) {
      message.success("Xóa sách thành công");
      reload();
    } else {
      notification.error({
        message: "Xóa sách thất bại",
        description: res.message,
        duration: 5,
      });
    }
  };

  const columns: ProColumns<IBookTable>[] = [
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
      title: "Title",
      dataIndex: "mainText",
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) => VND.format(record.price),
      hideInSearch: true,
      sorter: true,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      hideInSearch: true,
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
              okButtonProps={{ loading: isDeleteBook }}
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

  return (
    <>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          // console.log(params);
          console.log(sort);

          let query = `?current=${params.current}&pageSize=${params.pageSize}`;

          if (params.mainText) {
            query += `&mainText=/${params.mainText}/i`;
          }
          if (params.author) {
            query += `&author=/${params.author}/i`;
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

          if (sort.price) {
            const querySorter =
              sort.fullName === "ascend" ? `&sort=price` : `&sort=-price`;
            setSortQuery(querySorter);
            query += sortQuery;
          }

          const res = await getBooks(query);
          // console.log(res);

          if (res && res.data) {
            setData(res.data.result);
          }
          return {
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
          <Button icon={<CloudDownloadOutlined />} type="primary">
            <CSVLink data={data} filename="export.csv">
              Export
            </CSVLink>
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalAdd(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <DrawerBook
        setOpen={setOpen}
        open={open}
        bookData={bookData}
      ></DrawerBook>

      <AddBook
        setOpenModalAdd={setOpenModalAdd}
        openModalAdd={openModalAdd}
        reload={reload}
      ></AddBook>
      <EditBook
        openModalEdit={openModalEdit}
        setOpenModalEdit={setOpenModalEdit}
        bookData={bookData}
        reload={reload}
        setData={setBookData}
      ></EditBook>
    </>
  );
};
export default ManageBook;
