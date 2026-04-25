import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from "antd";
import { MyDatepicker, MyInput, MySelect } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDistrictItem, useGroupItem } from "../../../shared";
import { CREATE_CAMPAIGN, UPDATE_CAMPAIGN } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import { GET_CAMPAIGNS } from "../../../graphql/query";
import { t } from "i18next";
import dayjs from "dayjs";

const { Title } = Typography;
const AddNotification = ({ visible, onClose, edititem, viewnotify }) => {
  const groupselectItem = useGroupItem();
  const districtselectItems = useDistrictItem();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchValue] = useState("");
  const [selectedCategory] = useState(null);
  const [selectedDistrict] = useState(null);
  const [pageSize] = useState(10);
  const [current] = useState(1);
  const [selectedStatus] = useState(null);

  const [form] = Form.useForm();
  const [sendNow, setSendNow] = useState(false);

  useEffect(() => {
    if (visible && (edititem || viewnotify)) {
      const source = edititem || viewnotify;
      const rawDate = source?.schedule;
      const parsedDate = rawDate ? dayjs(rawDate) : null;
      form.setFieldsValue({
        title: source?.title || "",
        group: source?.group?.toUpperCase() || "",
        district: Array.isArray(source?.district)
          ? source.district.map((d) => d?.item)
          : [],
        dateTime: parsedDate && parsedDate.isValid() ? parsedDate : null,
        description: source?.description || "",
      });
      setSendNow(false);
    } else {
      form.resetFields();
      setSendNow(false);
    }
  }, [visible, edititem, viewnotify, form]);

  const [campaign, { loading }] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [
      {
        query: GET_CAMPAIGNS,
        variables: {
          filter: {
            search: searchValue || null,
            district: selectedDistrict || null,
            group: selectedCategory || null,
            status: selectedStatus !== null ? selectedStatus : null,
            limit: pageSize,
            offset: (current - 1) * pageSize,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      const message = sendNow
        ? t("Notification sent successfully!")
        : t("Notification scheduled successfully!");
      messageApi.success(message);
      onClose();
    },
    onError: (err) => {
      messageApi.error(err.message || t("Failed to create campaign."));
    },
  });

  const [updateCampaign, { loading: updating }] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [
      {
        query: GET_CAMPAIGNS,
        variables: {
          filter: {
            search: searchValue || null,
            district: selectedDistrict || null,
            group: selectedCategory || null,
            status: selectedStatus !== null ? selectedStatus : null,
            limit: pageSize,
            offset: (current - 1) * pageSize,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Notification updated successfully!"));
      onClose();
    },
    onError: (err) => {
      messageApi.error(err.message || t("Failed to update campaign."));
    },
  });

  const onFinish = (values) => {
    const districts = Array.isArray(values.district)
      ? values.district.map((d) => (d.value ? d.value : d)) // handle MySelect returning objects or strings
      : [];

    // Check if selected time is within the next 10 minutes (current time)
    const selectedTime = dayjs(values.dateTime);
    const now = dayjs();
    const timeDifference = selectedTime.diff(now, "minute");
    const isSendNow = timeDifference <= 10;

    setSendNow(isSendNow);

    if (edititem) {
      // Update existing campaign
      updateCampaign({
        variables: {
          updateCampaignId: edititem.id,
          title: values.title,
          group: values?.group,
          district: districts,
          schedule: isSendNow ? now.toISOString() : values.dateTime,
          description: values.description,
        },
      });
    } else {
      // Create new campaign
      campaign({
        variables: {
          title: values.title,
          group: values?.group,
          district: districts,
          schedule: isSendNow ? now.toISOString() : values.dateTime,
          description: values.description,
        },
      });
    }
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledTime = (current) => {
    if (!current || !current.isSame(dayjs(), "day")) {
      return {};
    }

    return {
      disabledHours: () => range(0, dayjs().hour()),
      disabledMinutes: (selectedHour) => {
        if (selectedHour === dayjs().hour()) {
          return range(0, dayjs().minute());
        }
        return [];
      },
      disabledSeconds: (selectedHour, selectedMinute) => {
        if (
          selectedHour === dayjs().hour() &&
          selectedMinute === dayjs().minute()
        ) {
          return range(0, dayjs().second());
        }
        return [];
      },
    };
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
          !viewnotify ? (
            <Flex justify="end" gap={5}>
              <Button
                aria-labelledby="Cancel"
                type="button"
                onClick={onClose}
                className="btncancel text-black border-gray"
              >
                {t("Cancel")}
              </Button>
              <Button
                aria-labelledby="submit button"
                className={`btnsave border0 text-white brand-bg`}
                onClick={() => form.submit()}
                loading={loading || updating}
              >
                {edititem ? t("Update") : t("Confirm")}
              </Button>
            </Flex>
          ) : null
        }
      >
        <div>
          <Flex justify="space-between" className="mb-3" gap={6}>
            <Title level={5} className="m-0 fw-500">
              {viewnotify
                ? "View Notification"
                : edititem
                ? t("Edit Notification")
                : t("Add Notification")}
            </Title>
            <Button
              aria-labelledby="Close"
              type="button"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
            >
              <CloseOutlined className="fs-18" />
            </Button>
          </Flex>
          <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Row>
              <Col span={24}>
                <MyInput
                  label={t("Title")}
                  name="title"
                  required
                  message={t("Please enter your title")}
                  placeholder={t("Enter title")}
                  disabled={viewnotify}
                />
              </Col>
              <Col span={24}>
                <MySelect
                  label={t("Group")}
                  name="group"
                  required
                  message={t("Please choose group")}
                  placeholder={t("Choose")}
                  options={groupselectItem}
                  showKey
                  disabled={viewnotify}
                />
              </Col>
              <Col span={24}>
                <MySelect
                  mode="multiple"
                  label={t("Regions")}
                  name="district"
                  required
                  message={t("Please choose regions")}
                  placeholder={t("Choose regions")}
                  options={districtselectItems}
                  disabled={viewnotify}
                  showSearch={false}
                />
              </Col>
              <Col span={24}>
                <MyDatepicker
                  showTime
                  datePicker
                  label={t("Date & Time")}
                  name="dateTime"
                  required
                  message={t("Please select date and time")}
                  placeholder={t("Select Date & Time")}
                  format="DD-MM-YYYY hh:mm A"
                  disabled={viewnotify}
                  disabledDate={disabledDate}
                  disabledTime={disabledTime}
                />
              </Col>
              <Col span={24}>
                <MyInput
                  textArea
                  label={t("Description")}
                  name="description"
                  required
                  message={t("Please write note")}
                  placeholder={t("Write here....")}
                  rows={4}
                  disabled={viewnotify}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <Divider className="my-2 bg-light-brand" />
      </Modal>
    </>
  );
};

export { AddNotification };
