import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { GET_BUSINESSES_DOCUMENT_ID } from "../../../graphql/query";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const DocumentTab = ({ businessId }) => {
  const { t } = useTranslation();
  const { data: business } = useQuery(GET_BUSINESSES_DOCUMENT_ID, {
    variables: { getBusinessByIdId: businessId },
  });

  const data = business?.getBusinessById?.business?.documents;

  return (
    <Card className="radius-12 border-gray">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5} className="m-0">
            {t("Documents")}
          </Title>
        </Col>
        {data?.map((items, i) => (
          <Col
            lg={{ span: 12 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
            key={i}
          >
            <Card className="card-cs border-gray rounded-12 mb-2">
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
                    <Text className="fs-13 text-gray">{items?.title}</Text>
                    {/* <Text className='fs-13 text-gray'> 5.3 MB </Text> */}
                  </Flex>
                </Flex>
                <a
                  href={items?.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={"/assets/icons/download.png"}
                    fetchPriority="high"
                    alt="download-icon"
                    preview={false}
                    width={20}
                  />
                </a>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export { DocumentTab };
