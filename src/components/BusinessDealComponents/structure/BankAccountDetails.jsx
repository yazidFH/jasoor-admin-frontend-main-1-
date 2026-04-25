import { Flex, Typography } from "antd";
import { MaskedAccount } from "../../Ui/MaskedAccount";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { GETUSERACTIVEBANK } from "../../../graphql/query";

const { Text } = Typography;
const BankAccountDetails = ({ details }) => {
  const { data: bankData, loading } = useQuery(GETUSERACTIVEBANK, {
    variables: {
      getUserActiveBanksId: details?.busines?.seller?.id,
    },
  });
  const buyerBank = bankData?.getUserActiveBanks;
  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Flex vertical gap={10}>
        <Text className="fw-600 text-medium-gray fs-13">Bank Account</Text>
        {buyerBank ? (
          <div className="deals-status w-100 sky-lightest rounded-12">
            <Flex vertical gap={6}>
              <Text className="fs-15 fw-500 text-gray">
                {buyerBank.bankName}
              </Text>
              <Text className="fs-13 text-gray">
                Account Title: {buyerBank.accountTitle}
              </Text>
              <MaskedAccount
                iban={buyerBank.iban}
                className="fs-13 text-gray"
              />
            </Flex>
          </div>
        ) : (
          <Text className="fs-13 text-gray">No bank accounts available</Text>
        )}
      </Flex>
    </>
  );
};

export { BankAccountDetails };
