import { gql } from "@apollo/client";

const ME = gql`
  query GetUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      id
      name
      email
      phone
      city
      district
      documents {
        fileName
        filePath
      }
      banks {
        accountTitle
        bankName
        iban
        cardNumber
        cardType
        isActive
      }
      role {
        id
        name
      }
    }
  }
`;

const GETCUSTOMERROLE = gql`
  query GetCustomerRole {
    getCustomerRole {
      id
      name
    }
  }
`;

const USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $filter: UserFilterInput) {
    getUsers(limit: $limit, offset: $offset, filter: $filter) {
      totalCount
      users {
        id
        name
        email
        phone
        district
        city
        status
        type
        documents {
          fileName
          filePath
          id
          title
        }
      }
    }
  }
`;
const CUSTOMER = gql`
  query GetCustomers {
    getCustomers {
      id
      name
      email
    }
  }
`;
const NOTIFICATION = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId) {
      id
      isRead
      name
      message
      user {
        id
        name
      }
    }
  }
`;
const PROFESSIONALSTATISTICS = gql`
  query GetProfileStatistics {
    getProfileStatistics {
      finalizedDealsCount
      listedBusinessesCount
      pendingMeetingsCount
      receivedOffersCount
      scheduledMeetingsCount
      viewedBusinessesCount
    }
  }
`;
const GETBUYERSTATISTICS = gql`
  query GetBuyerStatistics {
    getBuyerStatistics {
      finalizedDealsCount
      scheduledMeetingsCount
      favouriteBusinessesCount
    }
  }
`;
const GETSELLERBUSINESS = gql`
  query GetAllSellerBusinesses($limit: Int, $offSet: Int) {
    getAllSellerBusinesses(limit: $limit, offSet: $offSet) {
      businesses {
        id
        category {
          name
        }
        offerCount
        status
        isByTakbeer
        businessTitle
        description
        revenue
        profit
        price
        capitalRecovery
        savedBy {
          id
        }
      }
      totalCount
    }
  }
`;
const GETBUYERBUSINESS = gql`
  query GetAllBuyerBusinesses($limit: Int, $offSet: Int) {
    getAllBuyerBusinesses(limit: $limit, offSet: $offSet) {
      businesses {
        id
        category {
          name
        }
        businessTitle
        description
        revenue
        profit
        price
        capitalRecovery
        savedBy {
          id
        }
      }
      totalCount
    }
  }
`;
const GETSELLERSOLDBUSINESS = gql`
  query GetAllSellerSoldBusinesses($limit: Int, $offSet: Int) {
    getAllSellerSoldBusinesses(limit: $limit, offSet: $offSet) {
      businesses {
        id
        category {
          name
        }
        status
        isByTakbeer
        businessTitle
        description
        revenue
        profit
        price
        capitalRecovery
        savedBy {
          id
        }
      }
      totalCount
    }
  }
`;

const GETBUYERBOUGHTBUSINESS = gql`
  query GetAllBuyerBoughtBusinesses($limit: Int, $offSet: Int) {
    getAllBuyerBoughtBusinesses(limit: $limit, offSet: $offSet) {
      businesses {
        id
        category {
          name
        }
        businessTitle
        description
        revenue
        profit
        price
        capitalRecovery
        savedBy {
          id
        }
      }
      totalCount
    }
  }
`;
const GETFAVORITBUSINESS = gql`
  query GetFavoritBusiness {
    getFavoritBusiness {
      id
      category {
        name
      }
      offerCount
      status
      isByTakbeer
      businessTitle
      description
      revenue
      profit
      price
      capitalRecovery
      savedBy {
        id
      }
    }
  }
`;

const GETADMINBANK = gql`
  query GetAdminBanks {
    getAdminBanks {
      id
      accountTitle
      bankName
      iban
      isActive
      accountNumber
      createdAt
    }
  }
`;

