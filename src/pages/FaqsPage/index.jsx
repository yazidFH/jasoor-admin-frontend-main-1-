import { useState, useRef } from "react";
import { Row, Col, Flex, Button } from "antd";
import { AddEditFaqs, FaqsTable, ModuleTopHeading } from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";

const FaqsPage = () => {
  const [visible, setVisible] = useState(false);
  const [edititem, setEditItem] = useState(null);
  const refetchFaqsRef = useRef(null);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("FAQs")} />
            <Button
              aria-labelledby="Add a Question"
              type="primary"
              className="btnsave"
              onClick={() => setVisible(true)}
            >
              <PlusOutlined /> {t("Add A Question")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <FaqsTable
            {...{ setVisible, setEditItem }}
            onRefetch={(fn) => {
              refetchFaqsRef.current = fn;
            }}
          />
        </Col>
      </Row>
      <AddEditFaqs
        visible={visible}
        edititem={edititem}
        onClose={() => {
          setVisible(false);
          setEditItem(null);
        }}
        refetchFaqs={() => refetchFaqsRef.current?.()}
      />
    </>
  );
};

export { FaqsPage };
