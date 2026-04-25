import { Button, Card, Col, Flex, Image, Row, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const FinalDealBuyer = () => {
  const { t } = useTranslation();

  return (
    <Row gutter={[16, 24]}>
      <Col span={24}>
        {[
          "Commercial Registration (CR).png",
          "Notarized Ownership Transfer Letter.png",
        ]?.map((items, index) => (
          <Card className="card-cs border-gray rounded-12 mb-3" key={index}>
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
                  <Text className="fs-13 text-gray">{items}</Text>
                  <Text className="fs-13 text-gray">5.3 MB</Text>
                </Flex>
              </Flex>
              <Image
                src={"/assets/icons/download.png"}
                fetchPriority="high"
                alt="download-icon"
                preview={false}
                width={20}
              />
            </Flex>
          </Card>
        ))}
      </Col>
      <Col span={24}>
        <Flex vertical gap={10}>
          <Flex
            gap={5}
            className="badge-cs success fs-12 fit-content"
            align="center"
          >
            <CheckCircleOutlined className="fs-14" />{" "}
            {t("Seller marked the deal as Finalized")}.
          </Flex>
          <Flex
            gap={5}
            className="badge-cs pending fs-12 fit-content"
            align="center"
          >
            <CheckCircleOutlined className="fs-14" />{" "}
            {t("Waiting for seller to mark the deal as Finalized")}.
          </Flex>
          <Flex
            gap={5}
            className="badge-cs pending fs-12 fit-content"
            align="center"
          >
            <CheckCircleOutlined className="fs-14" />{" "}
            {t("Waiting for seller to mark the deal as Finalized")}.
          </Flex>
          <Flex>
            <Button
              type="button"
              className="btnsave bg-gray border0 text-white"
              aria-labelledby="Mark Deal as Completed"
            >
              {t("Mark Deal as Completed")}
            </Button>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};

export { FinalDealBuyer };
