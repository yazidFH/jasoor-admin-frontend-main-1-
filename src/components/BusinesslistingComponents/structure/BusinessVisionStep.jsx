import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Card, Col, Flex, Form, Image, Row, Typography } from "antd";
import { MyInput } from "../../Forms";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";
import { ModuleTopHeading } from "../../PageComponents";

const { Text } = Typography;
const BusinessVisionStep = forwardRef(({ data, setData }, ref) => {
  const { t } = useTranslation();
  const { formatPhone } = useFormatNumber();
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));

  const handleFormChange = (_, allValues) => {
    const { supportDuration, noSession, growthOpportunities, reasonSelling } =
      allValues;

    setData((prev) => {
      const updated = {
        ...prev,
        supportDuration,
        supportSession: noSession,
        growthOpportunities,
        reason: reasonSelling,
      };

      return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
    });
  };
  useEffect(() => {
    form.setFieldsValue({
      supportDuration: data.supportDuration
        ? String(data.supportDuration)
        : undefined,
      noSession: data.supportSession ? String(data.supportSession) : undefined,
      growthOpportunities: data.growthOpportunities,
      reasonSelling: data.reason,
    });
  }, [data, form]);
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
            name={t("Business Vision & Exit Plans")}
          />
          <Text className="text-gray">
            {t(
              "Help buyers understand the future potential and your exit strategy"
            )}
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
              <MyInput
                label={t("Support Duration")}
                name="supportDuration"
                type="number"
                placeholder={t("Enter support duration")}
                addonAfter={t("Month")}
                className="w-100"
                validator={{
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === "") {
                      return Promise.resolve();
                    }
                    if (Number(value) <= 0) {
                      return Promise.reject(
                        new Error(t("Support duration must be greater than 0"))
                      );
                    }
                    return Promise.resolve();
                  },
                }}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={t("Number of Support Sessions")}
                name="noSession"
                type="number"
                placeholder={t("Enter number of sessions")}
                validator={{
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === "") {
                      return Promise.resolve();
                    }
                    if (Number(value) <= 0) {
                      return Promise.reject(
                        new Error(
                          t("Number of sessions must be greater than 0")
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }}
              />
            </Col>
            <Col span={24}>
              <MyInput
                textArea
                label={t("Growth Opportunities (Optional)")}
                name="growthOpportunities"
                placeholder={t(
                  "Write about future opportunities for the buyer."
                )}
                rows={5}
                showCount
                maxLength={200}
              />
            </Col>
            <Col span={24}>
              <MyInput
                textArea
                label={t("Reason for Selling")}
                name="reasonSelling"
                required
                message={t("Please enter reason for selling")}
                placeholder={t(
                  "Briefly explain why you're selling this business."
                )}
                rows={5}
                showCount
                maxLength={200}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
});

export { BusinessVisionStep };
