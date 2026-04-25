import { Form, Select, Typography } from "antd";
import "./index.css";
import { useTranslation } from "react-i18next";
export const MySelect = ({
  withoutForm,
  name,
  label,
  mode,
  disabled,
  required,
  showKey,
  message,
  value,
  options,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return withoutForm ? (
    <Select
      maxTagCount="responsive"
      className="select min-w-140"
      value={value || undefined}
      mode={mode || ""}
      disabled={disabled || false}
      {...props}
    >
      {options?.map((opt) => (
        <Select.Option value={showKey ? opt?.id : opt?.name} key={opt?.id}>
          {isArabic && opt?.arabicName ? opt.arabicName : t(opt?.name)}
        </Select.Option>
      ))}
    </Select>
  ) : (
    <Form.Item
      name={name}
      label={
        <Typography.Text className="fs-14 fw-400">{label}</Typography.Text>
      }
      rules={[
        {
          required,
          message,
          validator: async (_, value) => {
            if (required) {
              if (mode === "multiple") {
                if (!value || !Array.isArray(value) || value.length === 0) {
                  return Promise.reject(new Error(message));
                }
              } else {
                if (!value || (typeof value === "string" && !value.trim())) {
                  return Promise.reject(new Error(message));
                }
              }
            }
            return Promise.resolve();
          },
        },
      ]}
      className="custom-select"
    >
      <Select
        value={value || ""}
        mode={mode || ""}
        disabled={disabled || false}
        maxTagCount="responsive"
        {...props}
      >
        {options?.map((opt) => (
          <Select.Option value={showKey ? opt?.id : opt?.name} key={opt?.id}>
            {isArabic && opt?.arabicName ? opt.arabicName : t(opt?.name)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
