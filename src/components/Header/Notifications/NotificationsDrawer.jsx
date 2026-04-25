import { useEffect } from "react";
import { Drawer, Avatar, List, Typography } from "antd";
import { MARK_AS_READ } from "../../../graphql/mutation";
import { GET_NOTIFICATIONS } from "../../../graphql/query";
import { useMutation, useQuery } from "@apollo/client";
import { t } from "i18next";
import { getUserId } from "../../../shared/tokenManager";

const { Text } = Typography;
const NotificationsDrawer = ({ visible, onClose }) => {
  const userId = getUserId();
  const { data } = useQuery(GET_NOTIFICATIONS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const [markAsRead] = useMutation(MARK_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS, variables: { userId } }],
  });

  useEffect(() => {
    if (visible && userId) {
      markAsRead({ variables: { markNotificationAsReadId: userId } });
    }
  }, [visible, userId, markAsRead]);

  // Mark all notifications as read
  // const handleClearAll = () => {
  //   if (data?.getNotifications?.count) {
  //     data.getNotifications?.notifications.forEach((notif) =>
  //       markAsRead({ variables: { markNotificationAsReadId: notif.id } })
  //     );
  //   }
  // };

  return (
    <Drawer
      title={t("Notifications")}
      onClose={onClose}
      open={visible}
      destroyOnClose
      width={500}
      // footer={
      //     <Button
      //         block
      //         className="btnsave py-2"
      //         type="primary"
      //         onClick={handleClearAll}
      //         aria-labelledby='Clear all'
      //     >
      //         {t("Clear All")}
      //     </Button>
      // }
    >
      <List
        itemLayout="horizontal"
        dataSource={data?.getNotifications?.notifications || []}
        renderItem={(item) => (
          <List.Item
            actions={
              [
                // <Button
                //   type="text"
                //   icon={<DeleteOutlined />}
                //   onClick={() => handleMarkAsRead(item.id)}
                //   aria-labelledby='Delete button'
                // />,
              ]
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={"/assets/images/av-1.png"} />}
              title={<Text strong>{t(item.name)}</Text>}
              description={
                <div
                  className="fs-14 text-gray"
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};
export default NotificationsDrawer;
