import { useState, useEffect } from "react";
import { Button, Card, Flex, Form, Spin, message } from "antd";
import { EditorDescription, ModuleTopHeading } from "../../components";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TERMS, UPDATE_TERMS } from "../../graphql/mutation/mutations";
import { GETTERMSOFUSE } from "../../graphql/query/queries";
import { useTranslation } from "react-i18next";

const TermOfUsePage = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const lang = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lang.toLowerCase() === "ar";
  const [descriptionData, setDescriptionData] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
  const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
  // call GETTERMSOFUSE
  const { data } = useQuery(GETTERMSOFUSE);

  useEffect(() => {
    if (!data?.getTerms || data.getTerms.length === 0) return;

    // First, try to find a term matching the current language
    let termToUse = data.getTerms.find((t) => t.isArabic === isArabic);

    // If not found, check if there's a single term with both languages
    if (!termToUse && data.getTerms.length > 0) {
      termToUse = data.getTerms[0];
    }

    if (termToUse) {
      if (isArabic && termToUse.arabicTerm) {
        setDescriptionData(termToUse.arabicTerm);
      } else if (!isArabic && termToUse.term) {
        setDescriptionData(termToUse.term);
      } else {
        setDescriptionData("");
      }
    }
  }, [data, isArabic]);

  const handleDescriptionChange = (value) => {
    setDescriptionData(value);
  };

  const onFinish = async () => {
    try {
      if (!descriptionData || descriptionData.trim().length === 0) {
        messageApi.error(t("Please add terms content"));
        return;
      }

      // Check if we have any existing terms
      const allTerms = data?.getTerms || [];

      // Find the term record - could be language-specific or shared
      let existingTerm = allTerms.find((t) => t.isArabic === isArabic);

      // If not found by exact language match, check if there's a single shared term
      if (!existingTerm && allTerms.length === 1) {
        existingTerm = allTerms[0];
      }

      if (existingTerm?.id) {
        // Update existing terms - preserve the other language content
        const updateInput = {
          isArabic,
          ndaTerm: null,
          policy: null,
        };

        // Add current language content
        if (isArabic) {
          updateInput.arabicTerm = descriptionData;
          // Preserve English content if it exists
          if (existingTerm.term) {
            updateInput.term = existingTerm.term;
          }
        } else {
          updateInput.term = descriptionData;
          // Preserve Arabic content if it exists
          if (existingTerm.arabicTerm) {
            updateInput.arabicTerm = existingTerm.arabicTerm;
          }
        }

        await updateTerms({
          variables: {
            updateTermsId: existingTerm.id,
            input: updateInput,
          },
          refetchQueries: [{ query: GETTERMSOFUSE }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("Terms updated successfully!"));
      } else {
        // Create new terms
        await createTerms({
          variables: {
            input: {
              ...(isArabic
                ? { arabicTerm: descriptionData }
                : { term: descriptionData }),
              isArabic,
              ndaTerm: null,
              policy: null,
            },
          },
          refetchQueries: [{ query: GETTERMSOFUSE }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("Terms created successfully!"));
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to save terms"));
    }
  };

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
          <ModuleTopHeading level={4} name={t("Terms of Use")} />
          <Button
            onClick={onFinish}
            aria-labelledby="Save"
            type="button"
            className="btnsave border0 text-white brand-bg"
            loading={creating || updating}
          >
            {t("Save")}
          </Button>
        </Flex>
        <Card className="radius-12 border-gray">
          <Form layout="vertical" form={form} requiredMark={false}>
            <EditorDescription
              label={t("Terms Content")}
              descriptionData={descriptionData}
              onChange={handleDescriptionChange}
            />
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export { TermOfUsePage };
