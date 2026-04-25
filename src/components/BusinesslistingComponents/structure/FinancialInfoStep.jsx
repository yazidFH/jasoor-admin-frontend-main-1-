import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  Card,
  Col,
  Flex,
  Form,
  Row,
  Select,
  Typography,
  Input,
  Image,
} from "antd";
import { MyInput } from "../../Forms";
import { FormReplicate } from "../../Header";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";
import { ModuleTopHeading } from "../../PageComponents";
import { revenueLookups } from "../../../shared";

const { Text } = Typography;

const hasNonEmptyValue = (value) => {
  if (value === 0) return true;
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
};

const createRowValidator =
  (dayKey, fieldKeys, { emptyMessage, invalidMessage, type = "text" }, t) =>
  ({ getFieldValue, index }) => ({
    validator(_, value) {
      const rows = getFieldValue(dayKey) || [];
      const row = rows?.[index] || {};
      const rowHasAnyValue = fieldKeys.some((key) =>
        hasNonEmptyValue(row?.[key])
      );

      if (!rowHasAnyValue) {
        return Promise.resolve();
      }

      if (!hasNonEmptyValue(value)) {
        return Promise.reject(new Error(t ? t(emptyMessage) : emptyMessage));
      }

      if (type === "number") {
        const numericValue = typeof value === "string" ? value : String(value);
        if (!/^\d+(\.\d+)?$/.test(numericValue.trim())) {
          return Promise.reject(
            new Error(t ? t(invalidMessage) : invalidMessage)
          );
        }
      }

      return Promise.resolve();
    },
  });

const normalizeLookupValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return undefined;
  }

  return numeric;
};

