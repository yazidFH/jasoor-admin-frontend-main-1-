import { Card, Col, Flex, Row, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import { ModuleTopHeading } from "../../PageComponents";
import { GET_BUSINESS_CATEGORY_COUNT } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const BusinessCategoryDonut = () => {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { data: categoryData, loading } = useQuery(GET_BUSINESS_CATEGORY_COUNT);
  const chartData = {
    series:
      categoryData?.getCountByEachCategory.map((item) => item.count) || [],
    options: {
      chart: {
        type: "donut",
      },
      labels:
        categoryData?.getCountByEachCategory.map((item) =>
          isArabic ? item.arabicCategory : item.category,
        ) || [],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      colors: [
        "#FF3470",
        "#1D4ED8",
        "#953DCA",
        "#F71691",
        "#FF822D",
        "#FFA600",
        "#D024B1",
        "#D00000",
        "#FF4D00",
        "#FF5C4E",
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "40%",
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div>
      <Card className="shadow-d radius-12">
        <Flex className="pb-2">
          <ModuleTopHeading level={4} name={t("Business Categories")} />
        </Flex>
        <Row gutter={[24, 24]} align={"middle"}>
          <Col
            lg={{ span: 10 }}
            md={{ span: 24 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              width="100%"
              height={300}
            />
          </Col>
          <Col
            lg={{ span: 14 }}
            md={{ span: 24 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                xs={{ span: 24 }}
                sm={{ span: 24 }}
              >
                {categoryData?.getCountByEachCategory
                  .slice(0, 5)
                  .map((item, index) => (
                    <Flex gap={5} align="center" className="mb-3" key={index}>
                      <img
                        src={item.icon}
                        width={24}
                        alt="category icon"
                        fetchPriority="high"
                      />
                      <Text className="fs-16 fw-500">
                        {isArabic
                          ? categoryData?.getCountByEachCategory[index]
                              ?.arabicCategory
                          : categoryData?.getCountByEachCategory[index]
                              ?.category}
                      </Text>
                    </Flex>
                  ))}
              </Col>
              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                xs={{ span: 24 }}
                sm={{ span: 24 }}
              >
                {categoryData?.getCountByEachCategory
                  .slice(5)
                  .map((item, index) => (
                    <Flex gap={5} align="center" className="mb-3" key={index}>
                      <img
                        src={item.icon}
                        width={24}
                        alt="category icon"
                        fetchPriority="high"
                      />
                      <Text className="fs-16 fw-500">
                        {isArabic
                          ? categoryData?.getCountByEachCategory[index + 5]
                              ?.arabicCategory
                          : categoryData?.getCountByEachCategory[index + 5]
                              ?.category}
                      </Text>
                    </Flex>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export { BusinessCategoryDonut };
