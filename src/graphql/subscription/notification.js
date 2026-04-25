import { useSubscription, gql } from "@apollo/client";

const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNewNotification {
    newNotification {
      id
      name
      message
      createdAt
      isRead
      user {
        id
        name
      }
    }
  }
`;

export {
    NEW_NOTIFICATION_SUBSCRIPTION
}