import { useState } from "react";
import { Card, Flex, Typography, Button, Image, DatePicker } from "antd";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";
import { GET_FINANCE_GRAPH } from "../../../graphql/query";
import { useQuery } from "@apollo/client";
import { ModuleTopHeading } from "../../PageComponents";
import { t } from "i18next";

const { Title } = Typography;

const FinanceAreaChart = () => {
  const [selectedStatus, setSelectedStatus] = useState(
    dayjs().year().toString()
  );

  const { data } = useQuery(GET_FINANCE_GRAPH, {
    variables: { year: Number(selectedStatus) },
    fetchPolicy: "cache-and-network",
  });

  const handleYearChange = (date, dateString) => {
    if (dateString) {
      setSelectedStatus(dateString);
    }
  };

  const chartData = {
    series: [
      {
        name: "Revenue",
        data:
          data?.getRenenueGraph?.graphData?.map((item) =>
            Number(item.revenue.toFixed(2))
          ) || Array(12).fill(0),
      },
    ],
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
      },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: { style: { colors: "#000" } },
      },
      yaxis: {
        labels: { formatter: (val) => `${val}k`, style: { colors: "#000" } },
      },
      markers: {
        size: 4,
        colors: ["#2563EB"],
        strokeWidth: 2,
        strokeColors: "#fff",
        hover: { size: 6 },
      },
      tooltip: { y: { formatter: (val) => `${val}` } },
      grid: { borderColor: "#eee", strokeDashArray: 4 },
      colors: ["#2563EB"],
      legend: { show: false },
    },
  };

  return (
    <Card className="radius-12 border-gray">
      <Flex justify="space-between" align="center" wrap gap={10}>
        <Flex vertical gap={3}>
          <ModuleTopHeading level={4} name={t("Revenue")} />
          <Flex gap={6}>
            <Image
              src="/assets/icons/reyal.webp"
              alt="dollar-icon"
              width={20}
              height={20}
              preview={false}
            />
            <Title level={4} className="fw-600 text-black m-0">
              {data?.getRenenueGraph?.totalRevenue}
            </Title>
          </Flex>
        </Flex>
        <DatePicker
          picker="year"
          value={dayjs(selectedStatus, "YYYY")}
          onChange={handleYearChange}
          allowClear={false}
          className="btncancel px-3 filter-bg fs-13 text-black"
        />
      </Flex>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={260}
      />
    </Card>
  );
};

export { FinanceAreaChart };
