import { useState, useEffect } from "react";
import { Card, Flex, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import { ModuleTopHeading } from "../../PageComponents";
import { MyDatepicker } from "../../Forms";
import { GET_BUSINESS_STATS_GRAPH } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import dayjs from "dayjs"; // Import dayjs
import { useFormatNumber } from "../../../hooks";

const { Title } = Typography;

const BusinessListBarChart = () => {
  // FIX 1: Initialize state with current date (dayjs object) so it isn't undefined
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const { formatNumber } = useFormatNumber();

  const { data, refetch } = useQuery(GET_BUSINESS_STATS_GRAPH, {
    // FIX 2: Add safety check (?.) or fallback to current year
    variables: { year: selectedYear?.year() || dayjs().year() },
  });

  const maxCount = Math.max(
    ...(data?.getBusinessStatsGraph?.monthlyStats.map(
      (m) => m.businessCount,
    ) || [0]),
  );

  // Determine Y-axis max based on largest count
  let yAxisMax = 100;

  if (maxCount >= 1000) {
    yAxisMax = Math.ceil(maxCount / 1000) * 1000;
  } else if (maxCount >= 100) {
    yAxisMax = Math.ceil(maxCount / 100) * 100;
  } else {
    yAxisMax = 100;
  }

  // Prepare chart data
  const chartData = {
    series: [
      {
        name: t("Total Businesses"),
        data:
          data?.getBusinessStatsGraph?.monthlyStats.map(
            (m) => m.businessCount,
          ) || Array(12).fill(0),
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: data?.getBusinessStatsGraph?.monthlyStats.map(
          (m) => m.month,
        ) || [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: { style: { colors: "#000" } },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 5,
        labels: {
          formatter: (value) => value,
          style: { colors: "#000" },
        },
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
      colors: ["#3B82F6"],
      legend: {
        show: true,
        fontSize: "16px",
        color: "#777E90",
        showForSingleSeries: true,
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
    },
  };

  // Refetch when year changes
  useEffect(() => {
    if (selectedYear) {
      refetch({ year: selectedYear.year() });
    }
  }, [selectedYear, refetch]);

  return (
    <Card className="radius-12 border-gray">
      <Flex justify="space-between" align="center" wrap gap={10}>
        <Flex vertical gap={3}>
          <ModuleTopHeading level={4} name={t("Business Listing Stats")} />
          <Title level={4} className="fw-600 text-black m-0">
            {data?.getBusinessStatsGraph?.totalBusinesses}
          </Title>
        </Flex>
        <Flex justify="end" gap={10}>
          <MyDatepicker
            withoutForm
            year
            className="datepicker-cs"
            picker="year"
            placeholder={t("Select Year")}
            value={selectedYear}
            onChange={(val) => {
              if (val) setSelectedYear(val);
            }}
            format="YYYY"
          />
        </Flex>
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

export { BusinessListBarChart };
