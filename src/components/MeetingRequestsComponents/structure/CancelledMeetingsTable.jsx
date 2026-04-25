import { Col, Flex, Form, Row, Table, Typography } from "antd";
import { SearchInput } from "../../Forms";
import { useEffect, useState } from "react";
import { CustomPagination, TableLoader } from "../../Ui";
import { GETADMINCANCELMEETINGS } from "../../../graphql/query/meeting";
import { useLazyQuery } from "@apollo/client";
import { t } from "i18next";
import dayjs from "dayjs";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;

const CancelledMeetingsTable = () => {
  const { formatCurrency } = useFormatNumber();
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [fetchCancelledMeetings, { data, loading }] = useLazyQuery(
    GETADMINCANCELMEETINGS,
    { fetchPolicy: "network-only" },
  );

  useEffect(() => {
    fetchCancelledMeetings({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchValue || null,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, current, searchValue]);

  // Mapping data for Ant Design Table
  const cancelledMeetingData =
    data?.getAdminCancelMeetings?.items?.map((item) => {
      const isSeller = item.business?.seller?.id === item.requestedBy?.id;
      const requestedDate = item.requestedDate
        ? dayjs(item.requestedDate)
        : null;
      const requestedEndDate = item.requestedEndDate
        ? dayjs(item.requestedEndDate)
        : null;
      const receiverAvailabilityDate = item.receiverAvailabilityDate
        ? dayjs(item.receiverAvailabilityDate)
        : null;

      return {
        key: item.id,
        businessTitle: item.business?.businessTitle || "-",
        buyerName: isSeller
          ? item?.requestedTo?.name || "-"
          : item?.requestedBy?.name || "-",
        email: isSeller
          ? item?.requestedTo?.email || "-"
          : item?.requestedBy?.email || "-",
        phoneNumber: isSeller
          ? item?.requestedTo?.phone || "-"
          : item?.requestedBy?.phone || "-",
        sellerName: item.business?.seller?.name || "-",
        sellerEmail: item.business?.seller?.email || "-",
        sellerPhoneNumber: item.business?.seller?.phone || "-",
        buyerTime: !isSeller
          ? `${requestedDate?.format(
              "DD MMM YYYY, hh:mm A",
            )} - ${requestedEndDate?.format("hh:mm A")}`
          : requestedDate
            ? receiverAvailabilityDate?.format("DD MMM YYYY, hh:mm A")
            : "-",
        sellerTime: isSeller
          ? `${requestedDate?.format(
              "DD MMM YYYY, hh:mm A",
            )} - ${requestedEndDate?.format("hh:mm A")}`
          : requestedDate
            ? receiverAvailabilityDate?.format("DD MMM YYYY, hh:mm A")
            : "-",
        businessPrice: item.business?.price
          ? formatCurrency(item.business.price)
          : "-",
        offerPrice: item.offer?.price ? formatCurrency(item.offer.price) : "-",
        status: item.status || "-",
      };
    }) || [];

  const total = data?.getAdminCancelMeetings?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const cancelledMeetingColumns = [
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Buyer Email"),
      dataIndex: "email",
    },
    {
      title: t("Buyer Phone"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("Preferred Date & Time (Buyer)"),
      dataIndex: "buyerTime",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Seller Email"),
      dataIndex: "sellerEmail",
    },
    {
      title: t("Seller Phone"),
      dataIndex: "sellerPhoneNumber",
    },
    {
      title: t("Preferred Date & Time (Seller)"),
      dataIndex: "sellerTime",
    },
    {
      title: t("Business Price"),
      dataIndex: "businessPrice",
      render: (_, row) => {
        const price = row?.businessPrice;

        return price != null && price !== "" && price !== "-" ? (
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
      title: t("Offer Price"),
      dataIndex: "offerPrice",
      render: (_, row) => {
        const price = row?.offerPrice;

        return price != null && price !== "" && price !== "-" ? (
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
      title: t("Status"),
      dataIndex: "status",
      render: () => {
        return (
          <Text className="btnpill fs-12 dealcancelled">{t("Cancelled")}</Text>
        );
      },
    },
  ];

  return (
    <>
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col lg={24} md={24} sm={24} xs={24}>
              <Flex gap={5}>
                <SearchInput
                  withoutForm
                  name="name"
                  placeholder={t("Search")}
                  prefix={
                    <img
                      src="/assets/icons/search.png"
                      width={14}
                      alt="search"
                    />
                  }
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </Flex>
            </Col>
          </Row>
        </Form>

        <Table
          size="large"
          columns={cancelledMeetingColumns}
          dataSource={cancelledMeetingData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 3100 }}
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
    </>
  );
};

export { CancelledMeetingsTable };
