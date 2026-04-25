import { Col, Flex, Row, Typography, Spin } from "antd";
import {
  BusinessCategoryDonut,
  BusinessListBarChart,
  DashboardCards,
  ListingPriceBar,
  ListingRevenueBar,
} from "../../components";
import { useQuery } from "@apollo/client";
import { ME } from "../../graphql/query";
import { useTranslation } from "react-i18next";
import { getUserId } from "../../shared/tokenManager";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const userId = getUserId();
  const { data, loading: isLoading } = useQuery(ME, {
    variables: { getUserId: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const today = dayjs().locale(i18n.language).format("dddd, D MMMM YYYY");

  // Show loader while fetching
  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }
  return (
    <div>
      <Flex vertical gap={24}>
        <Flex vertical gap={2}>
          <Text className="text-gray fs-13">{today}</Text>
          <Title level={3} className="m-0">
            {t("Hi")} {data?.getUser?.name}
          </Title>
        </Flex>
        <DashboardCards />
        <BusinessListBarChart />
        <Row gutter={[24, 24]}>
          <Col
            lg={{ span: 12 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
          >
            <ListingPriceBar />
          </Col>
          <Col
            lg={{ span: 12 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
          >
            <ListingRevenueBar />
          </Col>
        </Row>
        <BusinessCategoryDonut />
      </Flex>
    </div>
  );
};

export { Dashboard };
