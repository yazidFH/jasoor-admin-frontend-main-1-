import { gql } from "@apollo/client";

const GETMEETINGSCOUNT = gql`
  query GetAdminMeetingCounts {
    getAdminMeetingCounts {
      todayMeetings
      totalPendingMeetings
      totalScheduleMeetings
    }
  }
`;
const GETADMINPENDINGMEETINGS = gql`
  query GetAdminPendingMeetings(
    $search: String
    $status: MeetingFilterType
    $limit: Int
    $offset: Int
  ) {
    getAdminPendingMeetings(
      search: $search
      status: $status
      limit: $limit
      offset: $offset
    ) {
      totalCount
      items {
        id
        business {
          businessTitle
          price
          seller {
            id
            name
            email
            phone
          }
        }
        requestedTo {
          name
          email
          phone
          id
        }
        requestedBy {
          name
          email
          phone
          id
        }
        requestedDate
        requestedEndDate
        receiverAvailabilityDate
        offer {
          price
        }
        status
      }
    }
  }
`;

const GETADMINSCHEDULEMEETINGS = gql`
  query GetAdminScheduledMeetings(
    $search: String
    $status: MeetingFilterType
    $limit: Int
    $offset: Int
  ) {
    getAdminScheduledMeetings(
      search: $search
      status: $status
      limit: $limit
      offset: $offset
    ) {
      totalCount
      items {
        id
        meetingLink
        business {
          id
          businessTitle
          price
          seller {
            id
            name
            email
            phone
          }
        }
        adminAvailabilityDate
        requestedTo {
          id
          name
          email
          phone
        }
        requestedBy {
          name
          email
          phone
          id
        }
        requestedDate
        offer {
          id
          price
          commission
        }
        status
      }
    }
  }
`;
const GETDEALS = gql`
  query GetDeals(
    $dealType: DealType
    $status: String
    $search: String
    $offset: Int
    $limit: Int
  ) {
    getDeals(
      dealType: $dealType
      status: $status
      search: $search
      offset: $offset
      limit: $limit
    ) {
      totalCount
      deals {
        id
        business {
          businessTitle
          seller {
            name
          }
        }
        isBuyerCompleted
        isCommissionUploaded
        isCommissionVerified
        isDocVedifiedBuyer
        isDsaBuyer
        isDsaSeller
        isPaymentVedifiedSeller
        isSellerCompleted
        buyer {
          name
        }
        createdAt
        status
        offer {
          price
        }
      }
    }
  }
`;

const GETADMINCANCELMEETINGS = gql`
  query GetAdminCancelMeetings($offset: Int, $limit: Int, $search: String) {
    getAdminCancelMeetings(offset: $offset, limit: $limit, search: $search) {
      totalCount
      items {
        id
        business {
          businessTitle
          price
          seller {
            id
            name
            email
            phone
          }
        }
        requestedTo {
          name
          email
          phone
          id
        }
        requestedBy {
          name
          email
          phone
          id
        }
        requestedDate
        requestedEndDate
        receiverAvailabilityDate
        offer {
          price
        }
        status
      }
    }
  }
`;

export {
  GETMEETINGSCOUNT,
  GETADMINSCHEDULEMEETINGS,
  GETADMINPENDINGMEETINGS,
  GETDEALS,
  GETADMINCANCELMEETINGS,
};
