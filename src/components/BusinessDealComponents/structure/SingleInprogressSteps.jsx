import { useState } from "react";
import { Flex, Typography, Steps, Collapse, Form } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { DigitalSaleAgreement } from "./DigitalSaleAgreement";
import { DocumentPaymentConfirmation } from "./DocumentPaymentConfirmation";
import { FinalDeal } from "./FinalDeal";
import { CommissionReceiptBuyer } from "./CommissionReceiptBuyer";
import { BusinessAmountReceiptBuyer } from "./BusinessAmountReceiptBuyer";
import { useTranslation } from "react-i18next";

// Calculate current step based on boolean flags instead of status string
const calculateCurrentStep = (details) => {
  if (!details) return 0;

  // Step 5: Finalize Deal - Both buyer and seller completed (or buyer completed waiting for seller)
  if (
    details.isBuyerCompleted ||
    (details.isSellerCompleted && details.isBuyerCompleted)
  ) {
    return 4; // Index 4 = Step 5
  }

  // Step 4: Document Confirmation - Payment verified by seller
  if (details.isPaymentVedifiedSeller) {
    return 3; // Index 3 = Step 4
  }

  // Step 3: Pay Business Amount - Both DSA signed
  if (details.isDsaSeller && details.isDsaBuyer) {
    return 2; // Index 2 = Step 3
  }

  // Step 2: Digital Sale Agreement - Commission verified
  if (details.isCommissionVerified) {
    return 1; // Index 1 = Step 2
  }

  // Step 1: Commission Receipt - Waiting for commission upload or verification
  return 0; // Default: Step 0 (Commission Receipt)
};

// Check if a step should be enabled/unlocked based on boolean flags
const isStepEnabled = (stepIndex, details) => {
  if (!details) return stepIndex === 0; // Only first step enabled if no details

  // Check if deal is cancelled
  if (details.status === "CANCEL") return false;

  switch (stepIndex) {
    case 0: // Commission Receipt - Always accessible
      return true;

    case 1: // Digital Sale Agreement - Enabled after commission verified
      return details.isCommissionVerified;

    case 2: // Pay Business Amount - Enabled after both DSAs signed
      return details.isDsaSeller && details.isDsaBuyer;

    case 3: // Document Confirmation - Enabled after payment verified by seller
      return details.isPaymentVedifiedSeller;

    case 4: // Finalize Deal - Enabled after seller verifies payment/documents
      return details.isSellerCompleted && details.isBuyerCompleted;

    default:
      return false;
  }
};

const { Title, Text } = Typography;