const FinancialInfoStep = forwardRef(({ data, setData }, ref) => {
  const { formatPhone } = useFormatNumber();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));

  const foundedYear = data?.foundedDate
    ? new Date(data.foundedDate).getFullYear()
    : new Date().getFullYear();
  const currentYear = new Date().getFullYear();

  const yearOp = [];
  for (let y = foundedYear; y <= currentYear; y++) {
    yearOp.push({ id: String(y), name: y });
  }
  const handleFormChange = (_, allValues) => {
    setData((prev) => ({
      ...prev,
      revenueTime: allValues.revenueTime,
      revenue: allValues.revenue,
      profittime: allValues.profittime,
      profit: allValues.profit,
      price: allValues.businessPrice,
      profitMargen: allValues.profitMargin,
      assets:
        allValues.keyassets?.map((item) => ({
          name: item?.assetName || "",
          quantity: item?.noItems || "",
          purchaseYear: item?.purchaseYear || "",
          price: item?.price || "",
        })) || [],
      liabilities:
        allValues.liability?.map((item) => ({
          name: item?.liabilityName || "",
          quantity: item?.quantity || "",
          purchaseYear: item?.liabilitypurchaseYear || "",
          price: item?.liabilityPrice || "",
        })) || [],
      inventoryItems:
        allValues.inventory?.map((item) => ({
          name: item?.inventoryName || "",
          quantity: item?.inventoryquantity || "",
          purchaseYear: item?.inventoryypurchaseYear || "",
          price: item?.inventoryPrice || "",
        })) || [],
    }));
  };

  // Sync form with incoming data (edit mode or draft load)
  console.log("FinancialInfoStep data:", data);
  useEffect(() => {
    form.setFieldsValue({
      revenueTime: normalizeLookupValue(data.revenueTime),
      revenue: data.revenue || undefined,
      profittime: normalizeLookupValue(data.profittime),
      profit: data.profit || undefined,
      businessPrice: data.price ? String(data.price) : undefined,
      profitMargin: data.profitMargen || null,
      multiple: data.multiple || null,
      capitalRecovery: data.capitalRecovery || null,
      keyassets: data.assets?.map((item) => ({
        assetName: item.name,
        noItems: item.quantity ? String(item.quantity) : "",
        purchaseYear: item.purchaseYear,
        price: item.price ? String(item.price) : "",
      })),
      liability: data.liabilities?.map((item) => ({
        liabilityName: item.name,
        quantity: item.quantity ? String(item.quantity) : "",
        liabilitypurchaseYear: item.purchaseYear,
        liabilityPrice: item.price ? String(item.price) : "",
      })),
      inventory: data.inventoryItems?.map((item) => ({
        inventoryName: item.name,
        inventoryquantity: item.quantity ? String(item.quantity) : "",
        inventoryypurchaseYear: item.purchaseYear,
        inventoryPrice: item.price ? String(item.price) : "",
      })),
    });
  }, [data, form]);

  useEffect(() => {
    const allValues = form.getFieldsValue();

    const revenue = Number(allValues.revenue || 0);
    const profit = Number(allValues.profit || 0);
    const price = Number(allValues.businessPrice || 0);
    const profitPeriod = Number(allValues.profittime);
    const revenuePeriod = Number(allValues.revenueTime);

    let adjustedRevenue = revenue;
    let adjustedProfit = profit;

    if (profitPeriod !== revenuePeriod) {
      if (profitPeriod === 1 && revenuePeriod === 2) {
        adjustedRevenue = revenue / 2;
      } else if (profitPeriod === 2 && revenuePeriod === 1) {
        adjustedProfit = profit / 2;
      }
    }

    const months = profitPeriod === 1 ? 6 : 12;
    const avgMonthlyProfit = adjustedProfit / months;

    const multiple =
      price > 0 && avgMonthlyProfit > 0 ? price / avgMonthlyProfit : null;

    const scaledMultiple =
      typeof multiple === "number" && Number.isFinite(multiple)
        ? String(Math.floor(Math.abs(multiple)))[0]
        : null;

    const profitMargin = adjustedRevenue
      ? ((adjustedProfit / adjustedRevenue) * 100).toFixed(2)
      : null;

    const capitalRecovery =
      avgMonthlyProfit && price > 0
        ? (price / avgMonthlyProfit).toFixed(2)
        : null;

    setData((prev) => ({
      ...prev,
      multiple: scaledMultiple,
      profitMargen: profitMargin,
      capitalRecovery,
    }));
    form.setFieldsValue({
      multiple: scaledMultiple,
      profitMargin,
      capitalRecovery,
    });
  }, [
    form,
    form.getFieldValue("revenue"),
    form.getFieldValue("profit"),
    form.getFieldValue("businessPrice"),
    form.getFieldValue("profittime"),
    form.getFieldValue("revenueTime"),
  ]);
  return (
    <>
      <Flex
        justify="space-between"
        className="mb-3"
        gap={10}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading
            level={4}
            name={t("Share your business numbers & potential")}
          />
          <Text className="text-gray">
            {t("These numbers help buyers understand your business value.")}
          </Text>
        </Flex>
        <Flex className="pill-round" gap={8} align="center">
          <Image
            src="/assets/icons/info-b.png"
            preview={false}
            width={16}
            alt={t("info icon")}
          />
          <Text className="fs-12 text-sky">
            {t("For any query, contact us on")}{" "}
            {formatPhone("+966 543 543 654")}
          </Text>
        </Flex>
      </Flex>
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onValuesChange={handleFormChange}
      >
        <Card className="shadow-d radius-12 border-gray mb-3">
          <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label={t("Revenue")} className="w-100">
                <Flex gap={2} className="w-100">
                  <Form.Item
                    name="revenueTime"
                    rules={[
                      {
                        required: true,
                        message: t("Please select revenue period"),
                      },
                    ]}
                    noStyle
                  >
                    <Select
                      placeholder={t("Select period")}
                      className="addonselect fs-14 w-180"
                    >
                      {revenueLookups?.map((list, index) => (
                        <Select.Option value={list?.id} key={index}>
                          {t(list?.name)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="revenue"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter revenue value"),
                      },
                      {
                        validator: (_, value) => {
                          if (value && Number(value) <= 0) {
                            return Promise.reject(
                              new Error(t("Revenue must be greater than 0"))
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      type="number"
                      placeholder={t("Enter revenue")}
                      className="w-100 "
                      prefix={
                        <img
                          src="/assets/icons/reyal-g.png"
                          alt={t("currency-symbol")}
                          width={15}
                          fetchPriority="high"
                        />
                      }
                    />
                  </Form.Item>
                </Flex>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label={t("Profit")} className="w-100">
                <Flex gap={2} className="w-100">
                  <Form.Item
                    name="profittime"
                    rules={[
                      {
                        required: true,
                        message: t("Please select profit period"),
                      },
                    ]}
                    noStyle
                  >
                    <Select
                      placeholder={t("Select period")}
                      className="addonselect fs-14 w-180"
                    >
                      {revenueLookups?.map((list, index) => (
                        <Select.Option value={list?.id} key={index}>
                          {t(list?.name)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="profit"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter profit value"),
                      },
                      {
                        validator: (_, value) => {
                          if (value && Number(value) <= 0) {
                            return Promise.reject(
                              new Error(t("Profit must be greater than 0"))
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      type="number"
                      placeholder={t("Enter profit")}
                      className="w-100"
                      prefix={
                        <img
                          src="/assets/icons/reyal-g.png"
                          alt={t("currency-symbol")}
                          width={14}
                          fetchPriority="high"
                        />
                      }
                    />
                  </Form.Item>
                </Flex>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              {(() => {
                const profitPeriod = form.getFieldValue("profittime");
                const revenuePeriod = form.getFieldValue("revenueTime");

                if (
                  profitPeriod &&
                  revenuePeriod &&
                  profitPeriod !== revenuePeriod
                ) {
                  return (
                    <Text type="danger">
                      {t(
                        "Revenue is for {{revPeriod}}, but Profit is for {{profitPeriod}}. Profit Margin is adjusted accordingly.",
                        {
                          revPeriod:
                            revenuePeriod === 1
                              ? t("6 months")
                              : t("12 months"),
                          profitPeriod:
                            profitPeriod === 1 ? t("6 months") : t("12 months"),
                        }
                      )}
                    </Text>
                  );
                }
                return null;
              })()}
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={t("Business Price")}
                name="businessPrice"
                required
                message={t("Please enter business price")}
                placeholder={t("Enter Business Price")}
                addonBefore={
                  <img
                    src="/assets/icons/reyal-g.png"
                    alt={t("currency-symbol")}
                    width={14}
                    fetchPriority="high"
                  />
                }
                className="w-100"
              />
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={t("Capital Recovery")}
                name="capitalRecovery"
                readOnly
                addonBefore={
                  <img
                    src="/assets/icons/reyal-g.png"
                    alt={t("currency-symbol")}
                    width={14}
                    fetchPriority="high"
                  />
                }
                className="w-100"
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={
                  <Flex align="center" gap={5}>
                    {t("Multiples of Revenue & Profit")}{" "}
                    <Image
                      preview={false}
                      src="/assets/icons/info-outline.png"
                      width={15}
                      alt={t("info-icon")}
                    />
                  </Flex>
                }
                name="multiple"
                className="w-100"
                readOnly
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={t("Profit Margin")}
                name="profitMargin"
                readOnly
                suffix="%"
              />
            </Col>
          </Row>
        </Card>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <FormReplicate
            dayKey="keyassets"
            title={t("Key Assets (Optional)")}
            form={form}
            allowEmpty
            fieldsConfig={[
              {
                name: "assetName",
                label: t("Asset Name"),
                placeholder: t("Write asset name"),
                type: "input",
                validator: createRowValidator(
                  "keyassets",
                  ["assetName", "noItems", "purchaseYear", "price"],
                  {
                    emptyMessage: t("Please enter asset name"),
                  },
                  t
                ),
              },
              {
                name: "noItems",
                label: t("Number of items"),
                placeholder: t("Enter quantity"),
                type: "input",
                validator: createRowValidator(
                  "keyassets",
                  ["assetName", "noItems", "purchaseYear", "price"],
                  {
                    emptyMessage: t("Please enter quantity"),
                    invalidMessage: t(
                      "Please enter a valid quantity (number only)"
                    ),
                    type: "number",
                  },
                  t
                ),
              },
              {
                name: "purchaseYear",
                label: t("Purchase Year"),
                placeholder: t("Choose purchase year"),
                type: "select",
                options: yearOp,
                validator: createRowValidator(
                  "keyassets",
                  ["assetName", "noItems", "purchaseYear", "price"],
                  {
                    emptyMessage: t("Please choose purchase year"),
                  },
                  t
                ),
              },
              {
                name: "price",
                label: t("Total Price"),
                placeholder: t("Enter price"),
                type: "input",
                addonBefore: (
                  <img
                    src="/assets/icons/reyal-g.png"
                    alt={t("currency-symbol")}
                    width={14}
                    fetchPriority="high"
                  />
                ),
                className: "w-100 bg-white",
                validator: createRowValidator(
                  "keyassets",
                  ["assetName", "noItems", "purchaseYear", "price"],
                  {
                    emptyMessage: t("Please enter price"),
                    invalidMessage: t("Please enter price (number only)"),
                    type: "number",
                  },
                  t
                ),
              },
            ]}
          />
        </Card>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <FormReplicate
            dayKey="liability"
            title={t("Outstanding Liabilities / Debt (Optional)")}
            form={form}
            allowEmpty
            fieldsConfig={[
              {
                name: "liabilityName",
                label: t("Liabilities Name"),
                placeholder: t("Write liability name"),
                type: "input",
                validator: createRowValidator(
                  "liability",
                  [
                    "liabilityName",
                    "quantity",
                    "liabilitypurchaseYear",
                    "liabilityPrice",
                  ],
                  {
                    emptyMessage: t("Please enter liability name"),
                  },
                  t
                ),
              },
              {
                name: "quantity",
                label: t("Number of items"),
                placeholder: t("Enter quantity"),
                type: "input",
                validator: createRowValidator(
                  "liability",
                  [
                    "liabilityName",
                    "quantity",
                    "liabilitypurchaseYear",
                    "liabilityPrice",
                  ],
                  {
                    emptyMessage: t("Please enter quantity"),
                    invalidMessage: t(
                      "Please enter a valid quantity (number only)"
                    ),
                    type: "number",
                  },
                  t
                ),
              },
              {
                name: "liabilitypurchaseYear",
                label: t("Purchase Year"),
                placeholder: t("Choose purchase year"),
                type: "select",
                options: yearOp,
                validator: createRowValidator(
                  "liability",
                  [
                    "liabilityName",
                    "quantity",
                    "liabilitypurchaseYear",
                    "liabilityPrice",
                  ],
                  {
                    emptyMessage: t("Please choose purchase year"),
                  },
                  t
                ),
              },
              {
                name: "liabilityPrice",
                label: t("Total Price"),
                placeholder: t("Enter price"),
                type: "input",
                addonBefore: (
                  <img
                    src="/assets/icons/reyal-g.png"
                    alt={t("currency-symbol")}
                    width={14}
                    fetchPriority="high"
                  />
                ),
                className: "w-100 bg-white",
                message: t("Please enter total price"),
                validator: createRowValidator(
                  "liability",
                  [
                    "liabilityName",
                    "quantity",
                    "liabilitypurchaseYear",
                    "liabilityPrice",
                  ],
                  {
                    emptyMessage: t("Please enter price"),
                    invalidMessage: t("Please enter price (number only)"),
                    type: "number",
                  },
                  t
                ),
              },
            ]}
          />
        </Card>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <FormReplicate
            dayKey="inventory"
            title={t("Inventory (Optional)")}
            form={form}
            allowEmpty
            fieldsConfig={[
              {
                name: "inventoryName",
                label: t("Inventory Name"),
                placeholder: t("Write inventory name"),
                type: "input",
                validator: createRowValidator(
                  "inventory",
                  [
                    "inventoryName",
                    "inventoryquantity",
                    "inventoryypurchaseYear",
                    "inventoryPrice",
                  ],
                  {
                    emptyMessage: t("Please enter inventory name"),
                  },
                  t
                ),
              },
              {
                name: "inventoryquantity",
                label: t("Number of items"),
                placeholder: t("Enter quantity"),
                type: "input",
                validator: createRowValidator(
                  "inventory",
                  [
                    "inventoryName",
                    "inventoryquantity",
                    "inventoryypurchaseYear",
                    "inventoryPrice",
                  ],
                  {
                    emptyMessage: t("Please enter quantity"),
                    invalidMessage: t(
                      "Please enter a valid quantity (number only)"
                    ),
                    type: "number",
                  },
                  t
                ),
              },
              {
                name: "inventoryypurchaseYear",
                label: t("Purchase Year"),
                placeholder: t("Choose purchase year"),
                type: "select",
                options: yearOp,
                validator: createRowValidator(
                  "inventory",
                  [
                    "inventoryName",
                    "inventoryquantity",
                    "inventoryypurchaseYear",
                    "inventoryPrice",
                  ],
                  {
                    emptyMessage: t("Please choose purchase year"),
                  },
                  t
                ),
              },
              {
                name: "inventoryPrice",
                label: t("Total Price"),
                placeholder: t("Enter price"),
                type: "input",
                addonBefore: (
                  <img
                    src="/assets/icons/reyal-g.png"
                    alt={t("currency-symbol")}
                    width={14}
                    fetchPriority="high"
                  />
                ),
                className: "w-100 bg-white",
                validator: createRowValidator(
                  "inventory",
                  [
                    "inventoryName",
                    "inventoryquantity",
                    "inventoryypurchaseYear",
                    "inventoryPrice",
                  ],
                  {
                    emptyMessage: t("Please enter price"),
                    invalidMessage: t("Please enter price (number only)"),
                    type: "number",
                  },
                  t
                ),
              },
            ]}
          />
        </Card>
      </Form>
    </>
  );
});

export { FinancialInfoStep };
