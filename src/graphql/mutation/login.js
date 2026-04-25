import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export const CREATE_STAFF_MEMBER = gql`
  mutation CreateStaff($input: UserInput!) {
    createStaff(input: $input) {
      staff {
        id
      }
    }
  }
`;

export const LOGIN = gql`
  mutation StaffLogin($password: String!, $email: String) {
    staffLogin(password: $password, email: $email) {
      token
      refreshToken
      user {
        id
        status
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      refreshToken
      user {
        id
        status
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
    }
  }
`;
export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
    }
  }
`;
export const DELETE_ROLE = gql`
  mutation DeleteRole($deleteRoleId: ID) {
    deleteRole(id: $deleteRoleId)
  }
`;
export const UPDATE_SETTING = gql`
  mutation UpdateSettings(
    $updateSettingsId: ID!
    $commissionRate: String
    $faceBook: String
    $instagram: String
    $whatsApp: String
    $x: String
  ) {
    updateSettings(
      id: $updateSettingsId
      commissionRate: $commissionRate
      faceBook: $faceBook
      instagram: $instagram
      whatsApp: $whatsApp
      x: $x
    ) {
      id
    }
  }
`;

export const CREATE_SETTINGS = gql`
  mutation CreateSettings(
    $commissionRate: String!
    $x: String
    $whatsApp: String
    $instagram: String
    $faceBook: String
  ) {
    createSettings(
      commissionRate: $commissionRate
      x: $x
      whatsApp: $whatsApp
      instagram: $instagram
      faceBook: $faceBook
    ) {
      id
    }
  }
`;
export const CHANGE_ADMIN_PASSWORD = gql`
  mutation AdminChangePassword(
    $adminChangePasswordId: ID
    $oldPassword: String
    $newPassword: String
  ) {
    adminChangePassword(
      id: $adminChangePasswordId
      oldPassword: $oldPassword
      newPassword: $newPassword
    )
  }
`;
export const ADD_ADMIN_BANK = gql`
  mutation AddAdminBank($input: BankInput!, $addAdminBankId: ID) {
    addAdminBank(input: $input, id: $addAdminBankId) {
      id
    }
  }
`;

export const UPDATEBANK = gql`
  mutation UpdateBank($updateBankId: ID!, $input: BankInput!) {
    updateBank(id: $updateBankId, input: $input) {
      id
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($markNotificationAsReadId: ID!) {
    markNotificationAsRead(id: $markNotificationAsReadId)
  }
`;
