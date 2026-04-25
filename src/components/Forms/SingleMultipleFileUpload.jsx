import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  MinusCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Upload, Form, Typography, Flex, Spin } from "antd";
import { useTranslation } from "react-i18next";
const { Dragger } = Upload;

const SingleMultipleFileUpload = ({
  multiple = false,
  name,
  required,
  message,
  title,
  onUpload,
  onRemove,
  initialFileList = [],
  uploading = false,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState([]);
  const [uploadedFileUids, setUploadedFileUids] = useState(new Set());
  const [validationError, setValidationError] = useState(null);
  const uploadingRef = React.useRef(false);

  useEffect(() => {
    if (Array.isArray(initialFileList) && initialFileList.length > 0) {
      const isDifferent =
        fileList.length !== initialFileList.length ||
        fileList.some((file, idx) => file.uid !== initialFileList[idx]?.uid);

      if (isDifferent) {
        setFileList([...initialFileList]);
        // Mark initial files as already uploaded
        const initialUids = new Set(initialFileList.map((f) => f.uid));
        setUploadedFileUids(initialUids);
      }
    } else if (initialFileList.length === 0 && fileList.length > 0) {
      setFileList([]);
      setUploadedFileUids(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFileList]);

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "application/msword", // DOC
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        message: t("File {{name}} exceeds 10MB limit", { name: file.name }),
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: t("File {{name}} has unsupported format", { name: file.name }),
      };
    }

    return { valid: true };
  };

  const handleChange = async (info) => {
    // Clear any previous validation errors
    setValidationError(null);

    // Prevent multiple simultaneous uploads
    if (uploadingRef.current) {
      return;
    }

    let newFileList = [...info.fileList];

    if (!multiple) {
      newFileList = newFileList.slice(-1); // keep last one only for single
    }

    // Identify ONLY new files that haven't been uploaded yet
    const newFilesToUpload = newFileList.filter(
      (f) => f.originFileObj && !uploadedFileUids.has(f.uid)
    );

    // If no new files to upload, just update the file list
    if (newFilesToUpload.length === 0) {
      setFileList(newFileList);
      return;
    }

    // Validate only the new files
    for (const fileWrapper of newFilesToUpload) {
      const validation = validateFile(fileWrapper.originFileObj);
      if (!validation.valid) {
        console.error(validation.message);
        setValidationError(validation.message);
        // Remove the invalid file from the list
        const filteredList = newFileList.filter(
          (f) => f.uid !== fileWrapper.uid
        );
        setFileList(filteredList);
        return;
      }
    }

    // Mark these files as being uploaded immediately to prevent duplicates
    const newUids = new Set([
      ...uploadedFileUids,
      ...newFilesToUpload.map((f) => f.uid),
    ]);
    setUploadedFileUids(newUids);
    setFileList(newFileList);

    // Set uploading flag
    uploadingRef.current = true;

    try {
      // Upload NEW files
      if (multiple) {
        const filesToUpload = newFilesToUpload.map((f) => f.originFileObj);
        await onUpload(filesToUpload);
      } else {
        const file = newFilesToUpload[0]?.originFileObj || null;
        if (file) {
          await onUpload(file);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setValidationError(
        t(error.message) || t("Upload failed. Please try again.")
      );
      // Revert the UIDs if upload failed
      setUploadedFileUids(uploadedFileUids);
    } finally {
      // Clear uploading flag
      uploadingRef.current = false;
    }
  };

  const handleRemove = (file) => {
    // Clear validation error when removing a file
    setValidationError(null);

    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);

    // Remove from uploaded tracking
    const newUids = new Set(uploadedFileUids);
    newUids.delete(file.uid);
    setUploadedFileUids(newUids);

    // Call parent component's onRemove handler if provided
    // Parent will handle form field updates and state management
    if (onRemove) {
      onRemove(file);
    }
  };

  return (
    <div className="w-100">
      <Form.Item
        name={name}
        rules={[
          {
            required,
            message,
          },
        ]}
        className="m-0 w-100"
        validateStatus={validationError ? "error" : ""}
        help={validationError}
      >
        {(multiple || fileList.length === 0) && (
          <Dragger
            name="file"
            multiple={multiple}
            showUploadList={false}
            disabled={uploading}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 1000);
            }}
            fileList={fileList}
            onChange={handleChange}
            className={`upload-d ${validationError ? "upload-error" : ""}`}
          >
            {fileList.length === 0 || multiple ? (
              <Flex
                vertical
                align="center"
                justify="center"
                className="upload-flex"
              >
                {uploading ? (
                  <>
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 20 }} spin />
                      }
                    />
                    <p className="ant-upload p-0 m-0 text-gray mt-2">
                      {t("Uploading...")}
                    </p>
                  </>
                ) : (
                  <>
                    <PlusOutlined className="fs-16" />
                    <p className="ant-upload p-0 m-0 text-black">{title}</p>
                  </>
                )}
              </Flex>
            ) : null}
          </Dragger>
        )}
        {fileList.length > 0 && (
          <div className="w-100">
            {fileList.map((file) => (
              <Flex
                key={file.uid}
                justify="space-between"
                className="w-100 p-2 mt-1 upload-border rounded-4"
              >
                <Flex align="flex-start" gap={10} className="w-100">
                  <img
                    src="/assets/icons/file.png"
                    alt="file-icon"
                    width={24}
                    className="pt-1"
                    fetchPriority="high"
                  />
                  <Flex vertical align="self-end" justify="center">
                    <Typography.Text strong className="text-gray">
                      {file.name.slice(0, 20)}
                      {file.name.length > 20 ? "..." : ""}
                    </Typography.Text>
                    {/* <Typography.Text className='fs-12'>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </Typography.Text> */}
                  </Flex>
                </Flex>
                <MinusCircleFilled
                  className={`text-red cursor-pointer ${
                    uploading ? "opacity-50" : ""
                  }`}
                  style={{ pointerEvents: uploading ? "none" : "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!uploading) {
                      handleRemove(file);
                    }
                  }}
                />
              </Flex>
            ))}
          </div>
        )}
      </Form.Item>
    </div>
  );
};

export { SingleMultipleFileUpload };
