import { useState } from "react";
import { Modal, Button, Upload, Form, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ImagePreviewModal } from "./ImagePreviewModal";

const UploadImageModal = ({ visible, onClose }) => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setPreviewImage("");
  };

  return (
    <>
      <Modal
        open={visible}
        width={650}
        centered
        className="shadow-c"
        title={
          <Typography.Text className="ant-modal-title">
            Add Images
          </Typography.Text>
        }
        onCancel={onClose}
        footer={[
          <Button
            key="submit"
            className="btnsave"
            type="primary"
            htmlType="submit"
            aria-labelledby="Save image"
          >
            Save Images
          </Button>,
        ]}
      >
        <div className="modal-border" />
        <Form>
          <Form.Item
            name="upload"
            rules={[
              { required: true, message: "Please upload at least one image." },
            ]}
          >
            <Upload
              name="upload"
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onPreview={handlePreview}
              accept=".jpg, .jpeg, .png"
            >
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div className="margintop-8">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
        <div className="modal-border" />
      </Modal>

      <ImagePreviewModal
        visible={previewVisible}
        imageSrc={previewImage}
        onClose={closePreview}
      />
    </>
  );
};

export { UploadImageModal };
