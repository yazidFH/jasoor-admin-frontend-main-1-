import { gql } from "@apollo/client";

const OFFERBYBUYER = gql`
  query GetOffersByUser($status: OfferStatus, $search: String) {
    getOffersByUser(status: $status, search: $search) {
      id
      price
      createdAt
      business {
        businessTitle
        price
        seller {
          name
        }
      }
    }
  }
`;
const OFFERBYSELLER = gql`
  query GetOffersBySeller($status: OfferStatus, $search: String) {
    getOffersBySeller(status: $status, search: $search) {
      id
      price
      createdAt
      business {
        businessTitle
        price
        seller {
          name
        }
      }
    }
  }
`;
const OFFERBYID = gql`
  query GetOffersById($getOffersByIdId: String) {
    getOffersById(id: $getOffersByIdId) {
      id
      price
      message
      status
      createdAt
      business {
        businessTitle
        seller {
          name
          banks {
            id
            bankName
            accountNumber
            createdAt
            accountTitle
          }
        }
      }
      buyer {
        name
      }
    }
  }
`;
const OFFERBYBUSINESSID = gql`
  query GetOfferByBusinessId(
    $getOfferByBusinessIdId: ID
    $limit: Int
    $offSet: Int
    $search: String
    $status: OfferStatus
  ) {
    getOfferByBusinessId(
      id: $getOfferByBusinessIdId
      limit: $limit
      offSet: $offSet
      search: $search
      status: $status
    ) {
      count
      offers {
        id
        buyer {
          id
          name
        }
        business {
          id
          price
        }
        price
        status
        isProceedToPay
        createdAt
      }
    }
  }
`;
const BUYERINPROGRESSDEALS = gql`
  query GetBuyerInprogressDeals($limit: Int, $offset: Int, $search: String) {
    getBuyerInprogressDeals(limit: $limit, offset: $offset, search: $search) {
      id
      buyer {
        id
        name
      }
      business {
        id
        businessTitle
        seller {
          id
          name
        }
      }
      price
      createdAt
    }
  }
`;
const SELLERINPROGRESSDEALS = gql`
  query GetSellerInprogressDeals($limit: Int, $offset: Int, $search: String) {
    getSellerInprogressDeals(limit: $limit, offset: $offset, search: $search) {
      id
      buyer {
        id
        name
      }
      business {
        id
        businessTitle
      }
      price
      createdAt
    }
  }
`;
const BUYERDEALS = gql`
  query GetBuyerCompletedDeals($limit: Int, $offset: Int, $search: String) {
    getBuyerCompletedDeals(limit: $limit, offset: $offset, search: $search) {
      id
      buyer {
        id
        name
      }
      business {
        id
        businessTitle
        seller {
          id
          name
        }
      }
      price
      createdAt
    }
  }
`;
const SELLERDEALS = gql`
  query GetSellerCompletedDeals($limit: Int, $offset: Int, $search: String) {
    getSellerCompletedDeals(limit: $limit, offset: $offset, search: $search) {
      id
      buyer {
        id
        name
      }
      business {
        id
        businessTitle
      }
      price
      createdAt
    }
  }
`;
const GETDEAL = gql`
  query GetDeal($getDealId: ID!) {
    getDeal(id: $getDealId) {
      id
      price
      status
      isDsaSeller
      isDsaBuyer
      isPaymentVedifiedSeller
      isDocVedifiedSeller
      isDocVedifiedAdmin
      isCommissionVerified
      isPaymentVedifiedAdmin
      isDocVedifiedBuyer
      isSellerCompleted
      isBuyerCompleted
      isCommissionUploaded
      createdAt
      ndaPdfPath
      arabicNdaPdfPath
      business {
        id
        businessTitle
        isSold
        seller {
          id
          name
        }
        documents {
          title
          filePath
        }
      }
      buyer {
        id
        name
      }
      offer {
        id
        price
        status
      }
    }
  }
`;
export {
  OFFERBYBUYER,
  OFFERBYSELLER,
  OFFERBYID,
  BUYERDEALS,
  SELLERDEALS,
  BUYERINPROGRESSDEALS,
  SELLERINPROGRESSDEALS,
  GETDEAL,
  OFFERBYBUSINESSID,
};
