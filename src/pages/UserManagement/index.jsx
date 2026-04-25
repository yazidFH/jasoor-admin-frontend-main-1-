import { useState } from "react";
import { Row, Col, Flex, Button } from "antd";
import {
  AddUser,
  ModuleTopHeading,
  UserManagementTable,
} from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";

const UserManagement = () => {
  const [visible, setVisible] = useState(false);
  const [edititem, setEditItem] = useState(null);
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("User Management")} />
            <Button
              aria-labelledby="Add New User"
              type="primary"
              className="btnsave"
              onClick={() => setVisible(true)}
            >
              <PlusOutlined /> {t("Add New User")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <UserManagementTable {...{ setVisible, setEditItem }} />
        </Col>
      </Row>
      <AddUser
        visible={visible}
        edititem={edititem}
        onClose={() => {
          setVisible(false);
          setEditItem(null);
        }}
      />
    </>
  );
};

export { UserManagement };
