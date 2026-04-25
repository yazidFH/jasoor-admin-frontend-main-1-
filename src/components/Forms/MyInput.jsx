import { Form, Input, Typography } from "antd";
import "./index.css";
export const MyInput = ({
  withoutForm,
  name,
  label,
  tooltip,
  type,
  size,
  disabled,
  required,
  message,
  value,
  placeholder,
  textArea,
  oTp,
  validator,
  rules,
  dependencies,
  ...props
}) => {
  return (
    <>
      {withoutForm ? (
        textArea ? (
          <Input.TextArea
            placeholder={placeholder || ""}
            value={value || ""}
            {...props}
            className="custom-input fs-14"
          />
        ) : type === "password" ? (
          <Input.Password
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="custom-input fs-14"
          />
        ) : (
          <Input
            type={type || "text"}
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="custom-input fs-14"
          />
        )
      ) : (
        <Form.Item
          name={name}
          label={
            <Typography.Text className="fs-14 fw-400">{label}</Typography.Text>
          }
          tooltip={tooltip || null}
          className="custom-input fs-14 otp-cs"
          dependencies={dependencies}
          rules={
            rules
              ? rules
              : validator
              ? [
                  {
                    required: required,
                    whitespace: true,
                    message: message,
                  },
                  validator,
                ]
              : [
                  {
                    required: required,
                    whitespace: true,
                    message: message,
                  },
                ]
          }
        >
          {textArea ? (
            <Input.TextArea
              placeholder={placeholder || ""}
              value={value || ""}
              {...props}
              disabled={disabled || false}
            />
          ) : oTp ? (
            <Input.OTP
              placeholder={placeholder || ""}
              value={value || ""}
              {...props}
              disabled={disabled || false}
            />
          ) : type === "password" ? (
            <Input.Password
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              {...props}
            />
          ) : (
            <Input
              type={type || "text"}
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              {...props}
            />
          )}
        </Form.Item>
      )}
    </>
  );
};
