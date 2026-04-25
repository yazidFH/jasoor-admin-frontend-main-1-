import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  Card,
  Col,
  Flex,
  Form,
  Image,
  Radio,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { MyDatepicker, MyInput, MySelect } from "../../Forms";
import { teamsizeOp } from "../../../data";
import { GET_CATEGORIES } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { CUSTOMER } from "../../../graphql/query";
import { useFormatNumber } from "../../../hooks";
import { useCities, useDistricts } from "../../../shared";
import { ModuleTopHeading } from "../../PageComponents";

const { Text } = Typography;
const BusinessDetailStep = forwardRef(
  ({ data, setData, editBusinessId }, ref) => {
    const { t } = useTranslation();
    const { formatPhone } = useFormatNumber();
    const district = useDistricts();
    const cities = useCities();
    const { data: categoryData } = useQuery(GET_CATEGORIES);
    const { data: customer } = useQuery(CUSTOMER);
    const [form] = Form.useForm();
    const [isAccess, setIsAccess] = useState(data.isByTakbeer === true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useImperativeHandle(ref, () => ({
      validate: () => form.validateFields(),
    }));

    const categories = useMemo(
      () =>
        categoryData?.getAllCategories?.categories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          arabicName: cat.arabicName,
          isDigital: cat.isDigital,
        })) || [],
      [categoryData]
    );

    const handleRadioChange = (e) => {
      setIsAccess(e.target.value === 2);
    };

    const handleFormChange = (_, allValues) => {
      const selected = categories.find((c) => c.name === allValues.category);
      const categoryId = selected?.id;

      // Find the selected user from customer list
      const selectedUser = customer?.getCustomers?.find(
        (u) => u?.id === allValues.username
      );
      const userName = selectedUser?.name || null;

      setSelectedCategory(allValues.category);
      setData((prev) => ({
        ...prev,
        isByTakbeer: isAccess,
        businessTitle: allValues.title,
        categoryName: allValues.category,
        categoryId: categoryId,
        district: allValues.district,
        city: allValues.city,
        foundedDate: allValues.dob,
        numberOfEmployees: allValues.teamSize,
        description: allValues.description,
        url: allValues.url,
        username: userName,
        userId: allValues.username,
      }));
    };

    useEffect(() => {
      if (!isInitialized && data) {
        setIsAccess(data.isByTakbeer === true);

        const initialTeamSize = (() => {
          if (!data.numberOfEmployees) return undefined;
          const byName = teamsizeOp.find(
            (opt) => String(opt.name) === String(data.numberOfEmployees)
          );
          if (byName) return byName.name;
          const byId = teamsizeOp.find(
            (opt) => String(opt.id) === String(data.numberOfEmployees)
          );
          return byId ? byId.name : undefined;
        })();

        form.setFieldsValue({
          title: data.businessTitle,
          category: data.categoryName,
          district: data.district,
          city: data.city,
          dob: data.foundedDate,
          teamSize: initialTeamSize,
          description: data.description,
          url: data.url,
          username: data.userId || null,
        });

        setIsInitialized(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isInitialized]);

    // After options load, derive dependent UI state (selected district/cat) without overwriting form values
    useEffect(() => {
      if (!data) return;
      if (data.district && district.length > 0) {
        const districtObj =
          district.find((d) => d.name === data.district) ||
          district.find((d) => d.id === String(data.district).toLowerCase());
        if (districtObj) setSelectedDistrict(districtObj.id);
      }
      if (data.categoryId && categories.length > 0) {
        const cat = categories.find((cat) => cat.id === data.categoryId);
        if (cat) setSelectedCategory(cat);
      }
    }, [data, district, categories]);

    // Once options are available, ensure ALL fields show initial values if they were set before options loaded
    useEffect(() => {
      if (!data) return;
      const current = form.getFieldsValue([
        "title",
        "category",
        "district",
        "city",
        "dob",
        "teamSize",
        "description",
        "url",
        "username",
      ]);

      // Normalize team size to the label the Select expects
      const initialTeamSize = (() => {
        if (!data.numberOfEmployees) return undefined;
        const byName = teamsizeOp.find(
          (opt) => String(opt.name) === String(data.numberOfEmployees)
        );
        if (byName) return byName.name;
        const byId = teamsizeOp.find(
          (opt) => String(opt.id) === String(data.numberOfEmployees)
        );
        return byId ? byId.name : undefined;
      })();

      const patch = {};
      if (!current.title && data.businessTitle)
        patch.title = data.businessTitle;
      if (!current.category && data.categoryName)
        patch.category = data.categoryName;
      if (!current.district && data.district) patch.district = data.district;
      // Re-apply city once district options are ready
      if (!current.city && data.city && selectedDistrict)
        patch.city = data.city;
      if (!current.dob && data.foundedDate) patch.dob = data.foundedDate;
      if (!current.teamSize && initialTeamSize)
        patch.teamSize = initialTeamSize;
      if (!current.description && data.description)
        patch.description = data.description;
      if (!current.url && data.url) patch.url = data.url;
      if (!current.username && data.userId) patch.username = data.userId;

      if (Object.keys(patch).length > 0) form.setFieldsValue(patch);
    }, [categories.length, district.length, selectedDistrict, data, form]);

    return (
      <>
        <Flex
          justify="space-between"
          className="mb-3"
          gap={10}
          wrap
          align="flex-start"
        >
          <Flex vertical gap={1}>
            <ModuleTopHeading
              level={4}
              name={t("Tell us about your business")}
            />
            <Text className="text-gray">
              {t("Let's start with the basic business information")}
            </Text>
          </Flex>
          <Flex className="pill-round" gap={8} align="center">
            <Image
              src="/assets/icons/info-b.png"
              preview={false}
              width={16}
              alt={t("info icon")}
            />
            <Text className="fs-12 text-sky">
              {t("For any query, contact us on")}{" "}
              {formatPhone("+966 543 543 654")}
            </Text>
          </Flex>
        </Flex>

        <Card className="shadow-d radius-12 border-gray">
          <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
            <Row gutter={24}>
              <Col span={24}>
                <Flex>
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={isAccess ? 2 : 1}
                    className="mb-3 margintop-5"
                  >
                    <Radio value={1} className="fs-14">
                      <Flex gap={3} align="center">
                        {t("Sell business by Acquiring")}
                        <Tooltip
                          title={t(
                            "Acquisition means a full purchase of the business, including its brand, trade name, CR, assets, and even liabilities."
                          )}
                        >
                          <img
                            src="/assets/icons/info.png"
                            width={20}
                            alt={t("acquiring-icon")}
                            fetchPriority="high"
                          />
                        </Tooltip>
                      </Flex>
                    </Radio>
                    <Radio value={2} className="fs-14">
                      <Flex gap={3} align="center">
                        {t("Sell business by Takbeel")}
                        <Tooltip
                          title={t(
                            "Taqbeel refers to transferring a business by buying only the assets such as equipment or contracts without purchasing the trade name, brand, or commercial registration."
                          )}
                        >
                          <img
                            src="/assets/icons/info.png"
                            width={20}
                            alt={t("takbeel-icon")}
                            fetchPriority="high"
                          />
                        </Tooltip>
                      </Flex>
                    </Radio>
                  </Radio.Group>
                </Flex>
              </Col>

              <Col span={24}>
                <MySelect
                  label={t("Username")}
                  name="username"
                  required
                  message={t("Please select user")}
                  placeholder={t("Select user")}
                  showKey
                  disabled={Boolean(editBusinessId)}
                  options={
                    customer?.getCustomers?.map((user, index) => ({
                      name: user?.name || "Unnamed User",
                      id: user?.id || `temp-${index}`,
                    })) || []
                  }
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MyInput
                  label={t("Business Title")}
                  name="title"
                  required
                  message={t("Please enter title")}
                  placeholder={t("Write business name")}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label={t("Business Category")}
                  name="category"
                  required
                  message={t("Choose business category")}
                  options={categories}
                  placeholder={t("Choose business category")}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label={t("Region")}
                  name="district"
                  required
                  message={t("Choose region")}
                  placeholder={t("Choose region")}
                  options={district}
                  onChange={(val) => {
                    // Find district by name
                    const selectedDistrictObj = district.find(
                      (d) => d.name === val
                    );
                    // Store the district ID for cities lookup
                    setSelectedDistrict(selectedDistrictObj?.id || null);
                    form.setFieldValue("city", undefined);
                  }}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label={t("City")}
                  name="city"
                  required
                  message={t("Choose city")}
                  disabled={!selectedDistrict}
                  options={
                    selectedDistrict ? cities[selectedDistrict] || [] : []
                  }
                  placeholder={t("Choose city")}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MyDatepicker
                  datePicker
                  picker="year"
                  label={t("Foundation Date")}
                  name="dob"
                  required
                  message={t("Please enter foundation date")}
                  placeholder={t("Enter foundation date")}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label={t("Team Size")}
                  name="teamSize"
                  required
                  message={t("Choose team size")}
                  options={teamsizeOp}
                  placeholder={t("Enter team size")}
                />
              </Col>

              <Col span={24}>
                <MyInput
                  textArea
                  label={t("Description")}
                  name="description"
                  placeholder={t("Write description about your business")}
                  required
                  message={t("Please enter description")}
                  rows={5}
                  showCount
                  maxLength={200}
                />
              </Col>

              <Col span={24}>
                <MyInput
                  label={t("Business Website Url")}
                  name="url"
                  placeholder={t("Add website url")}
                  required={selectedCategory?.isDigital}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </>
    );
  }
);

export { BusinessDetailStep };
