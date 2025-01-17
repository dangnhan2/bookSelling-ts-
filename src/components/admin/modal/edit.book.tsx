import {
  callUploadBookImg,
  doCreateBook,
  doUpdateBook,
  getCategory,
} from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Col,
  Divider,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { MAX_UPLOAD_IMAGE_SIZE } from "../helper";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { UploadChangeParam } from "antd/es/upload";
import { v4 as uuidv4 } from "uuid";
type FieldType = {
  _id: string;
  mainText?: string;
  author?: string;
  price?: number;
  category?: string;
  quantity?: number;
  thumbnail?: string;
  slider?: Array<string>;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IProps {
  openModalEdit: boolean;
  setOpenModalEdit: (value: boolean) => void;
  reload: () => void;
  bookData: IBookTable | undefined;
  setData: (value: IBookTable) => void;
}
const EditBook = (props: IProps) => {
  const { openModalEdit, setOpenModalEdit, reload, bookData } = props;
  const [form] = Form.useForm();
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [thumbnailFiles, setThumbnailFiles] = useState<UploadFile[]>([]);
  const [sliderFiles, setSliderFiles] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const { message, notification } = App.useApp();
  // console.log(bookData);

  useEffect(() => {
    if (bookData) {
      const arrThumbnail: UploadFile[] = [
        {
          uid: uuidv4(),
          name: bookData?.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookData?.thumbnail
          }`,
        },
      ];

      setThumbnailFiles(arrThumbnail);

      const arrSlider: UploadFile[] = bookData?.slider.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      setSliderFiles(arrSlider);
      form.setFieldsValue({
        _id: bookData?._id,
        mainText: bookData?.mainText,
        author: bookData?.author,
        price: bookData?.price,
        category: bookData?.category,
        quantity: bookData?.quantity,
        thumbnail: arrThumbnail,
        slider: arrSlider,
      });
    }
  }, [bookData]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setCategory(d);
      }
    };
    fetchCategory();
  }, []);

  const normFile = (e: any) => {
    // console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (
    info: UploadChangeParam,
    type: "thumbnail" | "slider"
  ) => {
    console.log(info);
    if (info.file.status === "uploading") {
      if (type === "thumbnail") {
        setLoadingThumbnail(true);
      } else {
        setLoadingSlider(true);
      }
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      if (type === "thumbnail") {
        setLoadingThumbnail(false);
      } else {
        setLoadingSlider(false);
      }
    }
  };

  const onRemoveFile = async (
    file: UploadFile,
    type: "thumbnail" | "slider"
  ) => {
    if (type === "thumbnail") {
      setThumbnailFiles([]);
    }
    if (type === "slider") {
      const newSlider = sliderFiles.filter((item) => {
        return item.uid !== file.uid;
      });
      setSliderFiles(newSlider);
    }
  };

  // console.log(thumbnailFiles[0].name);
  console.log(sliderFiles);

  const handleSubmit = async (values: FieldType) => {
    const { mainText, author, price, category, quantity } = values;
    const slider = sliderFiles.map((item) => {
      return item.name;
    });
    const res = await doUpdateBook(
      bookData?._id,
      thumbnailFiles[0].name,
      slider,
      mainText,
      author,
      price,
      quantity,
      category
    );
    if (res && res.data) {
      setOpenModalEdit(false);
      form.resetFields();
      message.success("Cập nhật thành công");
      reload();
      // setThumbnailFiles([]);
      // setSliderFiles([]);
    } else {
      notification.error({
        message: "Cập nhật thất bại",
        description: res.message,
        duration: 5,
      });
    }
    // console.log(values);
    // console.log(thumbnailFiles);
    // console.log(sliderFiles);
  };
  const handleCancel = () => {
    setOpenModalEdit(false);
    form.resetFields();
  };

  const formatterNumber = (val: string) => {
    return val.toString().replace(/^[+-]?\d+/, function (val) {
      return val.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    });
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: "thumbnail" | "slider"
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await callUploadBookImg(file, "book");
    console.log(res);

    if (res && res.data) {
      const uploadedFile: any = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setThumbnailFiles([{ ...uploadedFile }]);
      } else {
        setSliderFiles((prevState) => [...prevState, { ...uploadedFile }]);
      }

      if (onSuccess) onSuccess("ok");
    } else {
      message.error(res.message);
    }
  };

  return (
    <Modal
      title="Thêm mới sách"
      open={openModalEdit}
      onOk={form.submit}
      onCancel={handleCancel}
      okText="Tạo mới"
      cancelText="Hủy"
      width={800}
    >
      <Divider></Divider>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item<FieldType>
            label="Id"
            name="_id"
            rules={[{ required: true, message: "Please input title!" }]}
            hidden={true}
          >
            <Input />
          </Form.Item>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: "Please input title!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<FieldType>
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Please input author!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Please input price!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value: any) => formatterNumber(value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: "Please choose the type!" }]}
              >
                <Select showSearch allowClear options={category} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value: any) => formatterNumber(value)}
                  value={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item<FieldType>
                valuePropName="fileList"
                getValueFromEvent={normFile}
                label="Thumbnail"
                name="thumbnail"
                rules={[
                  { required: true, message: "Please upload thumbnail!" },
                ]}
              >
                <Upload
                  onPreview={handlePreview}
                  multiple={false}
                  maxCount={1}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={(options) =>
                    handleUploadFile(options, "thumbnail")
                  }
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onRemove={(info) => onRemoveFile(info, "thumbnail")}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Slider"
                name="slider"
                rules={[{ required: true, message: "Please upload slider!" }]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  onPreview={handlePreview}
                  multiple
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={(options) =>
                    handleUploadFile(options, "slider")
                  }
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onRemove={(info) => onRemoveFile(info, "slider")}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Modal>
  );
};

export default EditBook;
