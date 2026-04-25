import { Row, Col, Flex, Button } from "antd";
import {
  AddEditStaffMember,
  ModuleTopHeading,
  StaffMemberTable,
} from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const StaffMembersPage = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [edititem, setEditItem] = useState(null);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Staff Member")} />
            <Button
              aria-labelledby="Add Staff Member"
              type="primary"
              className="btnsave"
              onClick={() => setVisible(true)}
            >
              <PlusOutlined /> {t("Add Staff Member")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <StaffMemberTable {...{ setVisible, setEditItem }} />
        </Col>
      </Row>
      <AddEditStaffMember
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

export { StaffMembersPage };
