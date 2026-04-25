import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { GET_FINANCE_COUNT } from "../../../graphql/query/";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { useFormatNumber } from "../../../hooks";

const { Title, Text } = Typography;
const FinanceCard = () => {
  const { data: count } = useQuery(GET_FINANCE_COUNT, {
    fetchPolicy: "cache-and-network",
  });
  const { formatCurrency } = useFormatNumber();

  const data = [
    {
      id: 1,
      icon: "totalbusinessprice.png",
      title: count?.getFinanceCount?.totalPrice
        ? formatCurrency(count.getFinanceCount.totalPrice)
        : "0.00",
      subtitle: "Total Businesses Price",
    },
    {
      id: 2,
      icon: "revgen.png",
      title: count?.getFinanceCount?.revenueGenerated
        ? formatCurrency(count.getFinanceCount.revenueGenerated)
        : "0.00",
      subtitle: "Revenue Generated",
    },
    {
      id: 3,
      icon: "revgen.png",
      title: count?.getFinanceCount?.thisMonthRevenue
        ? formatCurrency(count.getFinanceCount.thisMonthRevenue)
        : "0.00",
      subtitle: "Revenue Generated (This Month)",
    },
  ];

  return (
    <Row gutter={[14, 14]}>
      {data?.map((data, index) => (
        <Col span={24} md={{ span: 12 }} lg={{ span: 8 }} key={index}>
          <Card className={`shadow-d radius-12 h-100 border-gray`}>
            <Flex gap={8} vertical>
              <div>
                <img
                  src={"/assets/icons/" + data?.icon}
                  width={45}
                  alt="icon"
                  fetchPriority="high"
                />
              </div>
              <Text className="fs-14 text-gray">{t(data?.subtitle)}</Text>
              <Flex gap={6}>
                <Image
                  src="/assets/icons/reyal.webp"
                  alt="dollar-icon"
                  width={18}
                  height={18}
                  preview={false}
                />
                <Title level={5} className="fw-600 text-black m-0">
                  {data?.title}
                </Title>
              </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { FinanceCard };
