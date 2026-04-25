import { Card, Col, Flex, Form, Row, Table, Typography } from "antd";
import { MyDatepicker, SearchInput } from "../../Forms";
import { useState, useEffect } from "react";
import { CustomPagination, TableLoader } from "../../Ui";
import moment from "moment";
import dayjs from "dayjs";
import { GET_COMPLETED_DEALS } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;
const FinanceTable = () => {
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState("");
  const { formatCurrency } = useFormatNumber();
  const { data, refetch, loading } = useQuery(GET_COMPLETED_DEALS, {
    variables: {
      limit: pageSize,
      offset: (current - 1) * pageSize,
      filter: {
        startDate: dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null,
        endDate: dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null,
        search: searchText || null,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  const financeColumn = [
    {
      title: t("Reference No"),
      dataIndex: "reference",
    },
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Deal Amount"),
      dataIndex: "dealAmount",
      render: (_, row) => {
        const price = row?.dealAmount;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Commission Earned"),
      dataIndex: "commissionEarn",
      render: (_, row) => {
        const commission = row?.commissionEarn;

        return commission != null && commission !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{commission}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Date & Time"),
      dataIndex: "dateTime",
    },
  ];
  useEffect(() => {
    refetch({
      limit: pageSize,
      offset: (current - 1) * pageSize,
      filter: {
        startDate: dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null,
        endDate: dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null,
        search: searchText || null,
      },
    });
  }, [dateRange, searchText, pageSize, current, refetch]);

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchText(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const total = data?.getCompletedDeals?.totalCount;
  const financeData =
    data?.getCompletedDeals?.deals.map((deal) => ({
      key: deal.id,
      reference: deal.business?.reference || t("N/A"),
      businessTitle: deal.business?.businessTitle || t("N/A"),
      sellerName: deal.business?.seller?.name || t("N/A"),
      buyerName: deal.buyer?.name || t("N/A"),
      dealAmount: formatCurrency(deal.price ? Number(deal.price) : "0.00"),
      commissionEarn: formatCurrency(
        deal.commission ? Number(deal.commission) : "0.00",
      ),
      dateTime: dayjs(deal.createdAt).format("DD/MM/YYYY hh:mm A"),
    })) || [];

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };
  return (
    <>
      <Card className="radius-12 border-gray">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[12, 12]} justify={"space-between"} align={"middle"}>
              <Col span={24}>
                <Flex justify="space-between">
                  <SearchInput
                    withoutForm
                    name="name"
                    placeholder={t("Search")}
                    prefix={
                      <img
                        src="/assets/icons/search.png"
                        width={14}
                        alt="search icon"
                        fetchPriority="high"
                      />
                    }
                    className="border-light-gray pad-x ps-0 radius-8 fs-13"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                  />
                  <Flex>
                    <MyDatepicker
                      withoutForm
                      rangePicker
                      className="datepicker-cs"
                      value={dateRange}
                      onChange={(dates) => {
                        if (!dates?.length) setDateRange(null);
                        else setDateRange(dates);
                      }}
                    />
                  </Flex>
                </Flex>
              </Col>
            </Row>
          </Form>
          <Table
            size="large"
            columns={financeColumn}
            dataSource={financeData}
            className="pagination table-cs table"
            showSorterTooltip={false}
            scroll={{ x: 1000 }}
            rowHoverable={false}
            pagination={false}
            loading={{
              ...TableLoader,
              spinning: loading,
            }}
          />
          <CustomPagination
            total={total}
            current={current}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Flex>
      </Card>
    </>
  );
};

export { FinanceTable };
