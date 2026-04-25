import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Row,
  Space,
  Typography,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import { MyInput } from "../../Forms";
import { permissionsData } from "../../../data";
import { CREATE_ROLE, UPDATE_ROLE } from "../../../graphql/mutation/login";
import { GETROLE } from "../../../graphql/query";
import { useMutation, useQuery } from "@apollo/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const AddRolePermission = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const { id } = useParams();

  const { data } = useQuery(GETROLE, {
    variables: { getRoleId: id },
    skip: !id,
  });
  const detail = data?.getRole;

  const backendToFrontendMap = {
    viewDashboard: ["Dashboard", "View Dashboard"],
    viewListings: ["Business Listing", "View Listings"],
    editListings: ["Business Listing", "Edit Listings"],
    approveRejectListings: ["Business Listing", "Approve/Reject Listings"],

    viewMeetingRequests: ["Meeting Request", "View Meeting Requests"],
    scheduleMeetings: ["Meeting Request", "Schedule Meetings"],
    editMeetingDetails: ["Meeting Request", "Edit Meeting Details"],
    cancelMeetings: ["Meeting Request", "Cancel Meetings"],

    viewDeals: ["Deals", "View Deals"],
    trackDealProgress: ["Deals", "Track Deal Progress"],
    verifyDocuments: ["Deals", "Verify Documents"],
    finalizeDeal: ["Deals", "Finalize Deal"],

    viewFinanceDashboard: ["Finance", "View Finance Dashboard"],
    downloadFinancialReports: ["Finance", "Download Financial Reports"],

    viewWebsitePages: ["Website Pages", "View Website Pages"],
    editArticle: ["Website Pages", "Edit Article"],
    deleteArticle: ["Website Pages", "Delete Article"],
    publishArticle: ["Website Pages", "Publish Article"],

    viewAlerts: ["Alerts", "View Alerts"],

    manageRoles: ["Admin Setting", "Add/Edit/Delete Roles"],
  };

  const buildPermissionsFromBackend = () => {
    const permissions = {};
    Object.keys(backendToFrontendMap).forEach((backendKey) => {
      const [category, option] = backendToFrontendMap[backendKey];
      permissions[backendKey] = !!selectedPermissions[category]?.[option];
    });
    return permissions;
  };

  useEffect(() => {
    if (id && detail) {
      form.setFieldsValue({ name: detail?.name });

      const mappedPermissions = {};
      Object.keys(backendToFrontendMap).forEach((key) => {
        const [category, option] = backendToFrontendMap[key];
        if (!mappedPermissions[category]) mappedPermissions[category] = {};
        mappedPermissions[category][option] = !!detail[key]; // <-- use detail[key]
      });

      setSelectedPermissions(mappedPermissions);
    } else {
      form.resetFields();
      setSelectedPermissions({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, detail]);

  const handleCategoryChange = (category, checked) => {
    setSelectedPermissions((prev) => {
      const newCategory = {};
      permissionsData
        .find((g) => g.category === category)
        .options.forEach((opt) => {
          newCategory[opt] = checked;
        });
      return {
        ...prev,
        [category]: newCategory,
      };
    });
  };

  const handleOptionChange = (category, option, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: checked,
      },
    }));
  };

  const isCategoryChecked = (category) => {
    const options = permissionsData.find(
      (g) => g.category === category
    ).options;
    return options.every((opt) => selectedPermissions[category]?.[opt]);
  };

  const [updateRole, { loading: updating }] = useMutation(UPDATE_ROLE, {
    refetchQueries: ["GetRoles"],
    onCompleted: () => {
      messageApi.success(t("Role updated successfully!"));
      setTimeout(() => {
        navigate("/rolepermission");
      }, 1000);
    },
    onError: (err) => {
      messageApi.error(t(err.message) || t("Something went wrong!"));
    },
  });

  const [createRole, { loading: creating }] = useMutation(CREATE_ROLE, {
    refetchQueries: ["GetRoles"],
    onCompleted: () => {
      messageApi.success(t("Role created successfully!"));
      setTimeout(() => {
        navigate("/rolepermission");
      }, 1000);
    },
    onError: (err) => {
      messageApi.error(t(err.message) || t("Something went wrong!"));
    },
  });

  const onFinish = (values) => {
    // Validate at least one permission is selected
    const permissions = buildPermissionsFromBackend();
    const hasAtLeastOnePermission = Object.values(permissions).some(
      (value) => value === true
    );

    if (!hasAtLeastOnePermission) {
      messageApi.error(t("Please select at least one permission"));
      return;
    }

    const input = {
      ...(id && { id }),
      name: values.name,
      ...permissions,
    };
    if (id) {
      updateRole({
        variables: {
          input,
        },
      });
    } else {
      createRole({ variables: { input } });
    }
  };

  return (
    <>
      {contextHolder}
      <Flex vertical gap={25}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <Text
                  className="cursor fs-13 text-gray"
                  onClick={() => navigate("/rolepermission")}
                >
                  {t("Role & Permissions")}
                </Text>
              ),
            },
            {
              title: (
                <Text className="fw-500 fs-14 text-black">
                  {detail?.name ? detail?.name : t("Add Roles")}
                </Text>
              ),
            },
          ]}
        />

        <Flex gap={10} justify="space-between" align="center">
          <Flex gap={10} align="center">
            <Button
              className="border0 p-0 bg-transparent"
              onClick={() => navigate("/rolepermission")}
              aria-labelledby="Arrow left"
            >
              {isArabic ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            </Button>
            <Title level={4} className="fw-500 m-0">
              {detail?.name
                ? detail?.name
                : id
                ? t("Edit Role")
                : t("Add New Role")}
            </Title>
          </Flex>
          <Flex gap={10}>
            <Button
              aria-labelledby="Cancel"
              className="btncancel"
              onClick={() => navigate("/rolepermission")}
            >
              {t("Cancel")}
            </Button>
            <Button
              className="btnsave brand-bg border0 text-white"
              onClick={() => form.submit()}
              loading={creating || updating}
              aria-labelledby="submit button"
            >
              {id ? t("Update") : t("Save")}
            </Button>
          </Flex>
        </Flex>
        <Card>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={[24, 14]}>
              <Col span={24}>
                <Title level={5} className="m-0">
                  {t("Role Details")}
                </Title>
              </Col>
              <Col span={24}>
                <MyInput
                  label={t("Role Name")}
                  size="large"
                  name="name"
                  className="w-100 fs-14"
                  placeholder={t("Enter Role Name")}
                  rules={[
                    { required: true, message: t("Please enter role name") },
                  ]}
                />
              </Col>
              <Col span={24}>
                <Text strong>{t("Permissions")}</Text>
              </Col>
              <Col span={24}>
                <Form.Item name="permissions">
                  <Flex vertical gap={20}>
                    {permissionsData.map((permission, index) => (
                      <Flex vertical gap={10} key={index}>
                        <Flex align="center" gap={8}>
                          <Checkbox
                            checked={isCategoryChecked(permission.category)}
                            onChange={(e) =>
                              handleCategoryChange(
                                permission.category,
                                e.target.checked
                              )
                            }
                          />
                          <Text>{t(permission.category)}</Text>
                        </Flex>
                        <Space direction="vertical" className="px-3">
                          {permission.options.map((option) => (
                            <Flex align="center" gap={8} key={option}>
                              <Checkbox
                                checked={
                                  !!selectedPermissions[permission.category]?.[
                                    option
                                  ]
                                }
                                onChange={(e) =>
                                  handleOptionChange(
                                    permission.category,
                                    option,
                                    e.target.checked
                                  )
                                }
                              />
                              <Text>{t(option)}</Text>
                            </Flex>
                          ))}
                        </Space>
                      </Flex>
                    ))}
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export { AddRolePermission };