const GETADMINACTIVEBANK = gql`
  query GetActiveAdminBank {
    getActiveAdminBank {
      id
      accountTitle
      bankName
      accountNumber
      createdAt
      accountTitle
      iban
    }
  }
`;
const GETROLES = gql`
  query GetRoles(
    $limit: Int
    $offset: Int
    $search: String
    $isActive: Boolean
  ) {
    getRoles(
      limit: $limit
      offset: $offset
      search: $search
      isActive: $isActive
    ) {
      totalCount
      roles {
        id
        name
        isActive
        viewDashboard
        viewListings
        editListings
        approveRejectListings
        viewMeetingRequests
        scheduleMeetings
        editMeetingDetails
        cancelMeetings
        viewDeals
        trackDealProgress
        verifyDocuments
        finalizeDeal
        viewFinanceDashboard
        downloadFinancialReports
        viewWebsitePages
        editArticle
        deleteArticle
        publishArticle
        viewAlerts
        manageRoles
      }
    }
  }
`;
const GETROLE = gql`
  query GetRole($getRoleId: ID) {
    getRole(id: $getRoleId) {
      id
      name
      isActive
      viewDashboard
      viewListings
      editListings
      approveRejectListings
      viewMeetingRequests
      scheduleMeetings
      editMeetingDetails
      cancelMeetings
      viewDeals
      trackDealProgress
      verifyDocuments
      finalizeDeal
      viewFinanceDashboard
      downloadFinancialReports
      viewWebsitePages
      editArticle
      deleteArticle
      publishArticle
      viewAlerts
      manageRoles
    }
  }
`;
const GETSTAFFMEMBERS = gql`
  query GetStaffMembers(
    $limit: Int
    $offset: Int
    $search: String
    $roleId: ID
    $status: UserStatus
  ) {
    getStaffMembers(
      limit: $limit
      offset: $offset
      search: $search
      roleId: $roleId
      status: $status
    ) {
      totalCount
      users {
        id
        name
        email
        phone
        role {
          id
          name
        }
        status
      }
    }
  }
`;
const GET_ALL_CONTACT_US = gql`
  query GetAllContactUs(
    $limit: Int
    $offset: Int
    $search: String
    $status: Boolean
  ) {
    getAllContactUs(
      limit: $limit
      offset: $offset
      search: $search
      status: $status
    ) {
      totalCount
      contactUs {
        id
        name
        email
        message
        answer
        createdAt
        isResponded
      }
    }
  }
`;
const GET_SETTINGS = gql`
  query GetSetting {
    getSetting {
      id
      commissionRate
      faceBook
      instagram
      whatsApp
      x
    }
  }
`;
const GET_CAMPAIGNS = gql`
  query GetCampaigns($filter: CampaignFilter) {
    getCampaigns(filter: $filter) {
      totalCount
      campaigns {
        id
        title
        district
        group
        description
        status
        schedule
      }
    }
  }
`;
const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId) {
      count
      notifications {
        id
        createdAt
        isRead
        name
        message
        user {
          id
          name
        }
      }
    }
  }
`;
const GET_NOTIFICATION_COUNT = gql`
  query Query {
    getNotificationCount
  }
`;
const GET_ALERTS = gql`
  query Notifications($userId: ID, $offset: Int, $limit: Int) {
    getAlerts(userId: $userId, offset: $offset, limit: $limit) {
      count
      groups {
        notifications {
          id
          isRead
          message
          name
          createdAt
        }
        time
      }
    }
  }
`;
const GETUSERBANK = gql`
  query GetUserBanks($getUserBankId: ID) {
    getUserBanks(id: $getUserBankId) {
      id
      accountTitle
      bankName
      iban
      accountNumber
      createdAt
      isActive
    }
  }
`;
const GETUSERACTIVEBANK = gql`
  query GetUserActiveBanks($getUserActiveBanksId: ID) {
    getUserActiveBanks(id: $getUserActiveBanksId) {
      id
      iban
      bankName
      accountTitle
      accountNumber
    }
  }
`;

export {
  ME,
  GETCUSTOMERROLE,
  NOTIFICATION,
  PROFESSIONALSTATISTICS,
  GETBUYERSTATISTICS,
  GETSELLERBUSINESS,
  GETBUYERBUSINESS,
  GETSELLERSOLDBUSINESS,
  GETBUYERBOUGHTBUSINESS,
  GETFAVORITBUSINESS,
  GETADMINBANK,
  GETADMINACTIVEBANK,
  GETUSERBANK,
  USERS,
  GETROLES,
  GETROLE,
  GETSTAFFMEMBERS,
  GET_ALL_CONTACT_US,
  GET_SETTINGS,
  GET_CAMPAIGNS,
  GET_NOTIFICATIONS,
  GET_NOTIFICATION_COUNT,
  GET_ALERTS,
  GETUSERACTIVEBANK,
  CUSTOMER,
};
