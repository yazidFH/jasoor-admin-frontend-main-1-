import { useState, useEffect } from "react";
import { Badge, Button, Image } from "antd";
import NotificationsDrawer from "./NotificationsDrawer";
import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATION_COUNT,
} from "../../../graphql/query";
import { NEW_NOTIFICATION_SUBSCRIPTION } from "../../../graphql/subscription";
import { useQuery, useSubscription } from "@apollo/client";
import { getUserId } from "../../../shared/tokenManager";

export const Notifications = () => {
  const userId = getUserId();

  // Count API
  const { data: countData, refetch: refetchCount } = useQuery(
    GET_NOTIFICATION_COUNT,
    {
      fetchPolicy: "network-only",
    }
  );

  const [visible, setVisible] = useState(false);

  // Subscribe to new notifications
  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNotif = subscriptionData.data?.newNotification;
      if (newNotif) {
        // Increment unread count when new notification arrives
        setLocalCount((prev) => prev + 1);
      }
    },
  });

  useEffect(() => {
    if (visible) {
      refetchCount();
    }
  }, [visible]);

  return (
    <>
      <div>
        <Badge
          count={countData?.getNotificationCount}
          overflowCount={99}
          className=""
        >
          <Button
            aria-labelledby="notification button"
            shape="circle"
            size="large"
            className="bg-transparent border-0 p-0"
            onClick={() => setVisible(true)}
          >
            <Image
              src="/assets/icons/notify.webp"
              width={"20px"}
              preview={false}
              alt="notification-icon"
              className="up"
              fetchPriority="high"
            />
          </Button>
        </Badge>
      </div>
      <NotificationsDrawer
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
};
