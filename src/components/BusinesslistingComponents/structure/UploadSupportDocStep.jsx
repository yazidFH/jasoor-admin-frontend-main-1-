import React, { useEffect, useState } from "react";
import { Card, Flex, Form, Image, message, Tooltip, Typography } from "antd";
import { SingleMultipleFileUpload } from "../../Forms";
import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";
import { ModuleTopHeading } from "../../PageComponents";

const { Title, Text } = Typography;

const UploadSupportDocStep = ({ data, setData }, ref) => {
  const { t } = useTranslation();
  const { formatPhone } = useFormatNumber();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [uploadingCR, setUploadingCR] = useState(false);
  const [uploadingSupport, setUploadingSupport] = useState(false);
  const [initialCrList, setInitialCrList] = useState([]);
  const [initialSupportList, setInitialSupportList] = useState([]);

  React.useImperativeHandle(ref, () => ({
    validate: async () => {
      // Validate form fields first
      try {
        await form.validateFields();
      } catch (err) {
        console.error("Form validation failed:", err);
        throw err;
      }

      // Then validate required documents
      const docs = Array.isArray(data?.documents) ? data.documents : [];
      const crDoc = docs.find(
        (d) => d.title === "Commercial Registration (CR)" && d.filePath
      );
      const supportDocs = docs.filter(
        (d) => d.title === "Supporting Document" && d.filePath
      );

      if (!crDoc) {
        messageApi.error(
          t("Please upload Commercial Registration (CR) document")
        );
        throw new Error(t("CR document is required"));
      }

      if (supportDocs.length === 0) {
        messageApi.error(t("Please upload at least one Supporting Document"));
        throw new Error(t("At least one supporting document is required"));
      }

      return true;
    },
  }));
  const docToUploadItem = (doc, idx) => ({
    uid: doc.serverId || `doc-${idx}-${Date.now()}`,
    name:
      doc.fileName ||
      (doc.filePath ? doc.filePath.split("/").pop() : `file-${idx}`),
    size: doc.size || 0,
    status: "done",
    url: doc.filePath || null,
    originFileObj: null,
  });

  const normalizeFiles = (fileOrFiles) => {
    if (!fileOrFiles) return [];
    return Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  };

  useEffect(() => {
    const docs = Array.isArray(data?.documents)
      ? data.documents.filter(
          (d) =>
            d &&
            (d.filePath || d.fileName) &&
            Object.values(d).some(
              (val) => val !== null && val !== "" && val !== undefined
            )
        )
      : [];

    // Only find documents that are explicitly titled as CR or Supporting Document
    const crDoc =
      docs.find((d) => d.title === "Commercial Registration (CR)") || null;
    const supportDocs = docs.filter((d) => d.title === "Supporting Document");

    const crList = crDoc ? [docToUploadItem(crDoc, 0)] : [];
    const supportList = supportDocs.map((d, i) => docToUploadItem(d, i + 1));

    setInitialCrList(crList);
    setInitialSupportList(supportList);

    setTimeout(() => {
      try {
        form.setFieldsValue({
          uploadcr: crDoc ? [crDoc] : null,
          uploadmult: supportDocs.length > 0 ? supportDocs : [],
        });
      } catch (err) {
        console.warn("setFieldsValue failed:", err);
      }
    }, 0);
  }, [data?.documents, form]);

  const uploadFileToServer = async (file) => {
    try {
      let compressedFile = file;

      if (file.type.startsWith("image/")) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      let fileToUpload = compressedFile;

      if (compressedFile && !(compressedFile instanceof File)) {
        fileToUpload = new File([compressedFile], file.name, {
          type: compressedFile.type || file.type,
        });
      }

      if (!fileToUpload.name) {
        const extension = fileToUpload.type?.split("/")?.[1]
          ? `.${fileToUpload.type.split("/")[1]}`
          : "";
        fileToUpload = new File(
          [fileToUpload],
          `${file.name || `upload-${Date.now()}`}${extension}`,
          {
            type: fileToUpload.type || file.type,
          }
        );
      }

      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);

      const res = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return {
        fileName: data.fileName,
        fileType: data.fileType,
        filePath: data.fileUrl,
        size: file.size,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSingleFileUpload = async (fileOrFiles) => {
    // Prevent upload if support docs are uploading
    if (uploadingSupport) {
      messageApi.warning(
        t("Please wait for support documents to finish uploading")
      );
      return;
    }

    setUploadingCR(true);
    try {
      const file = fileOrFiles;
      const fileInfo = await uploadFileToServer(file);

      const crDocument = {
        title: "Commercial Registration (CR)",
        ...fileInfo,
      };

      // Get current state snapshot to avoid race conditions
      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const supportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document"
      );

      // CR always goes first
      const updatedDocs = [crDocument, ...supportDocs];

      setData({ ...data, documents: updatedDocs });

      // Update CR UI list only
      setInitialCrList([docToUploadItem(crDocument, 0)]);

      // Update only CR form field, don't touch support docs field
      form.setFieldsValue({ uploadcr: [crDocument] });
      messageApi.success(t("Commercial Registration uploaded successfully"));
    } catch (err) {
      console.error("handleSingleFileUpload error:", err);
      messageApi.error(t("Failed to upload Commercial Registration"));
    } finally {
      setUploadingCR(false);
    }
  };

  const handleSingleFileRemove = () => {
    // Prevent removal if support docs are uploading
    if (uploadingSupport) {
      messageApi.warning(
        t("Please wait for support documents to finish uploading")
      );
      return;
    }

    try {
      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const supportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document"
      );

      setData({ ...data, documents: supportDocs });

      // Clear CR UI list
      setInitialCrList([]);

      // Update only CR form field
      form.setFieldsValue({ uploadcr: null });
    } catch (err) {
      console.error("handleSingleFileRemove error:", err);
    }
  };

  const handleMultipleFileUpload = async (fileOrFiles) => {
    // Prevent upload if CR is uploading
    if (uploadingCR) {
      messageApi.warning(
        t("Please wait for Commercial Registration to finish uploading")
      );
      return;
    }

    const normalized = Array.isArray(fileOrFiles)
      ? fileOrFiles
      : normalizeFiles(fileOrFiles);
    if (!normalized || normalized.length === 0) return;

    setUploadingSupport(true);

    try {
      const uploadPromises = normalized.map(async (file) => {
        try {
          return await uploadFileToServer(file);
        } catch (err) {
          console.error("One file failed to upload:", file.name, err);
          messageApi.error(
            t("Failed to upload {{fileName}}", { fileName: file.name })
          );
          return null;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const successful = uploadedFiles.filter(Boolean);

      if (successful.length === 0) {
        messageApi.warn(t("No files uploaded successfully"));
        return;
      }

      const newSupportDocs = successful.map((fileInfo) => ({
        title: "Supporting Document",
        fileName: fileInfo.fileName,
        filePath: fileInfo.filePath,
        fileType: fileInfo.fileType,
        size: fileInfo.size,
      }));

      // Get current state snapshot to avoid race conditions
      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const crDoc = existingDocs.find(
        (d) => d.title === "Commercial Registration (CR)"
      );
      const existingSupportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document"
      );

      // Merge existing support docs with new ones
      const allSupportDocs = [...existingSupportDocs, ...newSupportDocs];

      // Always preserve CR document if it exists (CR goes first)
      const finalDocs = crDoc ? [crDoc, ...allSupportDocs] : allSupportDocs;

      setData({ ...data, documents: finalDocs });

      // Update supporting documents UI list only
      const updatedSupportList = allSupportDocs.map((d, i) =>
        docToUploadItem(d, i + 1)
      );
      setInitialSupportList(updatedSupportList);

      // Update only support docs form field, don't touch CR field
      form.setFieldsValue({ uploadmult: allSupportDocs });

      messageApi.success(
        t("{{count}} file(s) uploaded successfully", {
          count: successful.length,
        })
      );
    } catch (err) {
      console.error("handleMultipleFileUpload error:", err);
      messageApi.error(t("Failed to upload supporting documents"));
    } finally {
      setUploadingSupport(false);
    }
  };

  const handleMultipleFileRemove = (removedFile) => {
    // Prevent removal if CR is uploading
    if (uploadingCR) {
      messageApi.warning(
        t("Please wait for Commercial Registration to finish uploading")
      );
      return;
    }

    try {
      // Get current state snapshot
      const updatedDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const crDoc = updatedDocs.find(
        (d) => d.title === "Commercial Registration (CR)"
      );
      const existingSupportDocs = updatedDocs.filter(
        (d) => d.title === "Supporting Document"
      );

      // Find and remove the document by matching file name or path
      const remainingSupportDocs = existingSupportDocs.filter((doc) => {
        return !(
          doc.fileName === removedFile.name ||
          doc.filePath === removedFile.url ||
          doc.filePath === removedFile.name ||
          (removedFile.uid && doc.serverId === removedFile.uid)
        );
      });

      // Reconstruct documents array - always preserve CR (CR goes first)
      const finalDocs = crDoc
        ? [crDoc, ...remainingSupportDocs]
        : remainingSupportDocs;

      setData({ ...data, documents: finalDocs });

      // Update supporting documents UI list only
      const updatedSupportList = remainingSupportDocs.map((d, i) =>
        docToUploadItem(d, i + 1)
      );
      setInitialSupportList(updatedSupportList);

      // Update only support docs form field, don't touch CR field
      form.setFieldsValue({ uploadmult: remainingSupportDocs });
    } catch (err) {
      console.error("handleMultipleFileRemove error:", err);
    }
  };
  return (
    <>
      {contextHolder}
      <Flex
        justify="space-between"
        className="mb-3"
        gap={5}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading level={4} name={t("Upload supporting documents")} />
          <Text className="text-gray">
            {t("Verified data builds buyer confidence.")}
          </Text>
        </Flex>
        <Flex className="pill-round" gap={8} align="center">
          <Image
            src="/assets/icons/info-b.png"
            preview={false}
            width={16}
            alt={t("info icon")}
          />
          <Text className="fs-12 text-sky">
            {t("For any query, contact us on")}{" "}
            {formatPhone("+966 543 543 654")}
          </Text>
        </Flex>
      </Flex>

      <Form layout="vertical" form={form} requiredMark={false}>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Flex align="center" gap={5}>
                <Title level={5} className="m-0 fw-500">
                  {t("Commercial Registration (CR)")}
                </Title>
                <Text type="danger" className="fw-500">
                  *
                </Text>
              </Flex>
              <Text className="text-gray">
                {t(
                  "Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file."
                )}
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleMultipleFileUpload
                name={"uploadcr"}
                title={t("Upload")}
                onUpload={handleSingleFileUpload}
                onRemove={handleSingleFileRemove}
                uploading={uploadingCR}
                multiple={false}
                required={true}
                message={t("Please upload Commercial Registration (CR)")}
                initialFileList={initialCrList}
              />
            </Flex>
          </Flex>
        </Card>

        <Card className="shadow-d radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Flex align="center" gap={5}>
                <Title level={5} className="m-0 fw-500">
                  {t("Upload Other Supporting Documents")}{" "}
                  <Tooltip
                    title={t("Please upload at least one supporting document")}
                  >
                    <img
                      src="/assets/icons/info-outline.png"
                      width={14}
                      alt={t("info-icon")}
                      fetchPriority="high"
                    />
                  </Tooltip>
                </Title>
                <Text type="danger" className="fw-500">
                  *
                </Text>
              </Flex>
              <Text className="text-gray">
                {t(
                  "Accepted formats: PDF, JPG, PNG, DOCX, XLSX. Max size: 10MB per file."
                )}
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleMultipleFileUpload
                name={"uploadmult"}
                title={t("Upload")}
                onUpload={handleMultipleFileUpload}
                onRemove={handleMultipleFileRemove}
                uploading={uploadingSupport}
                multiple={true}
                required={true}
                message={t("Please upload at least one Supporting Document")}
                initialFileList={initialSupportList}
              />
            </Flex>
          </Flex>
        </Card>
      </Form>
    </>
  );
};

export { UploadSupportDocStep };
