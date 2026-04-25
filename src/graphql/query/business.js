import { gql } from "@apollo/client";

const GET_BUSINESS_STATS = gql`
  query GetBusinessStats {
    getBusinessStats {
      totalBusinesses
      todaysMeetings
      scheduleMeetings
      requestMeetings
      completedDeals
    }
  }
`;
const IS_BUSINESS_IN_DEAL_PROCESS = gql`
  query IsBusinessInDealProcess($isBusinessInDealProcessId: ID!) {
    isBusinessInDealProcess(id: $isBusinessInDealProcessId)
  }
`;
const GET_BUSINESS_STATS_GRAPH = gql`
  query GetBusinessStatsGraph($year: Int) {
    getBusinessStatsGraph(year: $year) {
      totalBusinesses
      monthlyStats {
        businessCount
        month
      }
    }
  }
`;
const GET_BUSINESS_PRICE_TIER = gql`
  query GetBusinessByPriceTier {
    getBusinessByPriceTier {
      count
      priceTier
    }
  }
`;
const GET_BUSINESS_REVENUE_TIER = gql`
  query GetBusinessByRevenueTier {
    getBusinessByRevenueTier {
      count
      priceTier
    }
  }
`;
const GET_BUSINESS_CATEGORY_COUNT = gql`
  query GetCountByEachCategory {
    getCountByEachCategory {
      category
      count
      icon
      arabicCategory
    }
  }
`;
const GET_BUSINESSES = gql`
  query GetAdminBusinesses(
    $limit: Int
    $offSet: Int
    $filter: AdminBusinessFilterInput
    $search: String
  ) {
    getAdminBusinesses(
      limit: $limit
      offSet: $offSet
      filter: $filter
      search: $search
    ) {
      businesses {
        id
        reference
        isByTakbeer
        isSaved
        createdAt
        businessStatus
        businessTitle
        description
        revenue
        profit
        price
        isStatsVerified
        capitalRecovery
        isSold
        category {
          id
          name
          arabicName
        }
        savedBy {
          id
        }
        seller {
          name
        }
      }
      totalCount
      totalActiveCount
      totalPendingCount
    }
  }
`;
const GET_BUSINESSES_STATS_BY_ID = gql`
  query GetBusinessById($getBusinessByIdId: ID!) {
    getBusinessById(id: $getBusinessByIdId) {
      numberOfFavorites
      numberOfOffers
      totalViews
      business {
        id
        isSold
        businessTitle
        description
        price
        createdAt
        businessStatus
        revenue
        revenueTime
        capitalRecovery
        profit
        profittime
        numberOfEmployees
        profitMargen
        capitalRecovery
        multiple
        growthOpportunities
        reason
        supportSession
        supportDuration
        isSupportVerified
        isStatsVerified
        foundedDate
        district
        category {
          id
          name
          arabicName
        }
      }
    }
  }
`;
const GET_BUSINESSES_ASSETS_BY_ID = gql`
  query GetBusinessById($getBusinessByIdId: ID!) {
    getBusinessById(id: $getBusinessByIdId) {
      numberOfFavorites
      numberOfOffers
      totalViews
      business {
        id
        isSold
        assets {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
        liabilities {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
        inventoryItems {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
      }
    }
  }
`;
const GET_BUSINESSES_DOCUMENT_ID = gql`
  query GetBusinessById($getBusinessByIdId: ID!) {
    getBusinessById(id: $getBusinessByIdId) {
      numberOfFavorites
      numberOfOffers
      totalViews
      business {
        id
        isSold
        documents {
          id
          title
          fileName
          filePath
        }
      }
    }
  }
`;
const GET_CATEGORIES = gql`
  query GetAllCategories(
    $limit: Int
    $offSet: Int
    $filter: CategoryFilter
    $isAdminCategory: Boolean
  ) {
    getAllCategories(
      limit: $limit
      offSet: $offSet
      filter: $filter
      isAdminCategory: $isAdminCategory
    ) {
      totalcount
      categories {
        id
        icon
        isDigital
        name
        arabicName
        status
      }
    }
  }
`;

const GET_CATEGORIES_BY_ID = gql`
  query GetCategoryById($getCategoryByIdId: ID!) {
    getCategoryById(id: $getCategoryByIdId) {
      id
      isDigital
      name
      arabicName
      status
      icon
      growthRecords {
        id
        industryDemand
        regionName
        populationDensity
        years {
          id
          localBusinessGrowth
          year
        }
      }
    }
  }
`;
const GET_FINANCE_COUNT = gql`
  query GetFinanceCount {
    getFinanceCount {
      totalPrice
      revenueGenerated
      thisMonthRevenue
    }
  }
`;
const GET_FINANCE_GRAPH = gql`
  query GetRenenueGraph($year: Int) {
    getRenenueGraph(year: $year) {
      graphData {
        month
        revenue
      }
      totalRevenue
    }
  }
`;
const GET_COMPLETED_DEALS = gql`
  query GetCompletedDeals($limit: Int, $offset: Int, $filter: DealFilter) {
    getCompletedDeals(limit: $limit, offset: $offset, filter: $filter) {
      totalCount
      deals {
        id
        business {
          businessTitle
          reference
          seller {
            name
          }
        }
        buyer {
          name
        }
        price
        commission
        createdAt
      }
    }
  }
`;
const SIMILER_BUSINESS_CATEGORY_GRAPH = gql`
  query SimilerBusinessAvgAnualProfit($similerBusinessAvgAnualProfitId: ID) {
    similerBusinessAvgAnualProfit(id: $similerBusinessAvgAnualProfitId) {
      totalProfit
      graph {
        profit
        year
      }
    }
  }
`;

const GET_BUSINESS = gql`
  query GetBusinessById($getBusinessByIdId: ID!) {
    getBusinessById(id: $getBusinessByIdId) {
      numberOfFavorites
      numberOfOffers
      totalViews
      business {
        id
        businessTitle
        isSupportVerified
        reference
        district
        city
        description
        foundedDate
        growthOpportunities
        isByTakbeer
        isAbleInActive
        multiple
        numberOfEmployees
        price
        profit
        profitMargen
        profittime
        reason
        capitalRecovery
        revenue
        revenueTime
        supportSession
        supportDuration
        businessStatus
        url
        isStatsVerified
        category {
          id
          name
          arabicName
        }
        savedBy {
          id
        }
        seller {
          id
          name
        }
        assets {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
        liabilities {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
        inventoryItems {
          id
          isActive
          name
          price
          purchaseYear
          quantity
        }
        documents {
          id
          title
          fileName
          fileType
          filePath
          description
        }
      }
    }
  }
`;
export {
  GET_BUSINESS_STATS,
  IS_BUSINESS_IN_DEAL_PROCESS,
  GET_BUSINESS,
  GET_BUSINESS_STATS_GRAPH,
  GET_BUSINESS_PRICE_TIER,
  GET_BUSINESS_REVENUE_TIER,
  GET_BUSINESS_CATEGORY_COUNT,
  GET_BUSINESSES,
  GET_CATEGORIES,
  GET_CATEGORIES_BY_ID,
  GET_FINANCE_COUNT,
  GET_FINANCE_GRAPH,
  GET_COMPLETED_DEALS,
  GET_BUSINESSES_STATS_BY_ID,
  GET_BUSINESSES_ASSETS_BY_ID,
  GET_BUSINESSES_DOCUMENT_ID,
  SIMILER_BUSINESS_CATEGORY_GRAPH,
};
