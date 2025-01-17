import {
  Badge,
  Descriptions,
  Divider,
  Drawer,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  bookData: IBookTable | undefined;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const DrawerBook = (props: IProps) => {
  const { open, setOpen, bookData } = props;
  // console.log(bookData?.slider);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<
    UploadFile<{
      uid: string;
      name: string;
      status: string;
      url: string;
    }>[]
  >();

  useEffect(() => {
    let imageArr: UploadFile<{
      uid: string;
      name: string;
      status: string;
      url: string;
    }>[] = [];
    let image: any = {};
    if (bookData?.thumbnail) {
      imageArr.push({
        uid: uuidv4(),
        name: bookData?.thumbnail,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          bookData?.thumbnail
        }`,
      });
    }
    if (bookData?.slider) {
      bookData.slider.map(
        (item) => (
          (image = {
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          }),
          imageArr.push(image)
        )
      );
    }
    setFileList(imageArr);
  }, [bookData]);
  console.log(bookData);
  const onClose = () => {
    setOpen(false);
  };

  const createDate = dayjs(bookData?.createdAt).format("YYYY-MM-DD").toString();

  const updateDate = dayjs(bookData?.updatedAt).format("YYYY-MM-DD").toString();

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

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <Drawer title="Chi tiết sách" onClose={onClose} open={open} width={800}>
      <Descriptions title="Book Info" bordered>
        <Descriptions.Item label="ID" span={2}>
          {bookData?._id}
        </Descriptions.Item>

        <Descriptions.Item label="Title" span={2}>
          {bookData?.mainText}
        </Descriptions.Item>
        <Descriptions.Item label="Author" span={2}>
          {bookData?.author}
        </Descriptions.Item>
        <Descriptions.Item label="Category" span={2}>
          {bookData?.category}
        </Descriptions.Item>
        <Descriptions.Item label="Price" span={3}>
          <Badge status="processing" text={bookData?.price} />
        </Descriptions.Item>
        <Descriptions.Item label="Quantity" span={2}>
          {bookData?.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Sold" span={2}>
          {bookData?.sold}
        </Descriptions.Item>

        <Descriptions.Item label="Created at" span={2}>
          {createDate}
        </Descriptions.Item>
        <Descriptions.Item label="Updated at" span={2}>
          {updateDate}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left">Ảnh sách</Divider>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: false }}
      ></Upload>
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
    </Drawer>
  );
};
export default DrawerBook;
