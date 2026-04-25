import { Button, Col, Flex, Row, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  UPDATE_DEAL,
  UPDATE_BUSINESS,
} from "../../../graphql/mutation/mutations";
import { useMutation } from "@apollo/client";
import { GETDEAL } from "../../../graphql/query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const FinalDeal = ({ details }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [updateDeals, { loading, data, error }] = useMutation(UPDATE_DEAL, {
    refetchQueries: [
      { query: GETDEAL, variables: { getDealId: details?.key } },
    ],
  });
  const [updateBusiness] = useMutation(UPDATE_BUSINESS);

  useEffect(() => {
    if (data?.updateDeal?.id) {
      messageApi.success(t("Deal marked as completed successfully!"));
    }
  }, [data?.updateDeal?.id]);

  useEffect(() => {
    if (error) {
      messageApi.error(error.message || t("Something went wrong!"));
    }
  }, [error]);

  const handleMarkVerified = async () => {
    if (!details?.key) return;
    await updateDeals({
      variables: {
        input: {
          id: details.key,
          status: "COMPLETED",
        },
      },
    });
    await updateBusiness({
      variables: {
        input: {
          id: details?.busines?.id,
          isSold: true,
          businessStatus: t("SOLD"),
        },
      },
    });
  };

  const isCompleted = details?.isSellerCompleted && details?.isBuyerCompleted;
  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Flex vertical gap={10}>
            <Col span={24}>
              <Flex vertical gap={10}>
                <Col span={24}>
                  <Flex vertical gap={10}>
                    {details?.isSellerCompleted && details?.isBuyerCompleted ? (
                      <>
                        <Flex
                          gap={5}
                          className="badge-cs success fs-12 fit-content"
                          align="center"
                        >
                          <CheckCircleOutlined className="fs-14" />{" "}
                          {t("Buyer marked the deal as Finalized")}
                        </Flex>
                        <Flex
                          gap={5}
                          className="badge-cs success fs-12 fit-content"
                          align="center"
                        >
                          <CheckCircleOutlined className="fs-14" />{" "}
                          {t("Seller marked the deal as Finalized")}
                        </Flex>
                      </>
                    ) : (
                      <>
                        {details?.isBuyerCompleted &&
                          details?.isDocVedifiedBuyer && (
                            <>
                              <Flex
                                gap={5}
                                className="badge-cs success fs-12 fit-content"
                                align="center"
                              >
                                <CheckCircleOutlined className="fs-14" />{" "}
                                {t("Buyer marked the deal as Finalized")}
                              </Flex>
                              <Flex
                                gap={5}
                                className="badge-cs pending fs-12 fit-content"
                                align="center"
                              >
                                <CheckCircleOutlined className="fs-14" />{" "}
                                {t(
                                  "Waiting for seller to mark the deal as Finalized"
                                )}
                              </Flex>
                            </>
                          )}
                        {!details?.isBuyerCompleted &&
                          !details?.isDocVedifiedBuyer && (
                            <>
                              <Flex
                                gap={5}
                                className="badge-cs pending fs-12 fit-content"
                                align="center"
                              >
                                <CheckCircleOutlined className="fs-14" />{" "}
                                {t(
                                  "Waiting for buyer to mark the deal as Finalized"
                                )}
                              </Flex>
                              <Flex
                                gap={5}
                                className="badge-cs pending fs-12 fit-content"
                                align="center"
                              >
                                <CheckCircleOutlined className="fs-14" />{" "}
                                {
                                  "Waiting for seller to mark the deal as Finalized"
                                }
                              </Flex>
                            </>
                          )}
                      </>
                    )}
                  </Flex>
                </Col>
              </Flex>
            </Col>
            <Flex>
              <Button
                loading={loading}
                type="primary"
                className="btnsave bg-brand"
                disabled={
                  !isCompleted || loading || details?.status === "COMPLETED"
                }
                onClick={handleMarkVerified}
                aria-labelledby="Mark Deal as Completed"
              >
                {t("Mark Deal as Completed")}
              </Button>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { FinalDeal };
