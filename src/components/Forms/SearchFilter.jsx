import { Form, Input } from "antd";
import "./index.css";
export const SearchFilter = ({
  withoutForm,
  name,
  tooltip,
  type,
  size,
  disabled,
  required,
  message,
  value,
  placeholder,
  textArea,
  validator,
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
            disabled={disabled || false}
            className="searchinputno"
          />
        ) : type === "password" ? (
          <Input.Password
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="searchinputno"
          />
        ) : (
          <Input
            type={type || "text"}
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="searchinputno"
          />
        )
      ) : (
        <Form.Item
          name={name}
          tooltip={tooltip || null}
          rules={
            validator
              ? [
                  {
                    required: required,
                    message: message,
                  },
                  validator,
                ]
              : [
                  {
                    required: required,
                    message: message,
                  },
                ]
          }
          className="filtercs fs-14 m-0"
        >
          {textArea ? (
            <Input.TextArea
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
