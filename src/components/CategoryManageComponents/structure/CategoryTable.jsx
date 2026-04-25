import {
  Button,
  Dropdown,
  Form,
  Image,
  Typography,
  Flex,
  Card,
  Row,
  Col,
  Table,
} from "antd";
import { CustomPagination, TableLoader } from "../../Ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELETE_CATEGORY, UPDATE_CATEGORY } from "../../../graphql/mutation";
import { GET_CATEGORIES } from "../../../graphql/query/business";
import { useLazyQuery, useMutation } from "@apollo/client";
import { message } from "antd";
import { NavLink } from "react-router-dom";
import { DeleteModal } from "../../../components/Ui";
import { useTranslation } from "react-i18next";
import { MySelect, SearchInput } from "../../Forms";

const { Text } = Typography;

const CategoryTable = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const categoryColumn = (setDeleteItem, navigate) => [
    {
      title: t("Category Icon"),
      dataIndex: "categoryicon",
      render: (categoryicon) => (
        <Image
          src={categoryicon}
          fetchPriority="high"
          preview={false}
          width={25}
          alt="category-icon"
        />
      ),
    },
    {
      title: t("Category Name"),
      dataIndex: "categoryname",
    },
    {
      title: t("Arabic Name"),
      dataIndex: "arabicName",
    },
    {
      title: t("Business Type"),
      dataIndex: "businesstype",
      render: (type) => t(type),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        return status === "UNDER_REVIEW" ? (
          <Text className="btnpill fs-12 pending">{t("Pending")}</Text>
        ) : status === "INACTIVE" ? (
          <Text className="btnpill fs-12 inactive">{t("Inactive")}</Text>
        ) : status === "ACTIVE" ? (
          <Text className="btnpill fs-12 success">{t("Active")}</Text>
        ) : null;
      },
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
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/addnewcategory/detail/" + row?.key);
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
                  setSelectedCategoryId(row.key);
                  setDeleteItem(true);
                }}
              >
                {t("Delete")}
              </NavLink>
            ),
            key: "2",
          },
        ];

        if (row.status === "INACTIVE") {
          items.push({
            label: (
              <NavLink
                onClick={() => {
                  updateCategory({
                    variables: {
                      input: {
                        id: row.key,
                        status: "ACTIVE",
                      },
                    },
                  });
                }}
              >
                {t("Active")}
              </NavLink>
            ),
            key: "3",
          });
        }

        if (row.status === "ACTIVE") {
          items.push({
            label: (
              <NavLink
                onClick={() => {
                  updateCategory({
                    variables: {
                      input: {
                        id: row.key,
                        status: "INACTIVE",
                      },
                    },
                  });
                }}
              >
                {t("Inactive")}
              </NavLink>
            ),
            key: "4",
          });
        }

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
  ];
  // State for filters
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchName, setSearchName] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);

  const [categories, setCategories] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);

  const statusItems = [
    { id: "ACTIVE", name: t("Active") },
    { id: "INACTIVE", name: t("Inactive") },
  ];

  const typeItems = [
    { id: false, name: t("Physical Business") },
    { id: true, name: t("Digital Business") },
  ];

  // Apollo lazy query
  const [loadCategories, { data, loading: isLoading }] = useLazyQuery(
    GET_CATEGORIES,
    {
      fetchPolicy: "network-only",
      onCompleted: (response) => {
        if (response?.getAllCategories?.categories) {
          const mappedCategories = response.getAllCategories.categories.map(
            (item) => ({
              key: item.id,
              categoryicon: item.icon,
              categoryname: item.name,
              arabicName: item.arabicName,
              businesstype: item.isDigital
                ? "Digital Business"
                : "Physical Business",
              status: item.status,
            })
          );
          setCategories(mappedCategories);
        } else {
          setCategories([]);
        }
      },
      onError: (error) => {
        console.error("Error loading categories:", error);
        messageApi.error(t("Failed to load categories"));
        setCategories([]);
      },
    }
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadCategories({
        variables: {
          limit: pageSize,
          offSet: (current - 1) * pageSize,
          isAdminCategory: true,
          filter: {
            isDigital: selectedCategory,
            name: searchName,
            status: selectedStatus,
          },
        },
      });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [
    searchName,
    selectedCategory,
    selectedStatus,
    pageSize,
    current,
    loadCategories,
  ]);

  // Pagination change
  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  // Dropdown selections - remove manual refetch, let useEffect handle it
  const handleStatusClick = ({ id }) => {
    setCurrent(1); // Reset to page 1 when filter changes
    setSelectedStatus(id === "null" ? null : id);
  };

  const handleCategoryClick = ({ id }) => {
    setCurrent(1); // Reset to page 1 when filter changes
    // Handle both null/undefined and string values
    if (
      id === "null" ||
      id === "undefined" ||
      id === null ||
      id === undefined
    ) {
      setSelectedCategory(null);
    } else {
      const isDigitalValue = id === "true" || id === true;
      setSelectedCategory(isDigitalValue);
    }
  };

  const handleSearch = (value) => {
    setCurrent(1); // Reset to page 1 when searching
    setSearchName(value || null);
  };

  const [deleteBusiness, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      messageApi.success(t("Category deleted successfully"));
      setDeleteItem(false);
      // Reload categories after delete
      loadCategories({
        variables: {
          limit: pageSize,
          offSet: (current - 1) * pageSize,
          isAdminCategory: true,
          filter: {
            isDigital: selectedCategory,
            name: searchName,
            status: selectedStatus,
          },
        },
      });
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong"));
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      messageApi.success(t("Category status changed successfully"));
      loadCategories({
        variables: {
          limit: pageSize,
          offSet: (current - 1) * pageSize,
          isAdminCategory: true,
          filter: {
            isDigital: selectedCategory,
            name: searchName,
            status: selectedStatus,
          },
        },
      });
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong"));
    },
  });

  return (
    <>
      {contextHolder}
      <Card className="radius-12 border-gray">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]} justify="left" align="middle">
              <Col lg={12} md={16} sm={24} xs={24}>
                <Row gutter={[16, 16]}>
                  <SearchInput
                    withoutForm
                    name="name"
                    placeholder={t("Search")}
                    prefix={
                      <img
                        src="/assets/icons/search.png"
                        alt="search icon"
                        width={14}
                        fetchPriority="high"
                      />
                    }
                    allowClear
                    className="border-light-gray pad-x ps-0 radius-8 fs-13"
                    value={searchName || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                  />

                  <Col span={6}>
                    <Flex gap={5}>
                      <MySelect
                        withoutForm
                        name="category"
                        placeholder={t("Business Type")}
                        options={typeItems}
                        value={selectedCategory}
                        onChange={(value) => {
                          if (value === undefined || value === null) {
                            setSelectedCategory(null);
                            setCurrent(1);
                          } else {
                            handleCategoryClick({ id: String(value) });
                          }
                        }}
                        showKey
                        allowClear
                      />
                      <MySelect
                        withoutForm
                        name="status"
                        placeholder={t("Status")}
                        options={statusItems}
                        value={selectedStatus}
                        onChange={(value) => {
                          if (value === undefined || value === null) {
                            setSelectedStatus(null);
                            setCurrent(1);
                          } else {
                            handleStatusClick({ id: String(value) });
                          }
                        }}
                        showKey
                        allowClear
                      />
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          <Table
            size="large"
            columns={categoryColumn(setDeleteItem, navigate)}
            dataSource={categories}
            className="pagination table-cs table"
            showSorterTooltip={false}
            scroll={{ x: 1000 }}
            rowHoverable={false}
            pagination={false}
            loading={{
              ...TableLoader,
              spinning: isLoading || deleting || updating,
            }}
          />
          <CustomPagination
            total={data?.getAllCategories?.totalcount}
            current={current}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Flex>
      </Card>
      <DeleteModal
        visible={deleteItem}
        onClose={() => setDeleteItem(false)}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to delete this Category?"
        )}
        type="danger"
        onConfirm={() => {
          if (selectedCategoryId) {
            deleteBusiness({
              variables: { deleteCategoryId: selectedCategoryId },
            });
          }
        }}
      />
    </>
  );
};

export { CategoryTable };
