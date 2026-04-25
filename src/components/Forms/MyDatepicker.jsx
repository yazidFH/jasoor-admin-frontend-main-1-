import { Form, TimePicker, DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import moment from "moment";
export const MyDatepicker = ({
  withoutForm,
  name,
  label,
  disabled,
  required,
  message,
  value,
  rangePicker,
  placeholder,
  datePicker,
  year,
  ...props
}) => {
  return (
    <>
      {withoutForm ? (
        year ? (
          <DatePicker.YearPicker
            disabled={disabled || false}
            value={value ? dayjs(value, "YYYY") : ""}
            {...props}
            className="fs-14 without-timeinput w-100"
          />
        ) : datePicker ? (
          <DatePicker
            disabled={disabled || false}
            value={value ? moment(value, "YYYY-MM-DD") : ""}
            format={"YYYY-MM-DD-"}
            {...props}
            className={"fs-14 without-timeinput w-100"}
          />
        ) : rangePicker ? (
          <DatePicker.RangePicker
            disabled={disabled || false}
            value={value}
            {...props}
            className="fs-14 without-timeinput w-100"
          />
        ) : (
          <TimePicker
            disabled={disabled || false}
            // value={moment(value || '00:00')}
            placeholder={placeholder}
            format="HH:mm A"
            {...props}
            className="fs-14 without-timeinput w-100"
          />
        )
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
            },
          ]}
          className="custom-input fs-14"
        >
          {datePicker ? (
            <DatePicker
              disabled={disabled || false}
              value={value ? moment(value, "YYYY-MM-DD") : ""}
              {...props}
              className="w-100"
            />
          ) : rangePicker ? (
            <DatePicker.RangePicker
              disabled={disabled || false}
              value={value ? moment(value, "YYYY-MM-DD") : ""}
              {...props}
              className="w-100"
            />
          ) : (
            <TimePicker
              disabled={disabled || false}
              value={moment(value || "00:00")}
              format="HH:mm A"
              placeholder={placeholder}
              {...props}
              className="w-100"
            />
          )}
        </Form.Item>
      )}
    </>
  );
};
