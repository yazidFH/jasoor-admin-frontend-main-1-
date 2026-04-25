import {
  Button,
  Dropdown,
  Flex,
  Popover,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { NavLink } from "react-router-dom";
import { MyInput, MySelect } from "../components";
import { priorityItems } from "../shared";
import { useTranslation } from "react-i18next";
const { Text } = Typography;
import { t } from "i18next";
import { PercentageOutlined } from "@ant-design/icons";
import { useFormatNumber } from "../hooks";

const usePostSaleColumn = () => {
  const { t } = useTranslation();
  return [
    {
      title: t("Support Periods"),
      dataIndex: "supportperiod",
      render: (supportperiod) => {
        return (
          <Text>
            {supportperiod} {t("months")}
          </Text>
        );
      },
    },
    {
      title: t("Number of Session"),
      dataIndex: "nosession",
      render: (nosession) => {
        return (
          <Text>
            {nosession} {t("sessions")}
          </Text>
        );
      },
    },
  ];
};

const useOfferTableColumn = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  return [
    {
      title: t("Buyer Name"),
      dataIndex: "buyername",
      render: (buyername) => {
        return (
          <Text>
            {buyername.substring(0, 5)}
            {"*".repeat(buyername.length - 5)}
          </Text>
        );
      },
    },
    {
      title: t("Business Price"),
      dataIndex: "businessprice",
      render: (businessprice) => {
        return <Text>{formatCurrency(businessprice)}</Text>;
      },
    },
    {
      title: t("Offer Price"),
      dataIndex: "offerprice",
      render: (_, row) => {
        return (
          <>
            <Flex gap={10} align="center">
              {formatCurrency(row?.offerprice)}
              {row?.priceType === 1 ? (
                <Tooltip title="CO - Counteroffer">
                  <Text className="brand-bg radius-4 p-1 fs-11 text-white">
                    CO
                  </Text>
                </Tooltip>
              ) : (
                <Tooltip title="PP - Proceed to Purchase">
                  <Text className="bg-orange bg radius-4 p-1 fs-11 text-white">
                    PP
                  </Text>
                </Tooltip>
              )}
            </Flex>
          </>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        return status === 0 ? (
          <Space align="center">
            <Text className="btnpill fs-12 pending">Send</Text>
          </Space>
        ) : status === 1 ? (
          <Text className="btnpill fs-12 inactive">Reject</Text>
        ) : status === 2 ? (
          <Text className="btnpill fs-12 success">Received</Text>
        ) : null;
      },
    },
    {
      title: t("Offer Date"),
      dataIndex: "offerdate",
    },
  ];
};

const categoryStatsProfColumn = (handleInputChange) => [
  {
    title: t("Region Name"),
    dataIndex: "regionname",
  },
  {
    title: "2024",
    dataIndex: "value2024",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2024")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2023",
    dataIndex: "value2023",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2023")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2022",
    dataIndex: "value2022",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2022")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2021",
    dataIndex: "value2021",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2021")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: t("Local Business Growth"),
    dataIndex: "localbusinessgrowth",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) =>
          handleInputChange(e.target.value, index, "localbusinessgrowth")
        }
        addonBefore={<PercentageOutlined style={{ fontSize: "14px" }} />}
        className="w-100"
      />
    ),
  },
  {
    title: t("Population Density"),
    dataIndex: "populationdensity",
    render: (value, record, index) => (
      <MySelect
        withoutForm
        placeholder="Select Density"
        value={value}
        onChange={(value) =>
          handleInputChange(value, index, "populationdensity")
        }
        options={priorityItems}
      />
    ),
  },
  {
    title: t("Industry Demand"),
    dataIndex: "industrydemand",
    render: (value, record, index) => (
      <MySelect
        withoutForm
        placeholder="Select Demand"
        value={value}
        onChange={(value) => handleInputChange(value, index, "industrydemand")}
        options={priorityItems}
      />
    ),
  },
];

const completedealColumn = [
  {
    title: t("Business Title"),
    dataIndex: "businessTitle",
  },
  {
    title: t("Buyer Name"),
    dataIndex: "buyerName",
  },
  {
    title: t("Seller Name"),
    dataIndex: "sellerName",
  },
  {
    title: t("Finalized Offer"),
    dataIndex: "finalizedOffer",
  },
  {
    title: t("Date"),
    dataIndex: "date",
  },
];

const pushnotifyColumn = ({
  setVisible,
  setViewNotify,
  setEditItem,
  setDeleteItem,
}) => [
  {
    title: t("Title"),
    dataIndex: "title",
  },
  {
    title: t("Description"),
    dataIndex: "description",
    render: (description) => {
      const words = description?.split(" ") || [];
      const previewText = words.slice(0, 5).join(" ");
      const showEllipsis = words.length > 5;

      return (
        <Tooltip title={description}>
          <Text>
            {previewText}
            {showEllipsis ? "..." : ""}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    title: t("Group"),
    dataIndex: "group",
    render: (group) => {
      return <Text>{group}</Text>;
    },
  },
  {
    title: t("Regions"),
    dataIndex: "district",
    render: (district) => {
      if (!Array.isArray(district) || district.length === 0) return null;

      const visibleCount = 3;
      const visibleItems = district.slice(0, visibleCount);
      const extraCount = district.length - visibleCount;

      return (
        <Flex gap={5} align="center" wrap>
          {visibleItems.map((list, i) => (
            <Text key={i} className="sm-pill border-gray fs-12">
              {list?.item}
            </Text>
          ))}
          {extraCount > 0 && (
            <Popover
              content={
                <Flex direction="column" gap={5}>
                  {district.map((d, idx) => (
                    <Text key={idx} className="sm-pill border-gray fs-12">
                      {d?.item}
                    </Text>
                  ))}
                </Flex>
              }
              title="All Regions"
            >
              <Text
                className="sm-pill border-gray fs-12"
                style={{ cursor: "pointer" }}
              >
                +{extraCount} more
              </Text>
            </Popover>
          )}
        </Flex>
      );
    },
  },
  {
    title: t("Date"),
    dataIndex: "date",
  },
  {
    title: t("Status"),
    dataIndex: "status",
    render: (status) => {
      return status === 1 ? (
        <Text className="btnpill fs-12 success">Sent</Text>
      ) : (
        <Text className="btnpill fs-12 branded">Schedule</Text>
      );
    },
  },
  {
    title: t("Action"),
    key: "action",
    fixed: "right",
    width: 100,
    render: (_, row) => (
      <Dropdown
        menu={{
          items: [
            row?.status === 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(true);
                    setViewNotify(row);
                  }}
                >
                  {t("View")}
                </NavLink>
              ),
              key: "1",
            },
            row?.status !== 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(true);
                    setEditItem(row);
                  }}
                >
                  {t("Edit")}
                </NavLink>
              ),
              key: "2",
            },
            row?.status !== 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteItem(row.id);
                  }}
                >
                  {t("Delete")}
                </NavLink>
              ),
              key: "3",
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button
          aria-labelledby="action button"
          className="bg-transparent border0 p-0"
        >
          <img
            src="/assets/icons/dots.png"
            alt="dot icon"
            width={16}
            fetchPriority="high"
          />
        </Button>
      </Dropdown>
    ),
  },
];

export {
  usePostSaleColumn,
  useOfferTableColumn,
  categoryStatsProfColumn,
  completedealColumn,
  pushnotifyColumn,
};
