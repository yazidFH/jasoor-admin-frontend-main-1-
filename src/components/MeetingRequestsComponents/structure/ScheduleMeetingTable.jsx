import {
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Typography,
  Modal,
  Input,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import { MySelect, SearchInput } from "../../Forms";
import { useState, useEffect, useMemo } from "react";
import { meetingItems } from "../../../shared";
import { CustomPagination, TableLoader, DeleteModal } from "../../Ui";
import { RescheduleMeeting } from "../modal";
import { UPDATE_BUSINESS_MEETING } from "../../../graphql/mutation";
import { GETADMINSCHEDULEMEETINGS } from "../../../graphql/query/meeting";
import { IS_BUSINESS_IN_DEAL_PROCESS } from "../../../graphql/query/business";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const GET_SETTING = gql`
  query GetSetting {
    getSetting {
      commissionRate
    }
  }
`;

const { Text } = Typography;

const ScheduleMeetingTable = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatNumber();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [visible, setVisible] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const [updateMeeting, { loading: updating }] = useMutation(
    UPDATE_BUSINESS_MEETING,
  );
  const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
  const [disabledActionBusinessIds, setDisabledActionBusinessIds] = useState(
    new Set(),
  );

  const { data: settingData } = useQuery(GET_SETTING, {
    fetchPolicy: "network-only",
  });
  const commissionRate = settingData?.getSetting?.commissionRate || 0;

  console.log("Commission Rate:", commissionRate);

  const schedulemeetingColumn = (setVisible) => [
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Email"),
      dataIndex: "email",
    },
    {
      title: t("Phone Number"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Email"),
      dataIndex: "sellerEmail",
    },
    {
      title: t("Phone Number"),
      dataIndex: "sellerPhoneNumber",
    },
    {
      title: t("Schedule Date & Time"),
      dataIndex: "scheduleDateTime",
    },
    {
      title: t("Business Price"),
      dataIndex: "businessPrice",
      render: (_, row) => {
        const price = row?.businessPrice;

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
      dataIndex: "offerPrice",
      render: (_, row) => {
        const price = row?.offerPrice;

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
      title: t("Meet Link"),
      dataIndex: "meetLink",
      render: (meetLink) => <NavLink to={meetLink}>{meetLink}</NavLink>,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        if (status === "APPROVED") {
          return (
            <Text className="btnpill fs-12 pending">{t("Scheduled")}</Text>
          );
        } else if (status === "HELD") {
          return <Text className="btnpill fs-12 success">{t("Held")}</Text>;
        } else if (status === "RESCHEDULED") {
          return (
            <Text className="btnpill fs-12 pending">{t("Rescheduled")}</Text>
          );
        } else if (status === "CANCELED") {
          return (
            <Text className="btnpill fs-12 inactive">{t("Cancelled")}</Text>
          );
        } else if (status === "TIMELAPSED") {
          return (
            <Text className="btnpill fs-12 inactive">{t("Time Lapsed")}</Text>
          );
        }

        return <Text className="btnpill fs-12 inactive">{status || "-"}</Text>;
      },
    },
    {
      title: t("Action"),
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => {
        if (row.status === "HELD") return null;
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: t("Open Deal"),
                  key: "1",
                  disabled: disabledActionBusinessIds.has(row.businessId),
                  onClick: () => {
                    if (disabledActionBusinessIds.has(row.businessId)) {
                      messageApi.warning(
                        t("Deal already opened for this business."),
                      );
                      return;
                    }
                    setVisible(true);
                    setSelectedOffer({
                      id: row.offerId,
                      price: row.offerPrice,
                      commission: row.offerCommission,
                      meetingId: row.key,
                      businessId: row.businessId,
                    });
                  },
                },
                {
                  label: t("Reschedule Meeting"),
                  key: "4",
                  disabled:
                    row.status === "HELD" ||
                    row.status === "CANCELED" ||
                    row.status === "RESCHEDULED",
                  onClick: () => {
                    if (row.status === "HELD") {
                      messageApi.warning(
                        t("Cannot reschedule a held meeting."),
                      );
                      return;
                    }
                    if (row.status === "CANCELED") {
                      messageApi.warning(
                        t("Cannot reschedule a cancelled meeting."),
                      );
                      return;
                    }
                    if (row.status === "RESCHEDULED") {
                      messageApi.warning(t("Meeting is already rescheduled."));
                      return;
                    }
                    setSelectedMeetingId(row.key);
                    setRescheduleVisible(true);
                  },
                },
                {
                  label: t("Cancel"),
                  key: "3",
                  disabled: row.status === "HELD" || row.status === "CANCELED",
                  onClick: () => {
                    if (row.status === "HELD") {
                      messageApi.warning(t("Cannot cancel a held meeting."));
                      return;
                    }
                    if (row.status === "CANCELED") {
                      messageApi.warning(t("Meeting is already cancelled."));
                      return;
                    }
                    setSelectedMeetingId(row.key);
                    setDeleteItem(true);
                  },
                },
              ],
            }}
            trigger={["click"]}
            open={openDropdownRowId === row.key}
            onOpenChange={async (nextOpen) => {
              if (!nextOpen) {
                setOpenDropdownRowId(null);
                return;
              }
              if (disabledActionBusinessIds.has(row.businessId)) {
                messageApi.warning(t("Deal already opened for this business."));
                setOpenDropdownRowId(row.key);
                return;
              }
              try {
                const { data: dealData } = await checkBusinessInDealProcess({
                  variables: { isBusinessInDealProcessId: row.businessId },
                });
                const isInDeal = !!dealData?.isBusinessInDealProcess;
                if (isInDeal) {
                  setDisabledActionBusinessIds((prev) => {
                    const next = new Set(prev);
                    next.add(row.businessId);
                    return next;
                  });
                  messageApi.warning(
                    t("Deal already opened for this business."),
                  );
                  setOpenDropdownRowId(row.key);
                } else {
                  setOpenDropdownRowId(row.key);
                }
              } catch (err) {
                console.error(err);
                messageApi.error(t("Unable to check deal status."));
                setOpenDropdownRowId(null);
              }
            }}
          >
            <Button
              aria-labelledby="action button"
              className="bg-transparent border0 p-0"
              style={
                disabledActionBusinessIds.has(row.businessId)
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}
              }
            >
              <img
                src="/assets/icons/dots.png"
                alt="dot icon"
                width={16}
                fetchPriority="high"
              />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  // Apollo lazy query
  const [fetchScheduledMeetings, { data, loading }] = useLazyQuery(
    GETADMINSCHEDULEMEETINGS,
    {
      fetchPolicy: "network-only",
    },
  );
  const [checkBusinessInDealProcess] = useLazyQuery(
    IS_BUSINESS_IN_DEAL_PROCESS,
    {
      fetchPolicy: "network-only",
    },
  );

  // map UI-selected status to API variable
  const filter = useMemo(() => {
    let statusValue = null;
    if (selectedStatus === "Scheduled" || selectedStatus === "2") {
      statusValue = "APPROVED";
    } else if (selectedStatus === "Held" || selectedStatus === "3") {
      statusValue = "HELD";
    } else if (selectedStatus === "Rescheduled" || selectedStatus === "4") {
      statusValue = "RESCHEDULED";
    }

    return {
      search: searchValue || null,
      status: statusValue,
    };
  }, [selectedStatus, searchValue]);

  useEffect(() => {
    fetchScheduledMeetings({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        ...filter,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, current, filter]);
  const schedulemeetingData = (
    data?.getAdminScheduledMeetings?.items || []
  ).map((item) => {
    const isSeller = item.business?.seller?.id === item.requestedBy?.id;

    return {
      key: item.id,
      offerId: item?.offer?.id,
      offerPrice: item?.offer?.price ? formatCurrency(item?.offer?.price) : "-",
      businessId: item?.business?.id,
      buyerName: isSeller
        ? item?.requestedTo?.name || "-"
        : item?.requestedBy?.name || "-",
      offerCommission: item?.offer?.commission,
      status: item?.status,
      businessTitle: item.business?.businessTitle || "-",
      email: isSeller
        ? item?.requestedTo?.email
        : item?.requestedBy?.email || "-",
      phoneNumber: isSeller
        ? item?.requestedTo?.phone
        : item?.requestedBy?.phone || "-",
      sellerName: item.business?.seller?.name || "-",
      sellerEmail: item.business?.seller?.email || "-",
      sellerPhoneNumber: item.business?.seller?.phone || "-",
      scheduleDateTime: item.adminAvailabilityDate
        ? new Date(item.adminAvailabilityDate).toLocaleString()
        : "-",
      businessPrice: item.business?.price
        ? formatCurrency(item.business.price)
        : "-",
      meetLink: item.meetingLink || "",
    };
  });

  const total = data?.getAdminScheduledMeetings?.totalCount || 0;

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

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1); // Reset to first page on filter change
  };

  const handleDealSubmit = async () => {
    try {
      const values = await form.validateFields();
      const offerPrice = parseFloat(values.offerPrice);

      await updateMeeting({
        variables: {
          input: {
            id: selectedOffer.meetingId,
            status: "HELD",
            offerPrice: offerPrice,
          },
        },
      });

      setVisible(false);
      setSelectedOffer(null);
      fetchScheduledMeetings({
        variables: {
          limit: pageSize,
          offset: (current - 1) * pageSize,
          ...filter,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const commission = value * (commissionRate / 100);
    form.setFieldsValue({
      commission: formatCurrency(commission),
    });
  };

  useEffect(() => {
    if (selectedOffer) {
      const priceValue =
        parseFloat(String(selectedOffer.price).replace("SAR", "").trim()) || 0;

      const commission = priceValue * (commissionRate / 100);
      form.setFieldsValue({
        offerPrice: priceValue,
        commission: formatCurrency(commission),
      });
    } else {
      // Reset form when modal closes
      form.resetFields();
    }
  }, [selectedOffer, form, commissionRate]);

  return (
    <>
      {contextHolder}
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
                  allowClear
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <MySelect
                  name="status"
                  withoutForm
                  value={selectedStatus}
                  placeholder={t("Status")}
                  options={meetingItems}
                  onChange={handleStatusChange}
                  allowClear
                />
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          size="large"
          columns={schedulemeetingColumn(setVisible)}
          dataSource={schedulemeetingData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 2300 }}
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
      <Modal
        open={visible}
        title={t("Offer Details")}
        onCancel={() => {
          setVisible(false);
          setSelectedOffer(null);
          form.resetFields();
        }}
        centered
        onOk={handleDealSubmit}
        okText={t("Confirm Deal")}
        cancelText={t("Cancel")}
        okButtonProps={{
          loading: updating,
          disabled: updating,
        }}
      >
        {selectedOffer && (
          <Form form={form} layout="vertical">
            <Form.Item
              label={t("Offer Price")}
              name="offerPrice"
              rules={[{ required: true, message: t("Enter Offer Price") }]}
            >
              <Input
                type="number"
                prefix={t("SAR")}
                placeholder={t("Enter offer price")}
                onChange={handlePriceChange}
              />
            </Form.Item>

            <Form.Item label={t("Commission")} name="commission">
              <Input disabled />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <DeleteModal
        visible={deleteItem}
        onClose={() => setDeleteItem(false)}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to cancel this Meeting?",
        )}
        type="danger"
        loading={updating}
        onConfirm={async () => {
          try {
            await updateMeeting({
              variables: {
                input: {
                  id: selectedMeetingId,
                  status: "CANCELED",
                },
              },
            });
            setDeleteItem(false);
            await fetchScheduledMeetings({
              variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                ...filter,
              },
            });
            messageApi.success(t("Meeting cancelled successfully!"));
          } catch (err) {
            console.error(err);
            messageApi.error(t("Failed to cancel meeting"));
          }
        }}
      />

      <RescheduleMeeting
        visible={rescheduleVisible}
        onClose={() => {
          setRescheduleVisible(false);
          setSelectedMeetingId(null);
        }}
        meetingId={selectedMeetingId}
        updateMeeting={async (options) => {
          try {
            await updateMeeting(options);
            setRescheduleVisible(false);
            setSelectedMeetingId(null);
            await fetchScheduledMeetings({
              variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                ...filter,
              },
            });
            messageApi.success(t("Meeting rescheduled successfully!"));
          } catch (err) {
            console.error(err);
            messageApi.error(t("Failed to reschedule meeting"));
          }
        }}
        loading={updating}
      />
    </>
  );
};

export { ScheduleMeetingTable };
