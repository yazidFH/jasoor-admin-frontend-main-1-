import { Card, Flex } from "antd";
import ReactApexChart from "react-apexcharts";
import { ModuleTopHeading } from "../../PageComponents";
import { GET_BUSINESS_PRICE_TIER } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { t } from "i18next";

const ListingPriceBar = () => {
  const { data, loading } = useQuery(GET_BUSINESS_PRICE_TIER);

  // Prepare chart series and categories dynamically
  const counts = data?.getBusinessByPriceTier.map((item) => item.count) || [];

  // Optionally calculate dynamic Y-axis max
  const maxCount = Math.max(...counts, 10); // fallback to 10 if all zero
  const yAxisMax = Math.ceil(maxCount / 10) * 10; // round up to nearest 10 for nice scale

  const chartData = {
    series: [{ name: t("Listings"), data: counts }],
    options: {
      plotOptions: {
        bar: { columnWidth: "60%", dataLabels: { position: "top" } },
      },
      chart: { type: "bar", toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: [
          "(0-50k)",
          "(50k-100k)",
          "(100k-250k)",
          "(250k-500k)",
          "(500k+)",
        ],
        labels: {
          style: { colors: "#000", fontSize: "11px" },
        },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#000",
          },
        },
      },
      fill: {
        opacity: 1,
      },
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
      colors: ["#3B82F6"],
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
        <ModuleTopHeading level={4} name={t("Listings by Price Tier")} />
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

export { ListingPriceBar };
