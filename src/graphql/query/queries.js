import { gql } from "@apollo/client";

const GETARTICLES = gql`
  query GetArticles(
    $search: String
    $isArabic: Boolean
    $limit: Int
    $offset: Int
  ) {
    getArticles(
      search: $search
      isArabic: $isArabic
      limit: $limit
      offset: $offset
    ) {
      totalCount
      articles {
        id
        title
        arabicTitle
        image
        arabicBody
        body
        createdAt
        isArabic
      }
    }
  }
`;
const GETARTICLE = gql`
  query GetArticle($getArticleId: ID!) {
    getArticle(id: $getArticleId) {
      id
      title
      arabicTitle
      image
      body
      arabicBody
      createdAt
      isArabic
    }
  }
`;
const GETFAQ = gql`
  query GetFAQs(
    $search: String
    $isArabic: Boolean
    $limit: Int
    $offset: Int
  ) {
    getFAQs(
      search: $search
      isArabic: $isArabic
      limit: $limit
      offset: $offset
    ) {
      totalCount
      faqs {
        id
        question
        arabicQuestion
        answer
        arabicAnswer
        isArabic
      }
    }
  }
`;
const GETTERMSOFUSE = gql`
  query GetTerms {
    getTerms {
      id
      term
      arabicTerm
      isArabic
    }
  }
`;
const GETENDATERMS = gql`
  query GetNDATerms {
    getNDATerms {
      id
      ndaTerm
      arabicNdaTerm
      isArabic
    }
  }
`;
const GETDSATERMS = gql`
  query GetDSATerms {
    getDSATerms {
      id
      dsaTerms
      arabicDsaTerms
      isArabic
    }
  }
`;
const GETPRIVACYPOLICY = gql`
  query GetPrivacyPolicy {
    getPrivacyPolicy {
      id
      policy
      arabicPolicy
      isArabic
    }
  }
`;
export {
  GETARTICLES,
  GETARTICLE,
  GETFAQ,
  GETTERMSOFUSE,
  GETENDATERMS,
  GETDSATERMS,
  GETPRIVACYPOLICY,
};
