import { Flex, Typography } from "antd";
import { FinanceAreaChart, FinanceCard, FinanceTable } from "../../components";
import { t } from "i18next";

const { Title } = Typography;
const FinancePage = () => {
  return (
    <div>
      <Flex vertical gap={24}>
        <Flex vertical gap={2}>
          <Title level={4} className="m-0">
            {t("Finance")}
          </Title>
        </Flex>
        <FinanceCard />
        <FinanceAreaChart />
        <FinanceTable />
      </Flex>
    </div>
  );
};

export { FinancePage };
