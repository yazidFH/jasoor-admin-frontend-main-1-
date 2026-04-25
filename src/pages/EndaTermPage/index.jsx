import { useEffect, useRef, useState } from "react";
import { Button, Card, Flex, Form, Spin, message, Tag } from "antd";
import { EditorDescription, ModuleTopHeading } from "../../components";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TERMS, UPDATE_TERMS } from "../../graphql/mutation/mutations";
import { GETENDATERMS } from "../../graphql/query/queries";
import { useTranslation } from "react-i18next";
import { TAGS } from "../../data/tags";

const EndaTermPage = () => {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lang.toLowerCase() === "ar";
  const [form] = Form.useForm();
  const [descriptionData, setDescriptionData] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [createTerms, { loading: creating }] = useMutation(CREATE_TERMS);
  const [updateTerms, { loading: updating }] = useMutation(UPDATE_TERMS);
  const { data, loading } = useQuery(GETENDATERMS);

  useEffect(() => {
    if (!data?.getNDATerms) return;
    if (isArabic) {
      const arabicTerm = data.getNDATerms.find((t) => t.arabicNdaTerm?.content);
      if (arabicTerm) {
        setDescriptionData(arabicTerm.arabicNdaTerm.content);
      }
    } else {
      const englishTerm = data.getNDATerms.find((t) => t.ndaTerm?.content);
      if (englishTerm) {
        setDescriptionData(englishTerm.ndaTerm.content);
      }
    }
  }, [data, isArabic]);

  const editorRef = useRef(null);

  const handleDescriptionChange = (value) => {
    setDescriptionData(value);
  };

  const handleEditorInit = (editor) => {
    editorRef.current = editor;
  };
  const onFinish = async () => {
    try {
      if (!descriptionData || descriptionData.trim().length === 0) {
        messageApi.error(t("Please add terms content"));
        return;
      }

      // Find existing term based on language
      const existingTerm = data?.getNDATerms?.find(
        (t) => t.isArabic === isArabic
      );

      if (existingTerm?.id) {
        await updateTerms({
          variables: {
            updateTermsId: existingTerm.id,
            input: {
              term: null,
              ...(isArabic
                ? { arabicNdaTerm: { content: descriptionData } }
                : { ndaTerm: { content: descriptionData } }),
              isArabic,
              policy: null,
            },
          },
          refetchQueries: [{ query: GETENDATERMS }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("E-NDA Terms updated successfully!"));
      } else {
        await createTerms({
          variables: {
            input: {
              term: null,
              ...(isArabic
                ? { arabicNdaTerm: { content: descriptionData } }
                : { ndaTerm: { content: descriptionData } }),
              isArabic,
              policy: null,
            },
          },
          refetchQueries: [{ query: GETENDATERMS }],
          awaitRefetchQueries: true,
        });
        messageApi.success(t("E-NDA Terms created successfully!"));
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to save terms"));
    }
  };

  const handleInsertTag = (tagKey) => {
    const tagText = `{{${tagKey}}}`;

    if (editorRef.current) {
      const editor = editorRef.current;

      // Force focus before inserting
      editor.focus();

      let range = editor.getSelection(true); // true = focus if not active
      if (range) {
        // Insert at current cursor position
        editor.insertText(range.index, tagText, "user");
        editor.setSelection(range.index + tagText.length);
      } else {
        // Fallback: append at end
        const length = editor.getLength();
        editor.insertText(length - 1, tagText, "user"); // before last \n
        editor.setSelection(length - 1 + tagText.length);
      }
    } else {
      // Fallback: update state
      setDescriptionData((prev) => prev + tagText);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
          <ModuleTopHeading level={4} name={t("E-NDA Terms")} />
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

        {/* <Card className="radius-12 border-gray">
                  <Flex gap={8} wrap="wrap">
                      {TAGS.map((t) => (
                         <Tag
                         key={t.key}
                         color="blue"
                         style={{ cursor: "pointer" }}
                         onClick={() => handleInsertTag(t.key)}
                         onMouseDown={(e) => {
                           e.preventDefault();
                         }}
                       >
                         {`${t.key}`}
                       </Tag>
                     
                      ))}
                  </Flex>
              </Card> */}

        <Card className="radius-12 border-gray">
          <Form
            layout="vertical"
            form={form}
            // onFinish={onFinish}
            requiredMark={false}
          >
            <EditorDescription
              label={t("Terms Content")}
              descriptionData={descriptionData}
              onChange={handleDescriptionChange}
              onEditorInit={handleEditorInit}
            />
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export { EndaTermPage };
