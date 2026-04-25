import { Tabs } from "antd";
import { BusinessStatsTab } from "./BusinessStatsTab";
import { AssetsTab } from "./AssetsTab";
import { DocumentTab } from "./DocumentTab";
import { OfferTable } from "./OfferTable";

import { useTranslation } from "react-i18next";

const PendingUnverifiedTabs = ({ data }) => {
  const businessId = data?.id;
  const { t } = useTranslation();
  const baseTabs = [
    {
      key: "1",
      label: t("Business Stats"),
      children: <BusinessStatsTab status={data} />,
    },
    {
      key: "2",
      label: t("Assets"),
      children: <AssetsTab businessId={businessId} />,
    },
    {
      key: "3",
      label: t("Documents"),
      children: <DocumentTab businessId={businessId} />,
    },
    {
      key: "4",
      label: t("Offers"),
      children: <OfferTable businessId={businessId} />,
    },
  ];

  return (
    <div>
      <Tabs className="tabs-fill" defaultActiveKey="1" items={baseTabs} />
    </div>
  );
};

export { PendingUnverifiedTabs };
