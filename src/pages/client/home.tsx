import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  FormProps,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
} from "antd";
import "@/styles/home.scss";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { getBooks, getCategory } from "@/services/api";
import { useEffect, useState } from "react";
import type { PaginationProps, CheckboxProps, InputNumberProps } from "antd";

import { useNavigate, useParams } from "react-router-dom";
type FieldType = {
  range: {
    from: number;
    to: number;
  };
  category: string[];
};

const HomePage = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any>([]);
  const [books, setBooks] = useState<IBookTable[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeCurrent, setPageSize] = useState(5);
  const [totals, setTotals] = useState<number>();
  const [sorter, setSorter] = useState("sort=-sold");
  const [filter, setFilter] = useState("");
  console.log(filter);

  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const onChange = (key: string) => {
    setSorter(key);
    console.log(key);
  };

  useEffect(() => {
    const getCategories = async () => {
      const res = await getCategory();
      if (res && res.data) {
        setCategories(res.data);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    getBooksPagination();
  }, [currentPage, pageSizeCurrent, sorter, filter]);

  const getBooksPagination = async () => {
    let query = `?current=${currentPage}&pageSize=${pageSizeCurrent}`;

    if (sorter) {
      query += `&${sorter}`;
    }
    if (filter) {
      query += `&${filter}`;
    }
    const res = await getBooks(query);

    // console.log(res);
    if (res && res.data) {
      setBooks(res.data.result);
      setTotals(res.data.meta.total);
    }
  };

  const onChangePagination: PaginationProps["onChange"] = (page, pageSize) => {
    console.log(page, pageSize);
    if (currentPage !== page) {
      setCurrentPage(page);
    }
    if (pageSizeCurrent !== pageSize) {
      setPageSize(pageSize);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  const handleChangeFilter = (changedValues: any, values: any) => {
    console.log("changedValues:", changedValues);
    console.log("values:", values);
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        //reset data -> fetch all
        setFilter("");
      }
    }
  };

  const handleRedirect = (obj: IBookTable) => {
    navigate(`/book/${obj._id}`);
  };

  return (
    <div
      className="homepage-container"
      style={{ maxWidth: 1440, margin: "0 auto" }}
    >
      <Row gutter={[30, 30]}>
        <Col md={4} sm={0} xs={0} style={{ border: "1px solid transparent" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {" "}
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined
              title="Reset"
              onClick={() => (form.resetFields(), setFilter(""))}
            />
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {categories.map((item) => (
                    <Col span={24}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
              <div>
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"></span>
              </div>
              <div>
                <Rate
                  value={4}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"> trở lên</span>
              </div>
              <div>
                <Rate
                  value={3}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"> trở lên</span>
              </div>
              <div>
                <Rate
                  value={2}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"> trở lên</span>
              </div>
              <div>
                <Rate
                  value={1}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"> trở lên</span>
              </div>
            </Form.Item>
          </Form>
        </Col>
        <Col md={20} xs={24} style={{ border: "1px solid  transparent" }}>
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Row>
          <Row className="customize-row">
            {books.map((item, index) => (
              <div
                className="column"
                key={index}
                onClick={() => handleRedirect(item)}
              >
                <div className="wrapper">
                  <div className="thumbnail">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item?.thumbnail
                      }`}
                      alt="thumbnail book"
                    />
                  </div>
                  <div className="text">{item.mainText}</div>
                  <div className="price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </div>
                  <div className="rating">
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 10 }}
                    />
                    <span>Đã bán {item.sold}k</span>
                  </div>
                </div>
              </div>
            ))}
          </Row>
          <Divider />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              onChange={onChangePagination}
              current={currentPage}
              total={totals}
              pageSize={pageSizeCurrent}
              responsive
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
