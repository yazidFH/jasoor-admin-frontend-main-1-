import { Card, Col, Flex, Form, Row, Table } from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { pushnotifyColumn } from "../../../data";
import { useState, useEffect } from "react";
import { pushstatusItem, useDistrictItem, useGroupItem } from "../../../shared";
import { CustomPagination } from "../../Ui";
import { GET_CAMPAIGNS } from "../../../graphql/query";
import { TableLoader } from "../../Ui/TableLoader";
import { useLazyQuery } from "@apollo/client";
import { t } from "i18next";

const PushNotificationTable = ({
  setVisible,
  setViewNotify,
  setEditItem,
  setDeleteItem,
}) => {
  const districtselectItem = useDistrictItem();
  const groupselectItem = useGroupItem();
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [fetchCampaigns, { data, loading }] = useLazyQuery(GET_CAMPAIGNS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    fetchCampaigns({
      variables: {
        filter: {
          search: searchValue || null,
          district: selectedDistrict || null,
          group: selectedCategory?.toUpperCase() || null,
          status: selectedStatus,
          limit: pageSize,
          offset: (current - 1) * pageSize,
        },
      },
    });
  }, [
    searchValue,
    selectedDistrict,
    selectedCategory,
    selectedStatus,
    pageSize,
    current,
    fetchCampaigns,
  ]);

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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrent(1);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setCurrent(1);
  };

  const pushnotifyData =
    data?.getCampaigns?.campaigns?.map((campaign, index) => ({
      id: campaign.id,
      key: index + 1,
      title: campaign.title,
      description: campaign.description,
      group:
        campaign.group === "NEW"
          ? t("New")
          : campaign.group === "OLD"
          ? t("Old")
          : t("Both"),
      district: campaign.district?.map((d) => ({ item: d })) || [],
      date: new Date(campaign.schedule || Date.now()).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      schedule: campaign.schedule, // Keep original schedule for editing
      status: campaign.status ? 1 : 0,
    })) || [];

  const total = data?.getCampaigns?.totalCount;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <Card className="radius-12 border-gray">
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
                  allowClear
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <MySelect
                  withoutForm
                  name="category"
                  placeholder={t("Group")}
                  options={groupselectItem}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                />
                <MySelect
                  withoutForm
                  name="district"
                  placeholder={t("Region")}
                  options={districtselectItem}
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  allowClear
                />
                <MySelect
                  withoutForm
                  name="status"
                  placeholder={t("Status")}
                  options={pushstatusItem}
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
          columns={pushnotifyColumn({
            setVisible,
            setViewNotify,
            setEditItem,
            setDeleteItem,
          })}
          dataSource={pushnotifyData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 1300 }}
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
  );
};

export { PushNotificationTable };
