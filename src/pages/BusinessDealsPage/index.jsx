import { Row, Col, Tabs, Card } from "antd";
import { DealsTable, ModuleTopHeading } from "../../components";
import { t } from "i18next";

const BusinessDealsPage = ({ setCompleteDeal }) => {
  const tabs = [
    {
      key: "1",
      label: t("In-progress Deals"),
      children: <DealsTable dealType="inprogress" />,
    },
    {
      key: "2",
      label: t("Completed Deals"),
      children: (
        <DealsTable dealType="completed" onRowClick={setCompleteDeal} />
      ),
    },
    {
      key: "3",
      label: t("Cancelled Deals"),
      children: <DealsTable dealType="canceled" />,
    },
  ];
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ModuleTopHeading level={4} name={t("Business Deals")} />
        </Col>
        <Col span={24}>
          <Card className="radius-12 border-gray">
            <Tabs className="tabs-fill" defaultActiveKey="1" items={tabs} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { BusinessDealsPage };
