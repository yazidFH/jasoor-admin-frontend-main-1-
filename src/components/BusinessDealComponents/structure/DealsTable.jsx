import { Col, Flex, Form, Row, Table, Typography } from "antd";
import { SearchInput } from "../../Forms";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomPagination } from "../../Ui";
import { GETDEALS } from "../../../graphql/query/meeting";
import { useLazyQuery } from "@apollo/client";
import { TableLoader } from "../../Ui/TableLoader";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;

// Helper function to determine status display based on boolean flags
const getStatusFromBooleans = (deal, t) => {
  if (deal.status === "CANCEL") {
    return { key: "CANCEL", label: t("Cancelled"), className: "dealcancelled" };
  }
  if (
    deal.isBuyerCompleted &&
    deal.isSellerCompleted &&
    deal.status === "COMPLETED"
  ) {
    return { key: "COMPLETED", label: t("Completed"), className: "success" };
  }

  if (deal.isBuyerCompleted && deal.isSellerCompleted) {
    return {
      key: "JUSOOR_VERIFICATION_PENDING",
      label: t("Awaiting Deal Closure"),
      className: "pending",
    };
  }

  if (deal.isBuyerCompleted && deal.isDocVedifiedBuyer) {
    return {
      key: "DOCUMENT_CONFIRMATION",
      label: t("Finalizing Deal"),
      className: "pending",
    };
  }

  if (!deal.isDocVedifiedSeller && deal.isPaymentVedifiedSeller) {
    return {
      key: "DOCUMENT_CONFIRMATION_PENDING",
      label: t("Document Verification Pending"),
      className: "pending",
    };
  }

  // Step 3: Pay Business Amount - Waiting for payment verification (YELLOW - PENDING)
  if (deal.isDsaSeller && deal.isDsaBuyer && !deal.isPaymentVedifiedSeller) {
    return {
      key: "PAYMENT_PENDING",
      label: t("Payment Verification Pending"),
      className: "pending",
    };
  }

  // Step 2: Digital Sale Agreement (YELLOW - PENDING)
  if (deal.isCommissionVerified) {
    if (!deal.isDsaSeller && !deal.isDsaBuyer) {
      return {
        key: "DSA_PENDING",
        label: t("DSA Pending"),
        className: "pending",
      };
    } else if (!deal.isDsaSeller) {
      return {
        key: "DSA_SELLER_PENDING",
        label: t("DSA Seller Pending"),
        className: "pending",
      };
    } else if (!deal.isDsaBuyer) {
      return {
        key: "DSA_BUYER_PENDING",
        label: t("DSA Buyer Pending"),
        className: "pending",
      };
    }
  }
  if (!deal?.isCommissionVerified && deal?.isCommissionUploaded) {
    return {
      key: "COMMISSION_VERIFICATION_PENDING",
      label: t("Commission Verification Pending"),
      className: "pending",
    };
  }
  // Step 1: Commission Receipt (YELLOW - PENDING)
  if (deal.isCommissionUploaded) {
    return {
      key: "COMMISSION_PENDING",
      label: t("Commission Pending"),
      className: "pending",
    };
  }

  // Default fallback (YELLOW - PENDING)
  return {
    key: "PENDING",
    label: t("Commission Pending"),
    className: "pending",
  };
};

const DealsTable = ({ dealType = "INPROGRESS", onRowClick }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [getDeals, { data, loading }] = useLazyQuery(GETDEALS, {
    fetchPolicy: "network-only",
  });

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const variables = {
      limit: pageSize,
      offset: (current - 1) * pageSize,
      search: searchValue || null,
    };

    // Set status based on deal type
    if (dealType === "inprogress") {
      variables.status = null;
      variables.dealType = "inprogress";
    } else if (dealType === "completed") {
      variables.status = null;
      variables.dealType = "completed";
    } else if (dealType === "canceled") {
      variables.status = null;
      variables.dealType = "canceled";
    }

    getDeals({ variables });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, current, pageSize, dealType]);

  const dealData =
    (data?.getDeals?.deals || []).map((item) => ({
      key: item?.id,
      businessTitle: item?.business?.businessTitle || "-",
      buyerName: item?.buyer?.name || "-",
      sellerName: item?.business?.seller?.name || "-",
      finalizedOffer: item?.offer?.price
        ? formatCurrency(item?.offer?.price)
        : "-",
      statusInfo: getStatusFromBooleans(item, t),
      date: item?.createdAt
        ? new Date(item?.createdAt).toLocaleDateString()
        : "-",
    })) || [];

  const total = data?.getDeals?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const columns = [
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
      render: (_, row) => {
        const price = row?.finalizedOffer;

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
      dataIndex: "statusInfo",
      render: (statusInfo) => {
        return (
          <Text className={`btnpill fs-12 ${statusInfo.className}`}>
            {statusInfo.label}
          </Text>
        );
      },
    },
    {
      title: t("Date"),
      dataIndex: "date",
    },
  ];

  return (
    <>
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Flex gap={5} wrap>
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
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          size="large"
          columns={columns}
          dataSource={dealData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: dealType === "INPROGRESS" ? 1600 : 1200 }}
          rowHoverable={false}
          onRow={(record) => ({
            onClick: () => {
              navigate("/businessdeal/details/" + record?.key);
              if (onRowClick) {
                onRowClick(record);
              }
            },
          })}
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

export { DealsTable };
