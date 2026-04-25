import { Card, Flex } from "antd";
import ReactApexChart from "react-apexcharts";
import { ModuleTopHeading } from "../../PageComponents";
import { GET_BUSINESS_REVENUE_TIER } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const ListingRevenueBar = () => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const { data, loading } = useQuery(GET_BUSINESS_REVENUE_TIER);

  // Prepare chart series and categories dynamically
  const counts = data?.getBusinessByRevenueTier.map((item) => item.count) || [];

  const maxCount = Math.max(...counts, 10);
  const yAxisMax = Math.ceil(maxCount / 10) * 10;
  const chartData = {
    series: [{ name: t("Listings"), data: counts }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: {
        bar: { columnWidth: "40%", dataLabels: { position: "top" } },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: [
          "(0-50k)",
          "SAR (50k-100k)",
          "SAR (100k-250k)",
          "SAR (250k-500k)",
          "SAR (500k+)",
        ],
        labels: {
          style: { colors: "#000", fontSize: "11px" },
        },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 5,
        labels: { style: { colors: "#000" } },
      },
      fill: { opacity: 1 },
      grid: {
        show: true, // 1. Enable the grid
        borderColor: "#e2e8f0", // 2. Set color to Grey
        strokeDashArray: 5, // 3. Create the "Dot/Dash" effect (higher number = wider gaps)
        position: "back", // 4. Push grid behind bars
        xaxis: {
          lines: {
            show: false, // Hide vertical lines
          },
        },
        yaxis: {
          lines: {
            show: true, // Show horizontal lines
          },
        },
      },
      colors: ["#2E2E65"],
      legend: {
        show: true,
        showForSingleSeries: true,
        fontSize: "16px",
        color: "#777E90",
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: true,
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
    <Card className="radius-12 border-gray">
      <Flex align="center" wrap gap={10}>
        <ModuleTopHeading level={4} name={t("Listings by Revenue")} />
      </Flex>
      <div className="w-100 h-300">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={"100%"}
          width={"100%"}
          className="bar-width"
        />
      </div>
    </Card>
  );
};

export { ListingRevenueBar };
