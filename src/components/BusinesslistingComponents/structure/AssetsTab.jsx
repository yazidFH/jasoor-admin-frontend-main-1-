import { Card, Flex, Typography, Switch } from "antd";
import { TableContent } from "./TableContent";
import {
  UPDATE_ASSET,
  UPDATE_INVENTORY,
  UPDATE_LIABILITY,
} from "../../../graphql/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BUSINESSES_ASSETS_BY_ID } from "../../../graphql/query";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const AssetsTab = ({ businessId }) => {
  const { t } = useTranslation();

  const outstandliabColumn = [
    {
      title: t("Liabilities name"),
      dataIndex: "liabilitiesname",
    },
    {
      title: t("Number of Items"),
      dataIndex: "noitems",
    },
    {
      title: t("Purchase Year"),
      dataIndex: "purchaseyear",
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (_, row) => {
        const price = row?.price;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Verify"),
      dataIndex: "verify",
      render: (_, row) => {
        return (
          <Switch
            checked={row.verify === 1 || row.verify === true}
            size="small"
            onChange={(checked) => {
              updateBusinessLibility({
                variables: {
                  input: {
                    id: row.key,
                    isActive: checked,
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  const keyassetColumn = [
    {
      title: t("Asset Name"),
      dataIndex: "assetname",
    },
    {
      title: t("Number of Items"),
      dataIndex: "noitems",
    },
    {
      title: t("Purchase Year"),
      dataIndex: "purchaseyear",
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (_, row) => {
        const price = row?.price;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Verify"),
      dataIndex: "verify",
      render: (_, row) => {
        return (
          <Switch
            checked={row.verify === 1 || row.verify === true} // handle boolean or 1
            size="small"
            onChange={(checked) => {
              updateBusinessAssets({
                variables: {
                  input: {
                    id: row.key,
                    isActive: checked,
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  const inventoryColumn = [
    {
      title: t("Inventory Name"),
      dataIndex: "inventoryname",
    },
    {
      title: t("Number of Items"),
      dataIndex: "noitems",
    },
    {
      title: t("Purchase Year"),
      dataIndex: "purchaseyear",
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (_, row) => {
        const price = row?.price;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Verify"),
      dataIndex: "verify",
      render: (_, row) => {
        return (
          <Switch
            checked={row.verify === 1 || row.verify === true} // handle boolean or 1
            size="small"
            onChange={(checked) => {
              updateBusinessInventory({
                variables: {
                  input: {
                    id: row.key,
                    isActive: checked,
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const { data: business } = useQuery(GET_BUSINESSES_ASSETS_BY_ID, {
    variables: { getBusinessByIdId: businessId },
  });

  const outstandliabilitiesData =
    business?.getBusinessById?.business?.liabilities.map((libility) => ({
      key: libility?.id,
      liabilitiesname: libility?.name,
      noitems: libility?.quantity,
      purchaseyear: libility?.purchaseYear,
      price: libility?.price,
      verify: libility?.isActive,
    }));
  const keyassetData = business?.getBusinessById?.business?.assets.map(
    (asset) => ({
      key: asset?.id,
      assetname: asset?.name,
      noitems: asset?.quantity,
      purchaseyear: asset?.purchaseYear,
      price: asset?.price,
      verify: asset?.isActive,
    })
  );
  const inventoryData = business?.getBusinessById?.business?.inventoryItems.map(
    (inventory) => ({
      key: inventory?.id,
      inventoryname: inventory?.name,
      noitems: inventory?.quantity,
      purchaseyear: inventory?.purchaseYear,
      price: inventory?.price,
      verify: inventory?.isActive,
    })
  );
  const [updateBusinessAssets] = useMutation(UPDATE_ASSET, {
    refetchQueries: [
      {
        query: GET_BUSINESSES_ASSETS_BY_ID,
        variables: { getBusinessByIdId: businessId }, // make sure you pass the current business id
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Stats changed successfully!"));
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong!"));
    },
  });
  const [updateBusinessInventory] = useMutation(UPDATE_INVENTORY, {
    refetchQueries: [
      {
        query: GET_BUSINESSES_ASSETS_BY_ID,
        variables: { getBusinessByIdId: businessId }, // make sure you pass the current business id
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Stats changed successfully!"));
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong!"));
    },
  });
  const [updateBusinessLibility] = useMutation(UPDATE_LIABILITY, {
    refetchQueries: [
      {
        query: GET_BUSINESSES_ASSETS_BY_ID,
        variables: { getBusinessByIdId: businessId }, // make sure you pass the current business id
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Stats changed successfully!"));
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong!"));
    },
  });
  return (
    <>
      {contextHolder}
      <Flex vertical gap={15}>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={15}>
            <Title level={5} className="m-0">
              {t("Outstanding Liabilities / Debt")}
            </Title>
            <TableContent
              data={outstandliabilitiesData}
              columns={outstandliabColumn}
            />
          </Flex>
        </Card>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={15}>
            <Title level={5} className="m-0">
              {t("Key Asset")}
            </Title>
            <TableContent data={keyassetData} columns={keyassetColumn} />
          </Flex>
        </Card>
        <Card className="radius-12 border-gray">
          <Flex vertical gap={15}>
            <Title level={5} className="m-0">
              {t("Inventory")}
            </Title>
            <TableContent data={inventoryData} columns={inventoryColumn} />
          </Flex>
        </Card>
      </Flex>
    </>
  );
};

export { AssetsTab };
