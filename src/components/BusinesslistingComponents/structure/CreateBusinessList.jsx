import { useState, useRef, useEffect } from "react";
import {
  Breadcrumb,
  Flex,
  Typography,
  Steps,
  Button,
  message,
  Tooltip,
} from "antd";
import { CheckOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BusinessDetailStep } from "./BusinessDetailStep";
import { FinancialInfoStep } from "./FinancialInfoStep";
import { BusinessVisionStep } from "./BusinessVisionStep";
import { UploadSupportDocStep } from "./UploadSupportDocStep";
import { CREATE_BUSINESS, UPDATE_BUSINESS } from "../../../graphql/mutation";
import { GET_BUSINESS } from "../../../graphql/query";
import { BusinesslistingReviewModal, CancelModal } from "../modals";

const { Text } = Typography;
const LOCAL_STORAGE_KEY = "sellBusinessDraft";

const CreateBusinessList = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const editBusinessId = searchParams.get("edit");

  const [current, setCurrent] = useState(0);
  const [iscancel, setIsCancel] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [reviewmodal, setReviewModal] = useState(false);
  const navigate = useNavigate();
  const [createBusiness, { loading: createLoading }] =
    useMutation(CREATE_BUSINESS);
  const [updateBusiness, { loading: updateLoading }] =
    useMutation(UPDATE_BUSINESS);
  const loading = createLoading || updateLoading;
  const businessDetailFormRef = useRef();
  // Fetch business data explicitly when edit mode is active
  const [loadBusinessById, { data: editData, loading: editDataLoading }] =
    useLazyQuery(GET_BUSINESS, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    if (editBusinessId) {
      loadBusinessById({ variables: { getBusinessByIdId: editBusinessId } });
    }
  }, [editBusinessId, loadBusinessById]);

  const [businessData, setBusinessData] = useState(() => {
    // Don't load draft in edit mode
    if (editBusinessId) {
      return {
        isByTakbeer: null,
        businessTitle: null,
        categoryId: null,
        district: null,
        city: null,
        foundedDate: null,
        numberOfEmployees: null,
        description: null,
        url: null,
        revenueTime: null,
        revenue: null,
        profittime: null,
        profit: null,
        price: null,
        profitMargen: null,
        multiple: null,
        capitalRecovery: null,
        username: null,
        userId: null,
        assets: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
        liabilities: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
        inventoryItems: [
          { name: null, price: null, purchaseYear: null, quantity: null },
        ],
        supportDuration: null,
        supportSession: null,
        growthOpportunities: null,
        reason: null,
        documents: [
          {
            title: null,
            fileName: null,
            fileType: null,
            filePath: null,
            description: null,
          },
        ],
      };
    }

    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      return {
        ...parsed,
        foundedDate: parsed.foundedDate ? dayjs(parsed.foundedDate) : null,
      };
    }
    return {
      isByTakbeer: null,
      businessTitle: null,
      categoryId: null,
      district: null,
      city: null,
      foundedDate: null,
      numberOfEmployees: null,
      description: null,
      url: null,
      revenueTime: null,
      revenue: null,
      profittime: null,
      profit: null,
      price: null,
      profitMargen: null,
      multiple: null,
      capitalRecovery: null,
      username: null,
      userId: null,
      assets: [{ name: null, price: null, purchaseYear: null, quantity: null }],
      liabilities: [
        { name: null, price: null, purchaseYear: null, quantity: null },
      ],
      inventoryItems: [
        { name: null, price: null, purchaseYear: null, quantity: null },
      ],
      supportDuration: null,
      supportSession: null,
      growthOpportunities: null,
      reason: null,
      documents: [
        {
          title: null,
          fileName: null,
          fileType: null,
          filePath: null,
          description: null,
        },
      ],
    };
  });

  useEffect(() => {
    if (editData?.getBusinessById?.business && editBusinessId) {
      const business = editData.getBusinessById.business;

      const revTime = business.revenueTime;
      const profTime = business.profittime;
      const revenueTimeValue = revTime === "6" || revTime === 6 ? 1 : 2;
      const profitTimeValue = profTime === "6" || profTime === 6 ? 1 : 2;

      setBusinessData({
        isByTakbeer: business.isByTakbeer,
        businessTitle: business.businessTitle,
        categoryId: business.category?.id,
        categoryName:
          business.category?.name || business.category?.arabicName || null,
        district: business.district,
        city: business.city,
        foundedDate: business.foundedDate ? dayjs(business.foundedDate) : null,
        numberOfEmployees: business.numberOfEmployees,
        description: business.description,
        url: business.url,
        revenueTime: revenueTimeValue,
        revenue: business.revenue,
        profittime: profitTimeValue,
        profit: business.profit,
        price: business.price,
        profitMargen: business.profitMargen,
        multiple: business.multiple,
        capitalRecovery: business.capitalRecovery,
        username: business.seller?.name || null,
        userId: business.seller?.id || null,
        assets:
          business.assets?.length > 0
            ? business.assets
            : [{ name: null, price: null, purchaseYear: null, quantity: null }],
        liabilities:
          business.liabilities?.length > 0
            ? business.liabilities
            : [{ name: null, price: null, purchaseYear: null, quantity: null }],
        inventoryItems:
          business.inventoryItems?.length > 0
            ? business.inventoryItems
            : [{ name: null, price: null, purchaseYear: null, quantity: null }],
        supportDuration: business.supportDuration,
        supportSession: business.supportSession,
        growthOpportunities: business.growthOpportunities,
        reason: business.reason,
        documents:
          business.documents?.length > 0
            ? business.documents
            : [
                {
                  title: null,
                  fileName: null,
                  fileType: null,
                  filePath: null,
                  description: null,
                },
              ],
      });
    }
  }, [editData, editBusinessId]);

  const steps = [
    {
      title: t("Business Details"),
      content: (
        <BusinessDetailStep
          ref={businessDetailFormRef}
          data={businessData}
          setData={setBusinessData}
          editBusinessId={editBusinessId}
        />
      ),
    },
    {
      title: t("Financial & Growth Information"),
      content: (
        <FinancialInfoStep
          ref={businessDetailFormRef}
          data={businessData}
          setData={setBusinessData}
        />
      ),
    },
    {
      title: t("Business Vision"),
      content: (
        <BusinessVisionStep
          ref={businessDetailFormRef}
          data={businessData}
          setData={setBusinessData}
        />
      ),
    },
    {
      title: t("Document Uploads"),
      content: (
        <UploadSupportDocStep
          ref={businessDetailFormRef}
          data={businessData}
          setData={setBusinessData}
        />
      ),
    },
  ];

  const onChange = (value) => setCurrent(value);

  const next = async () => {
    try {
      if (businessDetailFormRef.current) {
        await businessDetailFormRef.current.validate();
      }

      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    } catch {
      //
    }
  };

  const prev = () => {
    if (current === 0) {
      setIsCancel(true);
    } else if (current === steps.length - 1 && isPreview) {
      setIsPreview(false);
    } else {
      setCurrent(current - 1);
      setIsPreview(false);
    }
  };

  const items = steps.map((item, index) => ({
    key: item.title,
    title: (
      <span
        className={`custom-step-title ${current >= index ? "completed" : ""}`}
      >
        {item.title}
      </span>
    ),
  }));

  // Check if CR document and support documents are uploaded for last step
  const isCRDocumentUploaded = () => {
    const docs = Array.isArray(businessData?.documents)
      ? businessData.documents
      : [];
    const crDoc = docs.find(
      (d) => d.title === "Commercial Registration (CR)" && d.filePath
    );
    return !!crDoc;
  };

  const isSupportDocumentUploaded = () => {
    const docs = Array.isArray(businessData?.documents)
      ? businessData.documents
      : [];
    const supportDocs = docs.filter(
      (d) => d.title === "Supporting Document" && d.filePath
    );
    return supportDocs.length > 0;
  };

  const areRequiredDocumentsUploaded = () => {
    return isCRDocumentUploaded() && isSupportDocumentUploaded();
  };

  // Determine if user can publish (on last step with all required documents uploaded)
  const canPublish =
    current === steps.length - 1 && areRequiredDocumentsUploaded();
  // Remove showNextButton - validation now happens in component itself

  const handleCreateListing = async () => {
    // Validate current step (last step) before publishing
    try {
      if (businessDetailFormRef.current) {
        await businessDetailFormRef.current.validate();
      }
    } catch (error) {
      console.error("Validation failed:", error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { categoryName, username, userId, recoveryTime, ...rest } =
      businessData;
    try {
      const inputData = {
        ...rest,
        createdBy: businessData.userId,
        revenueTime: businessData.revenueTime === 1 ? "6" : "12",
        profittime: businessData.profittime === 1 ? "6" : "12",
        capitalRecovery: parseFloat(businessData.capitalRecovery),
        revenue: parseFloat(businessData.revenue),
        profit: parseFloat(businessData.profit),
        price: parseFloat(businessData.price),
        profitMargen: parseFloat(businessData.profitMargen),
        multiple: parseFloat(businessData.multiple),

        assets: businessData.assets
          .filter(
            (asset) =>
              asset &&
              Object.values(asset).some(
                (val) => val !== null && val !== "" && val !== undefined
              )
          )
          .map((asset) => ({
            name: asset.name,
            price: parseFloat(asset.price),
            purchaseYear: parseInt(asset.purchaseYear),
            quantity: parseInt(asset.quantity),
          })),

        liabilities: businessData.liabilities
          .filter(
            (liability) =>
              liability &&
              Object.values(liability).some(
                (val) => val !== null && val !== "" && val !== undefined
              )
          )
          .map((liability) => ({
            name: liability.name,
            price: parseFloat(liability.price),
            purchaseYear: parseInt(liability.purchaseYear),
            quantity: parseInt(liability.quantity),
          })),

        // ✅ Cleaned inventoryItems
        inventoryItems: businessData.inventoryItems
          .filter(
            (item) =>
              item &&
              Object.values(item).some(
                (val) => val !== null && val !== "" && val !== undefined
              )
          )
          .map((item) => ({
            name: item.name,
            price: parseFloat(item.price),
            purchaseYear: parseFloat(item.purchaseYear),
            quantity: parseInt(item.quantity),
          })),

        supportDuration: parseInt(businessData.supportDuration),
        supportSession: parseInt(businessData.supportSession),
        growthOpportunities: businessData.growthOpportunities,
        reason: businessData.reason,

        // ✅ Cleaned documents (strip Apollo/client fields)
        documents: businessData.documents
          .filter(
            (doc) =>
              doc &&
              Object.values(doc).some(
                (val) => val !== null && val !== "" && val !== undefined
              )
          )
          .map((doc) => {
            // Remove fields not accepted by CreateDocumentInput
            const safeDoc = { ...doc };
            delete safeDoc.size;
            delete safeDoc.__typename;
            delete safeDoc.id;
            return safeDoc;
          }),
      };

      // Add ID for update
      if (editBusinessId) {
        inputData.id = editBusinessId;
      }

      const variables = { input: inputData };

      const { data } = editBusinessId
        ? await updateBusiness({ variables })
        : await createBusiness({ variables });

      if (data?.createBusiness?.id || data?.updateBusiness?.id) {
        if (editBusinessId) {
          messageApi.success(t("Business updated successfully!"));
          // Navigate back to profile after 1 second
          setTimeout(() => {
            navigate("/businesslist");
          }, 1000);
        } else {
          setReviewModal(true);
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY);

        setBusinessData({
          isByTakbeer: null,
          businessTitle: null,
          categoryId: null,
          district: null,
          city: null,
          foundedDate: null,
          numberOfEmployees: null,
          description: null,
          url: null,
          revenueTime: null,
          revenue: null,
          profittime: null,
          profit: null,
          price: null,
          profitMargen: null,
          multiple: null,
          capitalRecovery: null,
          username: null,
          userId: null,
          assets: [
            { name: null, price: null, purchaseYear: null, quantity: null },
          ],
          liabilities: [
            { name: null, price: null, purchaseYear: null, quantity: null },
          ],
          inventoryItems: [
            { name: null, price: null, purchaseYear: null, quantity: null },
          ],
          supportDuration: null,
          supportSession: null,
          growthOpportunities: null,
          reason: null,
          documents: [
            {
              title: null,
              fileName: null,
              fileType: null,
              filePath: null,
              description: null,
            },
          ],
        });

        setCurrent(0);
      } else {
        messageApi.error(
          t("Failed to create business listing: No ID returned")
        );
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to create business listing"));
    }
  };

  const handleSaveDraft = () => {
    const cleanedBusinessData = {
      ...businessData,
      documents: businessData.documents
        .filter(
          (doc) =>
            doc &&
            Object.values(doc).some(
              (val) => val !== null && val !== "" && val !== undefined
            )
        )
        .map((doc) => {
          const cleaned = { ...doc };
          delete cleaned.size;
          delete cleaned.__typename;
          delete cleaned.id;
          return cleaned;
        }),
      assets: businessData.assets.filter(
        (asset) =>
          asset &&
          Object.values(asset).some(
            (val) => val !== null && val !== "" && val !== undefined
          )
      ),
      liabilities: businessData.liabilities.filter(
        (liability) =>
          liability &&
          Object.values(liability).some(
            (val) => val !== null && val !== "" && val !== undefined
          )
      ),
      inventoryItems: businessData.inventoryItems.filter(
        (item) =>
          item &&
          Object.values(item).some(
            (val) => val !== null && val !== "" && val !== undefined
          )
      ),
    };

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(cleanedBusinessData)
    );
    messageApi.success(t("Draft saved locally!"));
  };

  useEffect(() => {
    document
      .querySelectorAll('.ant-steps-item-container[role="button"]')
      .forEach((el) => {
        el.removeAttribute("role");
      });
  }, []);

  return (
    <>
      {contextHolder}
      <div className="padd mb-2">
        <div className="container">
          <Flex vertical gap={25} className="mt-3">
            <Breadcrumb
              separator={
                <Text className="text-gray">
                  <RightOutlined className="fs-10" />
                </Text>
              }
              items={[
                {
                  title: (
                    <Text
                      className="fs-13 text-gray cursor"
                      onClick={() => navigate("/businesslist")}
                    >
                      {t("Home")}
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text className="fw-500 fs-13 text-black">
                      {editBusinessId ? t("Edit Business") : t("Create a List")}
                    </Text>
                  ),
                },
              ]}
            />
            <Steps
              current={current}
              onChange={onChange}
              items={items}
              progressDot={(dot, { index }) => (
                <span
                  className={`custom-dot ${
                    current > index ? "completed" : ""
                  } ${current === index ? "active" : ""}`}
                >
                  {current > index ? <CheckOutlined /> : dot}
                </span>
              )}
              className="mt-3 steps-create"
            />
            <div className="step-content">{steps[current].content}</div>

            <Flex justify={"space-between"} gap={5} align="center">
              {current === 0 ? (
                <Button
                  type="button"
                  className="btn border-gray text-black"
                  onClick={() => setIsCancel(true)}
                >
                  {t("Cancel")}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn border-gray text-black"
                  onClick={prev}
                >
                  {t("Previous")}
                </Button>
              )}
              <Flex gap={10} justify="end">
                <Button
                  className="btn text-black border-gray"
                  onClick={handleSaveDraft}
                >
                  {t("Save as Draft")}
                </Button>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    className="btn bg-brand"
                    onClick={next}
                  >
                    {t("Next")}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Tooltip
                    title={
                      !canPublish
                        ? t(
                            "Please upload Commercial Registration (CR) and at least one Supporting Document"
                          )
                        : ""
                    }
                  >
                    <Button
                      type="primary"
                      disabled={!canPublish || loading || editDataLoading}
                      loading={loading}
                      className={`btn ${canPublish ? "bg-brand" : ""}`}
                      style={
                        !canPublish
                          ? {
                              backgroundColor: "#d9d9d9",
                              borderColor: "#d9d9d9",
                              color: "rgba(0, 0, 0, 0.25)",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                      onClick={handleCreateListing}
                    >
                      {editBusinessId ? t("Update Business") : t("Publish")}
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </Flex>
        </div>
        <CancelModal
          visible={iscancel}
          onClose={() => setIsCancel(false)}
          onConfirm={() => navigate("/businesslist")}
        />
        <BusinesslistingReviewModal
          visible={reviewmodal}
          onClose={() => setReviewModal(false)}
          onCreate={handleCreateListing}
        />
      </div>
    </>
  );
};

export { CreateBusinessList };
