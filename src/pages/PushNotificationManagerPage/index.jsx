import { useState } from "react";
import { Row, Col, Button, Flex, message } from "antd";
import {
  AddNotification,
  DeleteModal,
  ModuleTopHeading,
  PushNotificationTable,
} from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useMutation } from "@apollo/client";
import { DELETE_CAMPAIGN } from "../../graphql/mutation";

const PushNotificationManagerPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [visible, setVisible] = useState(false);
  const [viewnotify, setViewNotify] = useState(null);
  const [edititem, setEditItem] = useState(null);
  const [deleteitem, setDeleteItem] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [deleteCampaign, { loading }] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: ["GetCampaigns"],
    onCompleted: () => {
      messageApi.success(t("Push notification deleted successfully"));
      setDeleteItem(false);
      setRefresh((prev) => !prev);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleDelete = () => {
    if (deleteitem) {
      deleteCampaign({
        variables: {
          deleteCampaignId: deleteitem,
        },
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Push Notification Manager")} />
            <Button
              aria-labelledby="Add Notification"
              type="primary"
              className="btnsave"
              onClick={() => setVisible(true)}
            >
              <PlusOutlined /> {t("Add Notification")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <PushNotificationTable
            setVisible={setVisible}
            setViewNotify={setViewNotify}
            setEditItem={setEditItem}
            setDeleteItem={setDeleteItem}
            viewnotify={viewnotify}
            refresh={refresh}
          />
        </Col>
      </Row>
      <AddNotification
        visible={visible}
        viewnotify={viewnotify}
        edititem={edititem}
        onClose={() => {
          setVisible(false);
          setViewNotify(null);
          setEditItem(null);
          setRefresh((prev) => !prev);
        }}
      />
      <DeleteModal
        visible={!!deleteitem}
        onClose={() => setDeleteItem(false)}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to delete this notification?"
        )}
        type="danger"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
};

export { PushNotificationManagerPage };
