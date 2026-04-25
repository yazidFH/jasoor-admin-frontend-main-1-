import { useState, useEffect } from "react";
import { Button, Card, Flex, Form, Spin, message } from "antd";
import { EditorDescription, ModuleTopHeading } from "../../components";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TERMS, UPDATE_TERMS } from "../../graphql/mutation/mutations";
import { GETPRIVACYPOLICY } from "../../graphql/query/queries";
import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lang.toLowerCase() === "ar";

  const [descriptionData, setDescriptionData] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
  const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
  const { data, loading, error } = useQuery(GETPRIVACYPOLICY);

  useEffect(() => {
    if (data?.getPrivacyPolicy === 0) return;
    if (isArabic) {
      const arabicPolicy = data?.getPrivacyPolicy?.find(
        (t) => t.arabicPolicy?.content
      );
      if (arabicPolicy) {
        setDescriptionData(arabicPolicy?.arabicPolicy?.content);
      }
    } else {
      const englishPolicy = data?.getPrivacyPolicy?.find(
        (t) => t.policy?.content
      );
      if (englishPolicy) {
        setDescriptionData(englishPolicy?.policy?.content);
      }
    }
  }, [data, isArabic]);

  const handleDescriptionChange = (value) => {
    setDescriptionData(value);
  };

  const onFinish = async () => {
    try {
      if (!descriptionData || descriptionData.trim().length === 0) {
        messageApi.error(t("Please add policy content"));
        return;
      }
      // prepare dynamic input
      const existingTerm = data?.getPrivacyPolicy?.find(
        (t) => t.isArabic === isArabic
      );

      const existingTermsId = isArabic ? existingTerm?.id : existingTerm?.id;

      if (existingTermsId) {
        await updateTerms({
          variables: {
            updateTermsId: existingTermsId,
            input: {
              term: null,
              dsaTerms: null,
              ...(isArabic
                ? { arabicPolicy: { content: descriptionData } }
                : { policy: { content: descriptionData } }),
              isArabic,
            },
          },
          refetchQueries: [{ query: GETPRIVACYPOLICY }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("Policy updated successfully!"));
      } else {
        await createTerms({
          variables: {
            input: {
              term: null,
              ndaTerm: null,
              ...(isArabic
                ? { arabicPolicy: { content: descriptionData } }
                : { policy: { content: descriptionData } }),
              isArabic,
            },
          },
          refetchQueries: [{ query: GETPRIVACYPOLICY }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("Policy created successfully!"));
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to save policy"));
    }
  };
  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
          <ModuleTopHeading level={4} name={t("Privacy Policy")} />
          <Button
            onClick={onFinish}
            loading={creating || updating}
            aria-labelledby="Save"
            type="button"
            className="btnsave border0 text-white brand-bg"
          >
            {t("Save")}
          </Button>
        </Flex>
        <Card className="radius-12 border-gray">
          <Form
            layout="vertical"
            form={form}
            // onFinish={onFinish}
            requiredMark={false}
          >
            <EditorDescription
              label={t("Privacy Policy Content")}
              descriptionData={descriptionData}
              onChange={handleDescriptionChange}
            />
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export { PrivacyPolicyPage };
