import { Col, Flex, Row, Typography } from "antd";
import {
  TopPagesTable,
  TrafficByCityDonut,
  WebsiteTrafficCards,
  WebsiteVisitBarChart,
} from "../../components";
import { t } from "i18next";

const { Title } = Typography;
const WebsiteTraficAnalysisPage = () => {
  return (
    <div>
      <Flex vertical gap={24}>
        <Flex vertical gap={2}>
          <Title level={4} className="m-0">
            {t("Website Traffic Analysis")}
          </Title>
        </Flex>
        <WebsiteTrafficCards />
        <WebsiteVisitBarChart />
        <Row gutter={[24, 24]}>
          <Col
            lg={{ span: 12 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
          >
            <TopPagesTable />
          </Col>
          <Col
            lg={{ span: 12 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
          >
            <TrafficByCityDonut />
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export { WebsiteTraficAnalysisPage };
