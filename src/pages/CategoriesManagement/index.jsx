import { Row, Col, Flex, Button } from "antd";
import { CategoryTable, ModuleTopHeading } from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const CategoriesManagement = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Categories Management")} />
            <Button
              aria-labelledby="Add New Category"
              type="primary"
              className="btnsave"
              onClick={() => navigate("/addnewcategory")}
            >
              <PlusOutlined /> {t("Add New Category")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <CategoryTable />
        </Col>
      </Row>
    </>
  );
};

export { CategoriesManagement };
