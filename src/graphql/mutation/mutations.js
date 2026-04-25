import { gql } from "@apollo/client";

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      language
    }
  }
`;
const CREATE_OFFER = gql`
  mutation CreateOffer($input: CreateOfferInput!) {
    createOffer(input: $input) {
      id
    }
  }
`;
const UPDATE_OFFER = gql`
  mutation UpdateOfferStatus($input: UpdateOfferStatusInput!) {
    updateOfferStatus(input: $input) {
      id
    }
  }
`;
const CREATE_BUSINESS = gql`
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
    }
  }
`;
const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      id
    }
  }
`;
const DELETE_CATEGORY = gql`
  mutation DeleteCategory($deleteCategoryId: ID!) {
    deleteCategory(id: $deleteCategoryId)
  }
`;
const UPDATE_ASSET = gql`
  mutation UpdateAsset($input: UpdateInput!) {
    updateAsset(input: $input) {
      id
    }
  }
`;
const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($input: UpdateInput!) {
    updateInventory(input: $input) {
      id
    }
  }
`;
const UPDATE_LIABILITY = gql`
  mutation UpdateLiability($input: UpdateInput!) {
    updateLiability(input: $input) {
      id
    }
  }
`;
const CREATE_SAVE_BUSINESS = gql`
  mutation SaveBusiness($saveBusinessId: ID!) {
    saveBusiness(id: $saveBusinessId)
  }
`;
const CREATE_VIEW_BUSINESS = gql`
  mutation ViewBusiness($viewBusinessId: ID!) {
    viewBusiness(id: $viewBusinessId)
  }
`;
const ACCEPT_ENDA = gql`
  mutation AcceptEnda($input: AcceptEndaInput!) {
    acceptEnda(input: $input) {
      id
    }
  }
`;
const BUSINESS_MEETING = gql`
  mutation RequestMeeting($input: CreateMeetingInput!) {
    requestMeeting(input: $input) {
      id
    }
  }
`;
const UPDATE_BUSINESS_MEETING = gql`
  mutation UpdateMeeting($input: UpdateMeetingInput!) {
    updateMeeting(input: $input) {
      id
    }
  }
`;
const UPDATE_MEETING = gql`
  mutation UpdateMeeting($input: UpdateMeetingInput!) {
    updateMeeting(input: $input) {
      id
    }
  }
`;
const APPROVE_MEETING = gql`
  mutation ApproveMeeting($meetingId: ID!, $offerId: ID) {
    approveMeeting(meetingId: $meetingId, offerId: $offerId)
  }
`;
const UPLOAD_DOC = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
    }
  }
`;
// C9: FINALIZE_DEAL removed — was a duplicate of UPDATE_DEAL (same GQL operation)
const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`;
const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
    }
  }
`;
const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign(
    $title: String!
    $group: CampaignGroup!
    $schedule: DateTime!
    $description: String
    $district: [String]!
  ) {
    createCampaign(
      title: $title
      group: $group
      schedule: $schedule
      description: $description
      district: $district
    ) {
      id
    }
  }
`;

const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign(
    $updateCampaignId: ID!
    $district: [String]!
    $title: String
    $group: CampaignGroup
    $schedule: DateTime
    $description: String
    $status: Boolean
  ) {
    updateCampaign(
      id: $updateCampaignId
      district: $district
      title: $title
      group: $group
      schedule: $schedule
      description: $description
      status: $status
    ) {
      id
    }
  }
`;

const UPDATE_CONTACT_US = gql`
  mutation UpdateContactUs(
    $updateContactUsId: ID!
    $status: Boolean
    $answer: String
  ) {
    updateContactUs(id: $updateContactUsId, status: $status, answer: $answer) {
      id
    }
  }
`;
const UPDATE_DEAL = gql`
  mutation UpdateDeal($input: UpdateDealInput!) {
    updateDeal(input: $input) {
      id
      status
    }
  }
`;
const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument($input: UpdateDocumentInput!) {
    uploadDocument(input: $input) {
      id
    }
  }
`;
const SEND_BANK = gql`
  mutation SendBankToBuyer($sendBankToBuyerId: ID) {
    sendBankToBuyer(id: $sendBankToBuyerId) {
      iban
    }
  }
`;
const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: CreateArticle) {
    createArticle(input: $input) {
      id
    }
  }
`;
const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($updateArticleId: ID!, $input: CreateArticle) {
    updateArticle(id: $updateArticleId, input: $input) {
      id
    }
  }
`;
const DELETE_ARTICLE = gql`
  mutation DeleteArticle($deleteArticleId: ID!) {
    deleteArticle(id: $deleteArticleId)
  }
`;
const CREATE_FAQ = gql`
  mutation CreateFAQ($input: CreateFAQ) {
    createFAQ(input: $input) {
      id
    }
  }
`;
const UPDATE_FAQ = gql`
  mutation UpdateFAQ($updateFaqId: ID!, $input: CreateFAQ) {
    updateFAQ(id: $updateFaqId, input: $input) {
      id
    }
  }
`;
const DELETE_FAQ = gql`
  mutation DeleteFAQ($deleteFaqId: ID!) {
    deleteFAQ(id: $deleteFaqId)
  }
`;
const CREATE_TERMS = gql`
  mutation CreateTerms($input: TermsInput) {
    createTerms(input: $input) {
      id
    }
  }
`;
const UPDATE_TERMS = gql`
  mutation UpdateTerms($updateTermsId: ID!, $input: TermsInput) {
    updateTerms(id: $updateTermsId, input: $input) {
      id
    }
  }
`;
const DELETE_TERMS = gql`
  mutation DeleteTerms($deleteTermsId: ID!) {
    deleteTerms(id: $deleteTermsId)
  }
`;
const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId)
  }
`;

const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($deleteCampaignId: ID!) {
    deleteCampaign(id: $deleteCampaignId)
  }
`;

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

const VERIFY_PASSWORD_RESET_OTP = gql`
  mutation VerifyPasswordResetOTP($email: String!, $otp: String!) {
    verifyPasswordResetOTP(email: $email, otp: $otp) {
      success
      message
      resetToken
    }
  }
`;

const RESET_PASSWORD_WITH_TOKEN = gql`
  mutation ResetPasswordWithToken($resetToken: String!, $newPassword: String!) {
    resetPasswordWithToken(resetToken: $resetToken, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export {
  CREATE_OFFER,
  UPDATE_OFFER,
  CREATE_BUSINESS,
  CREATE_SAVE_BUSINESS,
  CREATE_VIEW_BUSINESS,
  ACCEPT_ENDA,
  BUSINESS_MEETING,
  UPDATE_MEETING,
  APPROVE_MEETING,
  UPLOAD_DOC,
  CREATE_CATEGORY,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  UPDATE_BUSINESS,
  UPDATE_ASSET,
  UPDATE_INVENTORY,
  UPDATE_LIABILITY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_USER,
  UPDATE_BUSINESS_MEETING,
  UPDATE_CONTACT_US,
  UPDATE_DEAL,
  UPLOAD_DOCUMENT,
  SEND_BANK,
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
  CREATE_FAQ,
  CREATE_TERMS,
  UPDATE_FAQ,
  UPDATE_TERMS,
  DELETE_ARTICLE,
  DELETE_FAQ,
  DELETE_TERMS,
  DELETE_USER,
  DELETE_CAMPAIGN,
  REQUEST_PASSWORD_RESET,
  VERIFY_PASSWORD_RESET_OTP,
  RESET_PASSWORD_WITH_TOKEN,
};
