import { Form, Input } from "antd";
import { useEffect, useRef } from "react";
import "./index.css";
export const SearchInput = ({
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
  onChange,
  ...props
}) => {
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const nextVal = e?.target?.value ?? "";
    if (!onChange) return;
    onChange({ target: { value: nextVal } });
  };
  return (
    <>
      {withoutForm ? (
        textArea ? (
          <Input.TextArea
            placeholder={placeholder || ""}
            value={value || ""}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
          className="custom-input1 fs-14 m-0"
        >
          {textArea ? (
            <Input.TextArea
              placeholder={placeholder || ""}
              value={value || ""}
              onChange={handleChange}
              {...props}
              disabled={disabled || false}
            />
          ) : type === "password" ? (
            <Input.Password
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              onChange={handleChange}
              {...props}
            />
          ) : (
            <Input
              type={type || "text"}
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              onChange={handleChange}
              {...props}
            />
          )}
        </Form.Item>
      )}
    </>
  );
};