const SingleInprogressSteps = ({ details }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const initialStep = calculateCurrentStep(details);
  const [activeStep, setActiveStep] = useState(initialStep);

  const allSteps = [
    {
      key: "1",
      label: t("Commission Receipt"),
      content: <CommissionReceiptBuyer details={details} />,
      enabled: isStepEnabled(0, details),
      status: details?.isCommissionVerified
        ? t("Verified")
        : details?.isCommissionUploaded
        ? t("Commission Verification Pending")
        : t("Commission Pending"),
      emptytitle: t("Commission Pending!"),
      emptydesc: t("Waiting for the buyer to pay the platform commission."),
    },
    {
      key: "2",
      label: t("Digital Sale Agreement"),
      content: <DigitalSaleAgreement form={form} details={details} />,
      enabled: isStepEnabled(1, details),
      status:
        details?.isDsaSeller && details?.isDsaBuyer
          ? t("Verified")
          : !details?.isDsaSeller && !details?.isDsaBuyer
          ? t("Seller & Buyer DSA Pending")
          : !details?.isDsaSeller
          ? t("Seller DSA Pending")
          : t("Buyer DSA Pending"),
      emptytitle: t("DSA Pending!"),
      emptydesc: t(
        "Waiting for the seller & buyer to sign the digital sale agreement."
      ),
    },
    {
      key: "3",
      label: t("Pay Business Amount"),
      content: <BusinessAmountReceiptBuyer details={details} />,
      enabled: isStepEnabled(2, details),
      status: details?.isPaymentVedifiedSeller
        ? t("Verified")
        : t("Payment Verification Pending"),
      emptytitle: t("Business Amount Pending!"),
      emptydesc: t("Waiting for the buyer to pay the seller business amount."),
    },
    {
      key: "4",
      label: t("Document Confirmation"),
      content: <DocumentPaymentConfirmation details={details} />,
      enabled: isStepEnabled(3, details),
      status: details?.isDocVedifiedBuyer
        ? t("Verified")
        : details?.isPaymentVedifiedSeller
        ? t("Document Verification Pending")
        : t("Seller verification pending"),
      emptytitle: t("Payment Confirmation Pending!"),
      emptydesc: t(
        "Waiting for the seller to transfer the document & approve the payment."
      ),
    },
    {
      key: "5",
      label: t("Finalize Deal"),
      content: <FinalDeal details={details} />,
      enabled: isStepEnabled(4, details),
      status:
        details?.isBuyerCompleted &&
        details?.isSellerCompleted &&
        details?.status === "COMPLETED"
          ? t("Completed")
          : details?.isBuyerCompleted && details?.isSellerCompleted
          ? t("Waiting for Jusoor to complete the deal")
          : t("Finalizing Deal"),
      emptytitle: t("Deal Pending!"),
      emptydesc: t("Waiting for the buyer & seller to finalized the deal."),
    },
  ];

  const [openPanels, setOpenPanels] = useState(
    details ? allSteps.slice(0, initialStep + 1).map((step) => step.key) : ["1"]
  );

  const getStepItems = (steps) =>
    steps.map((item) => ({
      key: item.key,
      label: (
        <Flex
          justify="space-between"
          align="center"
          style={!item.enabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <span
            className={`custom-step-title fw-600 fs-15 ${
              !item.enabled ? "disabled" : ""
            }`}
            style={!item.enabled ? { color: "#999" } : {}}
          >
            {item.label}
          </span>
          <span className="collapse-indicator">
            {openPanels.includes(item.key) ? (
              <Flex align="center" gap={5}>
                {item.status.toLowerCase() === "verified" ||
                item.status.toLowerCase() === "completed" ? (
                  <Text className="success fs-10 sm-pill fw-500 fit-content">
                    {item?.status}
                  </Text>
                ) : (
                  <Text
                    className="pending fs-10 sm-pill fw-500 fit-content"
                    style={
                      !item.enabled
                        ? { backgroundColor: "#e0e0e0", color: "#999" }
                        : {}
                    }
                  >
                    {item?.status}
                  </Text>
                )}
                <UpOutlined style={!item.enabled ? { color: "#999" } : {}} />
              </Flex>
            ) : (
              <DownOutlined style={!item.enabled ? { color: "#999" } : {}} />
            )}
          </span>
        </Flex>
      ),
      disabled: !item.enabled, // Disable expansion for locked steps
      children:
        item?.content === null || item?.content === "" ? (
          <>
            <Flex
              className="text-center"
              vertical
              justify="center"
              align="center"
            >
              <Title level={5} className="fw-500 m-0 fs-14">
                {item?.emptytitle}
              </Title>
              <Text className="fs-14 text-gray">{item?.emptydesc}</Text>
            </Flex>
            {item?.key === "2" && (
              <Flex vertical gap={5} className="mt-2">
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for seller to sign the sales agreement")}
                </Flex>
                <Flex
                  gap={5}
                  className="badge-cs pending fs-12 fit-content"
                  align="center"
                >
                  <CheckCircleOutlined className="fs-14" />{" "}
                  {t("Waiting for buyer to sign the sales agreement")}
                </Flex>
              </Flex>
            )}
          </>
        ) : (
          <div className="step-content">{item.content}</div>
        ),
      showArrow: false,
      extra: null,
    }));

  const stepsProgress = allSteps.map((item, index) => ({
    key: item.label,
    title: (
      <span
        className={`custom-step-title ${
          activeStep >= index ? "completed" : ""
        } ${!item.enabled ? "disabled" : ""}`}
      >
        {item.label}
      </span>
    ),
    disabled: !item.enabled, // Disable clicking on locked steps
  }));

  return (
    <Flex vertical gap={25} className="mt-3">
      <Steps
        className="mt-3 responsive-steps"
        current={activeStep}
        items={stepsProgress}
        responsive={true}
        progressDot={(dot, { index }) => {
          const isDisabled = !allSteps[index]?.enabled;
          return (
            <span
              className={`custom-dot ${activeStep > index ? "completed" : ""} ${
                activeStep === index ? "active" : ""
              } ${isDisabled ? "disabled" : ""}`}
              style={
                isDisabled
                  ? {
                      opacity: 0.4,
                      filter: "grayscale(100%)",
                      color: "#999",
                    }
                  : {}
              }
            >
              {activeStep > index ? <CheckOutlined /> : dot}
            </span>
          );
        }}
        onChange={(current) => {
          // Only allow navigation to enabled steps
          if (allSteps[current]?.enabled) {
            setActiveStep(current);
            setOpenPanels([allSteps[current].key]);
          }
        }}
      />
      <Form form={form} layout="vertical">
        <Collapse
          activeKey={openPanels}
          onChange={(keys) => handleCollapseChange(keys, allSteps)}
          items={getStepItems(allSteps)}
          className="collapse-cs1"
          expandIconPosition="end"
          ghost
        />
      </Form>
    </Flex>
  );

  // Modified to accept specific step list
  function handleCollapseChange(keys, stepsList) {
    // Filter out disabled steps from the keys
    const enabledKeys = keys.filter((key) => {
      const step = stepsList.find((s) => s.key === key);
      return step?.enabled;
    });

    setOpenPanels(enabledKeys);
    if (enabledKeys.length > 0) {
      const lastKey = enabledKeys[enabledKeys.length - 1];
      const stepIndex = stepsList.findIndex((step) => step.key === lastKey);
      if (stepIndex !== -1 && stepsList[stepIndex]?.enabled) {
        setActiveStep(stepIndex);
      }
    }
  }
};

export { SingleInprogressSteps };
