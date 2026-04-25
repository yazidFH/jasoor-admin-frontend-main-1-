import { Card, Col, Flex, Image, Row, Switch, Typography } from "antd";
import { TableContent } from "./TableContent";
import { UPDATE_BUSINESS } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { GET_BUSINESSES_STATS_BY_ID } from "../../../graphql/query";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { usePostSaleColumn } from "../../../data";

const { Title, Text } = Typography;
const BusinessStatsTab = ({ status }) => {
  const postsaleColumn = usePostSaleColumn();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const capitalRecoveryText =
    status?.capitalRecovery > 12
      ? `${Math.floor(status.capitalRecovery / 12)} ${t("Year(s)")}`
      : `${status?.capitalRecovery} ${t("Month(s)")}`;

  const businessstatsData = [
    {
      id: 1,
      icon: "/assets/icons/rev.png",
      title: status?.revenue,
      subtitle: t("Revenue {{count}} Months", { count: status?.revenueTime }),
    },
    {
      id: 2,
      icon: "/assets/icons/pro.png",
      title: status?.profit,
      subtitle: t("Profit {{count}} Months", { count: status?.profittime }),
    },
    {
      id: 3,
      icon: "/assets/icons/teamsize.png",
      title: status?.numberOfEmployees,
      subtitle: t("Team Size"),
    },
    {
      id: 4,
      icon: "/assets/icons/promar.png",
      title: status?.profitMargen,
      subtitle: t("Profit Margin %"),
    },
    {
      id: 5,
      icon: "/assets/icons/cap-re.png",
      title: capitalRecoveryText,
      subtitle: t("Capital Recovery"),
    },
    {
      id: 6,
      icon: "/assets/icons/multiple.png",
      title: status?.multiple,
      subtitle: t("Multiples"),
    },
  ];
  const postsaleData = [
    {
      key: 1,
      supportperiod: status?.supportSession,
      nosession: status?.supportDuration,
    },
  ];
  const [updateBusiness] = useMutation(UPDATE_BUSINESS, {
    refetchQueries: [
      {
        query: GET_BUSINESSES_STATS_BY_ID,
        variables: { getBusinessByIdId: status?.id }, // make sure you pass the current business id
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Stats changed successfully!"));
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong!"));
    },
  });

  return (
    <>
      {contextHolder}
      <Flex vertical gap={15}>
        <Card className="radius-12 border-gray w-100">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Flex justify="space-between" align="center" gap={5}>
                <Title level={5} className="m-0">
                  {t("Business Stats")}
                </Title>
                <Switch
                  size="small"
                  checked={status?.isStatsVerified}
                  onChange={(checked) => {
                    updateBusiness({
                      variables: {
                        input: {
                          id: status?.id,
                          isStatsVerified: checked,
                        },
                      },
                    });
                  }}
                />
              </Flex>
            </Col>
            {businessstatsData?.map((stat, i) => (
              <Col
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={{ span: 12 }}
                xs={{ span: 24 }}
                key={i}
              >
                <Flex gap={10}>
                  <div className="icon-pre">
                    <Image
                      src={stat?.icon}
                      fetchPriority="high"
                      preview={false}
                      width={"100%"}
                      alt={t("stats-icon")}
                    />
                  </div>
                  <Flex vertical gap={2}>
                    <Flex gap={4}>
                      <Title level={5} className="m-0">
                        {stat?.title}
                      </Title>
                    </Flex>
                    <Text className="text-gray fs-13 fw-500">
                      {stat?.subtitle}
                    </Text>
                  </Flex>
                </Flex>
              </Col>
            ))}
          </Row>
        </Card>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={10}>
            <Title level={5} className="m-0">
              {t("Growth Opportunity")}
            </Title>
            <Text className="text-gray">{status?.growthOpportunities}</Text>
          </Flex>
        </Card>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={10}>
            <Title level={5} className="m-0">
              {t("Reason for Selling")}
            </Title>
            <Text className="text-gray">{status?.reason}</Text>
          </Flex>
        </Card>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={10}>
            <Flex justify="space-between" align="center" gap={5}>
              <Title level={5} className="m-0">
                {t("Post - Sale Support")}
              </Title>
              <Switch
                size="small"
                checked={status?.isSupportVerified}
                onChange={(checked) => {
                  updateBusiness({
                    variables: {
                      input: {
                        id: status?.id,
                        isSupportVerified: checked,
                      },
                    },
                  });
                }}
              />
            </Flex>
            <TableContent data={postsaleData} columns={postsaleColumn} />
          </Flex>
        </Card>
      </Flex>
    </>
  );
};

export { BusinessStatsTab };
