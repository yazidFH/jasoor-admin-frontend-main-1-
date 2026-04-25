import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const DigitalSaleAgreement = ({ details }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Flex vertical gap={0} className="mb-3">
            <Text className="fw-600 text-medium-gray fs-13">
              {t("Downloads Digital Sale Agreement")}
            </Text>
            <Text className="fs-13 text-gray">
              {t(
                "This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding."
              )}
            </Text>
          </Flex>
          <Card className="card-cs border-gray rounded-12">
            <Flex justify="space-between" align="center">
              <Flex gap={15}>
                <Image
                  src={"/assets/icons/file.png"}
                  fetchPriority="high"
                  alt="file-image"
                  preview={false}
                  width={20}
                />
                <Flex vertical>
                  <Text className="fs-13 text-gray">
                    {t("Digital Sale Agreement.pdf")}
                  </Text>
                  {/* <Text className="fs-13 text-gray">{t("5.3 MB")}</Text> */}
                </Flex>
              </Flex>
              <a
                href={
                  isArabic ? details?.arabicNdaPdfPath : details?.ndaPdfPath
                }
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Image
                  src={"/assets/icons/download.png"}
                  fetchPriority="high"
                  alt="download-icon"
                  preview={false}
                  width={20}
                  style={{ cursor: "pointer" }}
                />
              </a>
            </Flex>
          </Card>
        </Col>
        <Col span={24}></Col>
        <Col span={24}>
          <Flex vertical gap={10}>
            {/* Case 1: both false */}
            {!details?.isDsaBuyer && !details?.isDsaSeller && (
              <>
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for seller to sign the sales agreement")}
                </Flex>
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for buyer to sign the sales agreement")}
                </Flex>
              </>
            )}

            {/* Case 2: both true */}
            {details?.isDsaBuyer && details?.isDsaSeller && (
              <>
                <Flex
                  gap={5}
                  className="badge-cs success fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Buyer accepted the Sale Agreement")}
                </Flex>
                <Flex
                  gap={5}
                  className="badge-cs success fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Seller accepted the Sale Agreement")}
                </Flex>
              </>
            )}

            {/* Case 3: buyer false, seller true */}
            {!details?.isDsaBuyer && details?.isDsaSeller && (
              <>
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for buyer to sign the sales agreement")}
                </Flex>
                <Flex
                  gap={5}
                  className="badge-cs success fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Seller accepted the Sale Agreement")}
                </Flex>
              </>
            )}

            {/* Case 4: buyer true, seller false */}
            {details?.isDsaBuyer && !details?.isDsaSeller && (
              <>
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for seller to sign the sales agreement")}
                </Flex>
                <Flex
                  gap={5}
                  className="badge-cs success fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Buyer accepted the Sale Agreement")}
                </Flex>
              </>
            )}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { DigitalSaleAgreement };
