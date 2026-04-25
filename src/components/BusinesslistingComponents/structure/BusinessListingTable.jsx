import {
  Card,
  Col,
  Flex,
  Form,
  Row,
  Table,
  Space,
  Typography,
  Image,
} from "antd";
import { MyDatepicker, MySelect, SearchInput } from "../../Forms";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CustomPagination, TableLoader } from "../../Ui";
import { GET_CATEGORIES } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;
const BusinessListingTable = ({
  businesses,
  totalCount,
  loading,
  page,
  pageSize,
  onPageChange,
  onFiltersChange,
  search,
  setSearch,
  setCategory,
  setStatus,
}) => {
  const { t, i18n } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  const { data } = useQuery(GET_CATEGORIES, {
    variables: {
      isAdminCategory: true,
    },
  });

  const isArabic = i18n.language === "ar";
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState(null);
  const navigate = useNavigate();

  const categoryItems = useMemo(() => {
    if (!data?.getAllCategories) return [];
    return data?.getAllCategories?.categories?.map((cat) => ({
      id: cat.id,
      name: isArabic ? cat.arabicName || cat.name : cat.name,
    }));
  }, [data, t, isArabic]);

  const statusItems = useMemo(
    () => [
      { id: "ACTIVE", name: t("Active") },
      { id: "UNDER_REVIEW", name: t("Under Review") },
      { id: "INACTIVE", name: t("Inactive") },
      { id: "REJECT", name: t("Rejected") },
      { id: "SOLD", name: t("Sold") },
    ],
    [t],
  );

  const columns = [
    {
      title: t("Ref ID"),
      render: (_, record) => record?.reference,
    },
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Seller Name"),
      render: (_, record) => record?.seller?.name,
    },
    {
      title: t("Category"),
      dataIndex: "category",
      render: (_, record) =>
        isArabic ? record?.category?.arabicName : record?.category?.name,
    },
    {
      title: t("Business Price"),
      dataIndex: "price",
      render: (_, row) => {
        const price = row?.price;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{formatCurrency(price)}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "businessStatus",
      render: (_, record) => {
        const status = record?.businessStatus;
        return status === "UNDER_REVIEW" ? (
          <Space align="center">
            <Text className="btnpill fs-12 pending">{t("Under Review")}</Text>
          </Space>
        ) : status === "INACTIVE" ? (
          <Text className="btnpill fs-12 inactive">{t("Inactive")}</Text>
        ) : status === "ACTIVE" ? (
          <Text className="btnpill fs-12 success">{t("Active")}</Text>
        ) : status === "REJECT" ? (
          <Text className="btnpill fs-12 inactive">{t("Rejected")}</Text>
        ) : status === "SOLD" ? (
          <Text className="btnpill fs-12 sold-status">{t("Sold")}</Text>
        ) : null;
      },
    },
    {
      title: t("Date"),
      render: (_, record) => {
        const date = dayjs(record?.createdAt);
        return date.format("MMM D, YYYY");
      },
    },
  ];

  return (
    <Card className="radius-12 border-gray">
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col xl={18} lg={16} md={24} sm={24} xs={24}>
              <Flex gap={5} wrap>
                <SearchInput
                  withoutForm
                  name="searchName"
                  placeholder={t("Search")}
                  value={search}
                  prefix={
                    <img
                      src="/assets/icons/search.png"
                      width={14}
                      alt="search icon"
                      fetchPriority="high"
                    />
                  }
                  allowClear
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  onChange={(e) => setSearch(e)}
                  debounceMs={400}
                />
                <MySelect
                  withoutForm
                  name="category"
                  placeholder={t("Category")}
                  options={categoryItems}
                  onChange={(value) => setCategory(value)}
                  allowClear
                  showKey
                />
                <MySelect
                  withoutForm
                  name="status"
                  placeholder={t("Status")}
                  options={statusItems}
                  onChange={(value) => setStatus(value)}
                  allowClear
                  showKey
                />
              </Flex>
            </Col>
            <Col xl={6} lg={8} md={24} sm={24} xs={24}>
              <Flex justify="end" gap={10}>
                <MyDatepicker
                  withoutForm
                  label={t("Date")}
                  rangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange([dayjs(dates[0]), dayjs(dates[1])]); // keep as Day.js objects
                    const startDate = dates?.[0]
                      ? dates[0].format("YYYY-MM-DD")
                      : null;
                    const endDate = dates?.[1]
                      ? dates[1].format("YYYY-MM-DD")
                      : null;
                    onFiltersChange({ startDate, endDate });
                  }}
                />
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey={(record) => record.id}
          size="large"
          columns={columns}
          dataSource={businesses}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 1400 }}
          rowHoverable={false}
          onRow={(record) => ({
            onClick: () => navigate("/businesslisting/details/" + record?.id),
          })}
          pagination={false}
          loading={{
            ...TableLoader,
            spinning: loading,
          }}
        />
        <CustomPagination
          total={totalCount || 0}
          current={page}
          pageSize={pageSize}
          onPageChange={(newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          }}
        />
      </Flex>
    </Card>
  );
};

export { BusinessListingTable };
