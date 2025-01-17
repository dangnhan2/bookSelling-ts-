import { InboxOutlined } from "@ant-design/icons";
import { Divider, Modal, Table, Upload, App, Form } from "antd";
import type { UploadProps } from "antd";
import { useState } from "react";
import Excel from "exceljs";
import { Buffer } from "buffer";
import { doCreateUserBulk } from "@/services/api";
import templateFile from "assets/template/template.xlsx?url";
interface Iprops {
  setIsModalOpenImport: (value: boolean) => void;
  isModalOpenImport: boolean;
  reload: () => void;
}

interface Items {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const { Dragger } = Upload;
const columns = [
  {
    title: "Tên hiển thị",
    dataIndex: "fullName",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "age",
  },
  {
    title: "Số điên thoại",
    dataIndex: "phone",
    key: "address",
  },
];

const ImportCsv = (props: Iprops) => {
  const { message, notification } = App.useApp();
  const [data, setData] = useState<Array<Items>>([]);
  const { setIsModalOpenImport, isModalOpenImport, reload } = props;
  const handleCancel = () => {
    setData([]);
    setIsModalOpenImport(false);
  };

  const propsUpload: UploadProps = {
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    name: "file",
    maxCount: 1,
    multiple: false,
    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    async onChange(info) {
      // console.log(info);
      const { status } = info.file;

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        const file = info.fileList[0].originFileObj!;
        const workbook = new Excel.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await workbook.xlsx.load(buffer);

        // convert data to json

        // use readFile for testing purpose
        // await workbook.xlsx.load(objDescExcel.buffer);
        let jsonData: Array<Items> = [];
        workbook.worksheets.forEach(function (sheet) {
          // read first row as data keys
          let firstRow = sheet.getRow(1);
          if (!firstRow.cellCount) return;
          let keys = firstRow.values as any[];
          sheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            let values = row.values as any;
            // console.log(typeof values[0].phone);
            let obj: any = {};
            for (let i = 1; i < keys.length; i++) {
              obj[keys[i]] = values[i];
            }
            jsonData.push(obj);
          });
        });
        setData(jsonData);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) {
          // console.log(file);
          onSuccess("ok");
        }
      }, 1000);
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    data.map((item) => {
      return (item.password = "1234567");
    });
    // console.log(data);
    const res = await doCreateUserBulk(data);

    if (res && res.data) {
      message.success(
        `Success = ${res.data.countSuccess} , Error = ${res.data.countError}`
      );
      setIsModalOpenImport(false);
      reload();
    } else {
      notification.error({
        message: "Tải dữ liệu thất bại",
        description: res.message,
        duration: 5,
      });
    }
  };
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpenImport}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Import"
      cancelText="Cancel"
      width={800}
      okButtonProps={{ disabled: data.length === 0 ? true : false }}
      // do not close when click outside
      maskClosable={false}
      destroyOnClose={true}
    >
      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single . Only accept .csv, .xls, .xlsx or{" "}
          <a href={templateFile} download onClick={(e) => e.stopPropagation()}>
            Download example file
          </a>
        </p>
      </Dragger>

      <Divider></Divider>
      <div>
        <div style={{ marginBottom: "5px" }}>Dữ liệu upload:</div>
        <div>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </Modal>
  );
};

export default ImportCsv;
