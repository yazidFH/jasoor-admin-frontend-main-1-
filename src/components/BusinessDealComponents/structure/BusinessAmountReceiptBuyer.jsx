import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { GETUSERBANK } from "../../../graphql/query";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;
const BusinessAmountReceiptBuyer = ({ details }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  const sellerReceipt = details?.busines?.documents?.find(
    (doc) =>
      doc.title === "Buyer Payment Receipt" ||
      doc.title === "إيصال دفع المشتري",
  );

  const { loading, data: banksData } = useQuery(GETUSERBANK, {
    variables: { getUserBankId: details?.busines?.seller?.id },
  });
  const banks = banksData?.getUserBanks?.find((doc) => doc.isActive === true);

  const businessamountrecpData = [
    { title: t("Seller's Bank Name"), desc: t(banks?.bankName) },
    { title: t("Seller's IBAN"), desc: banks?.iban },
    { title: t("Account Holder Name"), desc: banks?.accountTitle },
    {
      title: t("Amount to Pay"),
      desc: formatCurrency(details?.finalizedOffer),
    },
  ];

  const renderUploadedDoc = ({ fileName, fileSize, filePath }) => (
    <Flex vertical gap={6}>
      <Text className="fw-600 text-medium-gray fs-13">
        {t("Upload transaction receipt or screenshot")}
      </Text>
      <Card className="card-cs border-gray rounded-12">
        <Flex justify="space-between" align="center">
          <Flex gap={15}>
            <Image
              src={"/assets/icons/file.png"}
              preview={false}
              width={20}
              alt="file-image"
              fetchPriority="high"
            />
            <Flex vertical>
              <Text className="fs-13 text-gray">{fileName}</Text>
              <Text className="fs-13 text-gray">{fileSize}</Text>
            </Flex>
          </Flex>
          {filePath && (
            <a href={filePath} target="_blank" rel="noopener noreferrer">
              <Image
                src={"/assets/icons/download.png"}
                alt="download-icon"
                fetchPriority="high"
                preview={false}
                width={20}
              />
            </a>
          )}
        </Flex>
      </Card>
    </Flex>
  );
  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }
  return (
    <>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {businessamountrecpData?.map((list, index) => (
              <Col xs={24} sm={12} md={6} lg={6} key={index}>
                <Flex vertical gap={3}>
                  <Text className="text-gray fs-14">{list?.title}</Text>
                  <Text className="fs-15 fw-500">{list?.desc}</Text>
                </Flex>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={24}>
          {sellerReceipt &&
            renderUploadedDoc({
              fileName: sellerReceipt?.title,
              // fileSize: "5.3 MB",
              filePath: sellerReceipt?.filePath,
            })}
        </Col>
      </Row>
    </>
  );
};

export { BusinessAmountReceiptBuyer };
