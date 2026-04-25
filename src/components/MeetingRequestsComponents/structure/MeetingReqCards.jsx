import { Card, Row, Col, Flex, Typography } from "antd";
import { GETMEETINGSCOUNT } from "../../../graphql/query/meeting";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

const { Title, Text } = Typography;
const MeetingReqCards = () => {
  const { data: meetingsCount } = useQuery(GETMEETINGSCOUNT, {
    fetchPolicy: "network-only",
  });
  const data = [
    {
      id: 1,
      icon: "/assets/icons/todaymeet.png",
      title: meetingsCount?.getAdminMeetingCounts?.todayMeetings,
      subtitle: t("Today’s Meeting"),
    },
    {
      id: 2,
      icon: "/assets/icons/schedulemeeting.png",
      title: meetingsCount?.getAdminMeetingCounts?.totalScheduleMeetings,
      subtitle: t("Total Schedule Meetings"),
    },
    {
      id: 3,
      icon: "/assets/icons/pendingmeeting.png",
      title: meetingsCount?.getAdminMeetingCounts?.totalPendingMeetings,
      subtitle: t("Total Pending Meetings Request"),
    },
  ];

  return (
    <Row gutter={[14, 24]} className="h-100">
      {data?.map((data, index) => (
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
          key={index}
        >
          <Card className={`shadow-d radius-12 h-100 border-gray`}>
            <Flex gap={8} vertical>
              <div>
                <img
                  src={data?.icon}
                  width={45}
                  alt="icon"
                  fetchPriority="high"
                />
              </div>
              <Text className="fs-14 text-gray">{data?.subtitle}</Text>
              <Title level={4} className="fw-600 text-black m-0">
                {data?.title}
              </Title>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { MeetingReqCards };
