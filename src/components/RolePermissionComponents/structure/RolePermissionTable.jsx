import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  message,
  Row,
  Table,
  Typography,
} from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomPagination, DeleteModal } from "../../Ui";
import { GETROLES } from "../../../graphql/query/user";
import { UPDATE_ROLE, DELETE_ROLE } from "../../../graphql/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { TableLoader } from "../../Ui/TableLoader";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const RolePermissionTable = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedRoleId, setRoleId] = useState(null);

  const [fetchRoles, { loading, data }] = useLazyQuery(GETROLES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    fetchRoles({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchText || null,
        isActive: selectedStatus,
      },
    });
  }, [pageSize, current, searchText, selectedStatus, fetchRoles]);

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

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1);
  };

  const rolepermissionColumn = (setDeleteItem, navigate) => [
    {
      title: t("Role Name"),
      dataIndex: "name",
    },
    {
      title: t("Status"),
      dataIndex: "isActive",
      render: (isActive) =>
        isActive ? (
          <Text className="btnpill fs-12 success">{t("Active")}</Text>
        ) : (
          <Text className="btnpill fs-12 inactive">{t("Inactive")}</Text>
        ),
    },
    {
      title: t("Action"),
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => {
        if (row.rolename === "Customer") return null;
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/addrolepermission/" + row.id);
                      }}
                    >
                      {t("Edit")}
                    </NavLink>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <NavLink
                      onClick={() => {
                        setDeleteItem(true);
                        setRoleId(row.id);
                      }}
                    >
                      {t("Delete")}
                    </NavLink>
                  ),
                  key: "2",
                },
                {
                  label: (
                    <NavLink
                      onClick={async (e) => {
                        e.preventDefault();
                        await updateRole({
                          variables: {
                            input: {
                              id: row.id,
                              isActive: !row.isActive,
                            },
                          },
                        });
                      }}
                    >
                      {row.isActive ? t("Inactive") : t("Activate")}
                    </NavLink>
                  ),
                  key: "3",
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              aria-labelledby="action dropdown"
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
        );
      },
    },
  ];

  const statusItems = [
    { id: true, name: t("Active") },
    { id: false, name: t("Inactive") },
  ];

  const total = data?.getRoles?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const [deleteRole, { loading: onDeleteing }] = useMutation(DELETE_ROLE, {
    refetchQueries: [GETROLES],
    onCompleted: () => {
      messageApi.success(t("Role deleted successfully!"));
    },
    onError: (err) => {
      messageApi.error(t(err.message) || t("Something went wrong!"));
    },
  });

  const [updateRole] = useMutation(UPDATE_ROLE, {
    refetchQueries: [GETROLES],
    onCompleted: () => {
      messageApi.success(t("Status changed successfully!"));
    },
    onError: (err) => {
      messageApi.error(t(err.message) || t("Something went wrong!"));
    },
  });

  return (
    <>
      {contextHolder}
      <Card className="radius-12 border-gray">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
              <Col lg={24} md={12} sm={24} xs={24}>
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
                    value={selectedStatus}
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
            columns={rolepermissionColumn(setDeleteItem, navigate)}
            dataSource={data?.getRoles?.roles || []}
            className="pagination table-cs table"
            showSorterTooltip={false}
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
      <DeleteModal
        visible={deleteItem}
        onClose={() => setDeleteItem(false)}
        loading={onDeleteing}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to delete this Role?"
        )}
        type="danger"
        onConfirm={() => {
          if (selectedRoleId) {
            deleteRole({
              variables: { deleteRoleId: selectedRoleId },
            });
            setDeleteItem(false);
          }
        }}
      />
    </>
  );
};

export { RolePermissionTable };
