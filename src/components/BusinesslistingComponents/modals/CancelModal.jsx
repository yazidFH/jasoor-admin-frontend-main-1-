import { Button, Divider, Flex, Modal, Typography } from "antd";
import { t } from "i18next";

const { Title, Text } = Typography;
const CancelModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      closeIcon={false}
      centered
      footer={
        <Flex justify="center" gap={5}>
          <Button
            aria-labelledby="Cancel"
            type="button"
            className="btncancel text-black border-gray"
            onClick={onClose}
          >
            {t("Cancel")}
          </Button>
          <Button
            aria-labelledby="Confirm"
            type="primary"
            className="btnsave border0 text-white brand-bg"
            onClick={onConfirm}
          >
            {t("Confirm")}
          </Button>
        </Flex>
      }
    >
      <Flex vertical align="center" gap={6}>
        <img
          src="/assets/icons/cancel-ic.png"
          width={50}
          alt="cancel icon"
          fetchPriority="high"
        />
        <Title level={4} className="mb-0 mt-2">
          {t("Cancel Listing?")}
        </Title>
        <Text>
          {t(
            "Your current progress will be lost if you cancel. Do you still want to proceed?"
          )}
        </Text>
      </Flex>
      <Divider className="my-2 bg-light-brand" />
    </Modal>
  );
};

export { CancelModal };
