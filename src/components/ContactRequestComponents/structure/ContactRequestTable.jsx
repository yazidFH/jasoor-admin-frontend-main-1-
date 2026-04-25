import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { useState, useEffect } from "react";
import { CustomPagination } from "../../Ui";
import { GET_ALL_CONTACT_US } from "../../../graphql/query/user";
import { useLazyQuery } from "@apollo/client";
import { TableLoader } from "../../Ui/TableLoader";
import { t } from "i18next";
import { NavLink } from "react-router-dom";

const { Text } = Typography;

const ContactRequestTable = ({ setVisible, setSendView, setViewItem }) => {
  const [form] = Form.useForm();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);

  const [fetchContacts, { data, loading }] = useLazyQuery(GET_ALL_CONTACT_US, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    fetchContacts({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchValue || null,
        status: selectedStatus,
      },
    });
  }, [pageSize, current, selectedStatus, searchValue, fetchContacts]);

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1);
  };

  const total = data?.getAllContactUs?.totalCount || 0;
  const contactreqData = (data?.getAllContactUs?.contactUs || []).map(
    (item) => ({
      key: item.id,
      name: item.name,
      email: item.email,
      msgPreview: item.message,
      answer: item.answer || "No answer yet",
      date: new Date(item?.createdAt).toLocaleDateString(),
      status: item.isResponded ? 1 : 0,
    })
  );

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const statusItems = [
    { id: true, name: t("Send") },
    { id: false, name: t("Pending") },
  ];

  return (
    <>
      <Card className="radius-12 border-gray">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xl={18} lg={16} md={24} sm={24} xs={24}>
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
                  <MySelect
                    withoutForm
                    name="status"
                    placeholder={t("Status")}
                    options={statusItems}
                    onChange={handleStatusChange}
                    allowClear
                    showKey
                  />
                </Flex>
              </Col>
            </Row>
          </Form>
          <Table
            size="large"
            columns={[
              {
                title: t("Full Name"),
                dataIndex: "name",
              },
              {
                title: t("Email"),
                dataIndex: "email",
              },
              {
                title: t("Massage Preview"),
                dataIndex: "msgPreview",
                render: (msgPreview) => {
                  const words = msgPreview?.split(" ") || [];
                  const previewText = words.slice(0, 5).join(" ");
                  const showEllipsis = words.length > 5;
                  return (
                    <Tooltip title={msgPreview}>
                      <Text>
                        {previewText}
                        {showEllipsis ? "..." : ""}
                      </Text>
                    </Tooltip>
                  );
                },
              },
              {
                title: t("Date"),
                dataIndex: "date",
              },
              {
                title: t("Reply Status"),
                dataIndex: "status",
                render: (status) =>
                  status === 1 ? (
                    <Text className="btnpill fs-12 success">Sent</Text>
                  ) : (
                    <Text className="btnpill fs-12 inactive">Pending</Text>
                  ),
              },
              {
                title: t("Action"),
                key: "action",
                fixed: "right",
                width: 100,
                render: (_, row) => {
                  const items = [
                    {
                      label: (
                        <NavLink
                          onClick={() => {
                            setVisible(true);
                            setSendView(row.status !== 1);
                            setViewItem(row);
                          }}
                        >
                          {t("View")}
                        </NavLink>
                      ),
                      key: "1",
                    },
                  ];

                  return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <Button
                        aria-labelledby="action dropdown"
                        className="bg-transparent border0 p-0"
                      >
                        <img
                          src="/assets/icons/dots.png"
                          alt="dots icon"
                          width={16}
                          fetchPriority="high"
                        />
                      </Button>
                    </Dropdown>
                  );
                },
              },
            ]}
            dataSource={contactreqData}
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

export { ContactRequestTable };
