import {
  Card,
  Flex,
  Table,
  Typography,
  Tooltip,
  Pagination,
  Row,
  Col,
  Select,
  Space,
  Image,
} from "antd";
import { OFFERBYBUSINESSID } from "../../../graphql/query";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TableLoader } from "../../Ui";
import { useFormatNumber } from "../../../hooks";

const { Title, Text } = Typography;
const OfferTable = (businessId) => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, loading } = useQuery(OFFERBYBUSINESSID, {
    variables: {
      getOfferByBusinessIdId: businessId?.businessId,
      limit: pageSize,
      offSet: currentPage - 1,
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  const total = data?.getOfferByBusinessId?.count || 0;

  const offerData =
    data?.getOfferByBusinessId?.offers?.map((offer, index) => ({
      key: index,
      buyername: offer?.buyer?.name,
      businessprice: formatCurrency(offer?.business?.price),
      offerprice: formatCurrency(offer?.price),
      isProceedToPay: offer?.isProceedToPay,
      status: offer?.status,
      offerdate: new Date(offer?.createdAt).toLocaleDateString(),
    })) || [];

  const offertableColumn = [
    {
      title: t("Buyer Name"),
      dataIndex: "buyername",
      render: (buyername) => {
        if (!buyername) return <Text>-</Text>;
        const visiblePart = buyername.substring(0, 5);
        const hiddenPart = "*".repeat(Math.max(0, buyername.length - 5));
        return (
          <Text>
            {visiblePart}
            {hiddenPart}
          </Text>
        );
      },
    },
    {
      title: t("Business Price"),
      dataIndex: "businessprice",
      render: (_, row) => {
        const price = row?.businessprice;

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
      title: t("Offer Price"),
      dataIndex: "offerprice",
      render: (_, row) => {
        return (
          <Flex gap={10} align="center">
            <Image
              src="/assets/icons/reyal.webp"
              alt={t("currency-symbol")}
              preview={false}
              width={18}
            />
            {row?.offerprice}
            {row?.isProceedToPay ? (
              <Tooltip title={t("PP - Proceed to Purchase")}>
                <Text className="bg-orange radius-4 p-1 fs-11 text-white">
                  PP
                </Text>
              </Tooltip>
            ) : (
              <Tooltip title={t("CO - Counter Offer")}>
                <Text className="brand-bg radius-4 p-1 fs-11 text-white">
                  CO
                </Text>
              </Tooltip>
            )}
          </Flex>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        return status === "ACCEPTED" ? (
          <Space align="center">
            <Text className="btnpill fs-12 pending">{t("Accepted")}</Text>
          </Space>
        ) : status === "REJECTED" ? (
          <Text className="btnpill fs-12 inactive">{t("Reject")}</Text>
        ) : status === "PENDING" ? (
          <Text className="btnpill fs-12 inactive">{t("Pending")}</Text>
        ) : status ? (
          <Text className="btnpill fs-12 success">{t("Received")}</Text>
        ) : null;
      },
    },
    {
      title: t("Offer Date"),
      dataIndex: "offerdate",
    },
  ];

  return (
    <Card className="radius-12 border-gray">
      <Flex vertical gap={10}>
        <Title level={5} className="m-0">
          {t("Offer")}
        </Title>
        <Table
          size="large"
          columns={offertableColumn}
          dataSource={offerData}
          className="pagination table table-cs"
          showSorterTooltip={false}
          scroll={{ x: 500 }}
          rowHoverable={false}
          pagination={false}
          loading={{
            ...TableLoader,
            spinning: loading,
          }}
        />
      </Flex>
      {/* --- LOGIC ADDED HERE: Only show if total items exceed page size --- */}
      {total > pageSize && (
        <Col span={24} className="mt-3">
          <Row justify="space-between" align="middle">
            <Col span={6}>
              <Flex gap={5} align="center">
                <Text>{t("Rows per page")}:</Text>
                <Select
                  className="select-filter"
                  value={pageSize}
                  onChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 5, label: 5 },
                    { value: 10, label: 10 },
                    { value: 20, label: 20 },
                    { value: 50, label: 50 },
                  ]}
                />
              </Flex>
            </Col>
            <Col
              lg={{ span: 12 }}
              md={{ span: 12 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Pagination
                className="pagination"
                align="end"
                current={currentPage}
                pageSize={pageSize}
                total={total || 0}
                onChange={(page) => setCurrentPage(page)}
              />
            </Col>
          </Row>
        </Col>
      )}
    </Card>
  );
};

export { OfferTable };
