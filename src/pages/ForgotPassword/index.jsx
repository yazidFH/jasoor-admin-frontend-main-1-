import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Image,
  Flex,
  Dropdown,
  Space,
  message,
} from "antd";
import { MyInput } from "../../components";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import {
  REQUEST_PASSWORD_RESET,
  VERIFY_PASSWORD_RESET_OTP,
  RESET_PASSWORD_WITH_TOKEN,
} from "../../graphql/mutation";

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [requestState, setRequestState] = useState("request");
  const [emailValue, setEmailValue] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [language, setLanguage] = useState();
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.png",
  });

  // GraphQL mutations
  const [requestPasswordReset, { loading: requestLoading }] = useMutation(
    REQUEST_PASSWORD_RESET
  );
  const [verifyPasswordResetOTP, { loading: verifyLoading }] = useMutation(
    VERIFY_PASSWORD_RESET_OTP
  );
  const [resetPasswordWithToken, { loading: resetLoading }] = useMutation(
    RESET_PASSWORD_WITH_TOKEN
  );

  // Email masking function
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];
    return `${firstChar}${"*".repeat(
      localPart.length - 2
    )}${lastChar}@${domain}`;
  };

  const forgotpass = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (requestState === "request") {
        // Step 1: Request OTP
        const { data } = await requestPasswordReset({
          variables: { email: values.email },
        });

        if (data?.requestPasswordReset?.success) {
          setEmailValue(values.email);
          setMaskedEmail(maskEmail(values.email));
          messageApi.success(t("OTP has been sent to your email address."));
          setRequestState("otp");
        } else {
          messageApi.error(
            data?.requestPasswordReset?.message ||
              t("Failed to send OTP. Please try again.")
          );
        }
      } else if (requestState === "otp") {
        // Step 2: Verify OTP and get reset token
        const { data } = await verifyPasswordResetOTP({
          variables: {
            email: emailValue,
            otp: values.otp,
          },
        });

        if (data?.verifyPasswordResetOTP?.success) {
          setResetToken(data.verifyPasswordResetOTP.resetToken);
          messageApi.success(
            t("OTP verified successfully. You may now reset your password.")
          );
          setRequestState("reset");
        } else {
          messageApi.error(t("Invalid or expired OTP. Please try again."));
        }
      } else if (requestState === "reset") {
        // Step 3: Reset password with token
        const { data } = await resetPasswordWithToken({
          variables: {
            resetToken: resetToken,
            newPassword: values.password,
          },
        });

        if (data?.resetPasswordWithToken?.success) {
          messageApi.success(t("Password has been reset successfully."));

          // Reset form and state
          form.resetFields();
          setEmailValue("");
          setMaskedEmail("");
          setResetToken("");
          setRequestState("request");

          // Redirect to login after 1.5 seconds
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          const errorMessage = data?.resetPasswordWithToken?.message || "";

          // Check if token expired
          if (
            errorMessage.toLowerCase().includes("expired") ||
            errorMessage.toLowerCase().includes("invalid token")
          ) {
            messageApi.error(t("Reset token has expired. Please start over."));

            // Reset and redirect to email step after 2 seconds
            setTimeout(() => {
              form.resetFields();
              setEmailValue("");
              setMaskedEmail("");
              setResetToken("");
              setRequestState("request");
            }, 2000);
          } else {
            messageApi.error(
              errorMessage || t("Failed to reset password. Please try again.")
            );
          }
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        messageApi.error(error.graphQLErrors[0].message);
      } else if (error.networkError) {
        messageApi.error(t("Network error. Please check your connection."));
      } else {
        messageApi.error(t("An error occurred. Please try again."));
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const { data } = await requestPasswordReset({
        variables: { email: emailValue },
      });

      if (data?.requestPasswordReset?.success) {
        messageApi.success(t("A new OTP has been sent to your email."));
      } else {
        messageApi.error(t("Failed to resend OTP. Please try again."));
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      messageApi.error(t("Failed to resend OTP. Please try again."));
    }
  };

  const handleBackNavigation = () => {
    if (requestState === "otp") {
      form.resetFields(["otp"]);
      setRequestState("request");
    } else if (requestState === "reset") {
      form.resetFields(["password", "confirmationPassword"]);
      setRequestState("otp");
    }
  };

  const handleChange = (value) => {
    setLanguage(value);
    localStorage.setItem("lang", value);
    i18n?.changeLanguage(value);
  };

  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image
            src="assets/icons/en.png"
            width={20}
            alt="English"
            fetchPriority="high"
            preview={false}
          />
          <Text className="fs-13">EN</Text>
        </Space>
      ),
      onClick: () => {
        setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
          setLanguage("en");
        handleChange("en");
      },
    },
    {
      key: "2",
      label: (
        <Space>
          <Image
            src="assets/icons/ar.png"
            width={20}
            alt="Arabic"
            fetchPriority="high"
            preview={false}
          />
          <Text className="fs-13">AR</Text>
        </Space>
      ),
      onClick: () => {
        setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
          setLanguage("ar");
        handleChange("ar");
      },
    },
  ];

  return (
    <Row className="signup-page">
      {contextHolder}
      <Col xs={24} sm={24} md={12} lg={16} className="signup-form-container">
        <div className="form-inner">
          <NavLink to={"/"}>
            <div className="logo">
              <img
                src="/assets/images/logo-1.png"
                alt="jusoor logo"
                width={70}
                fetchPriority="high"
              />
            </div>
          </NavLink>
          <div>
            {requestState === "otp" ? (
              <Button
                aria-labelledby="Arrow left"
                type="button"
                onClick={handleBackNavigation}
                ghost
                className="text-black fs-18 p-0 border-0"
              >
                {isArabic ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
              </Button>
            ) : requestState === "reset" ? (
              <Button
                aria-labelledby="Arrow left"
                type="button"
                onClick={handleBackNavigation}
                ghost
                className="text-black fs-18 p-0 border-0"
              >
                {isArabic ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
              </Button>
            ) : null}
          </div>
          <Title level={3}>
            {requestState === "request" && t("Forget Password")}
            {requestState === "otp" && t("OTP")}
            {requestState === "reset" && t("Set a New Password")}
          </Title>
          <Paragraph>
            {requestState === "request" &&
              t("Enter the email address to send you the OTP code.")}
            {requestState === "otp" && (
              <>
                {t("Enter the 6 digit OTP code sent to")}{" "}
                {maskedEmail || emailValue}
              </>
            )}
            {requestState === "reset" &&
              t(
                "Your OTP has been verified. Please create a strong new password to secure your account."
              )}
          </Paragraph>
          <Form layout="vertical" form={form} requiredMark={false}>
            <Row>
              {requestState === "request" && (
                <Col span={24}>
                  <MyInput
                    label={t("Email Address")}
                    name="email"
                    required
                    message={t("Please enter Email Address")}
                    placeholder={t("Enter Email Address")}
                  />
                </Col>
              )}
              {requestState === "otp" && (
                <Col span={24}>
                  <MyInput
                    oTp
                    length={6}
                    label={t("OTP")}
                    name="otp"
                    type="number"
                    required
                    message={t("Please enter the OTP sent to your email")}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-100"
                  />
                </Col>
              )}
              {requestState === "reset" && (
                <>
                  <Col span={24}>
                    <MyInput
                      label={t("New Password")}
                      type="password"
                      name="password"
                      size="large"
                      required
                      message={() => {}}
                      placeholder={t("Enter new password")}
                      validator={({ getFieldValue }) => ({
                        validator: (_, value) => {
                          const reg =
                            /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                          if (!reg.test(value)) {
                            return Promise.reject(
                              new Error(
                                t(
                                  "Password should contain at least 8 characters, one uppercase letter, one number, one special character"
                                )
                              )
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      })}
                    />
                  </Col>
                  <Col span={24}>
                    <MyInput
                      label={t("Confirm Password")}
                      type="password"
                      name="confirmationPassword"
                      size="large"
                      dependencies={["password"]}
                      required
                      message={t("Please enter confirm password")}
                      placeholder={t("Re-enter new password")}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                t("The password that you entered do not match!")
                              )
                            );
                          },
                        }),
                      ]}
                    />
                  </Col>
                </>
              )}
              <Col span={24}>
                <Button
                  aria-labelledby="submit button"
                  htmlType="submit"
                  className="btnsave bg-dark-blue text-white fs-16"
                  block
                  onClick={forgotpass}
                  loading={requestLoading || verifyLoading || resetLoading}
                  disabled={requestLoading || verifyLoading || resetLoading}
                >
                  {requestState === "request" && t("Send OTP")}
                  {requestState === "otp" && t("Verify OTP")}
                  {requestState === "reset" && t("Reset Password")}
                </Button>
              </Col>
              <Col span={24}>
                <Paragraph className="text-center mt-2">
                  {requestState === "request" && (
                    <>
                      {" "}
                      {t("Remember Password?")}{" "}
                      <NavLink to={"/login"}>{t("Sign In")}</NavLink>
                    </>
                  )}
                  {requestState === "otp" && (
                    <>
                      {" "}
                      {t("Didn't receive code?")}{" "}
                      <a
                        onClick={handleResendOTP}
                        style={{ cursor: "pointer" }}
                      >
                        {t("Resend")}
                      </a>
                    </>
                  )}
                  {requestState === "reset" && null}
                </Paragraph>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>

      <Col xs={0} sm={0} md={12} lg={8} className="signup-visual-container">
        <Dropdown
          menu={{ items: lang }}
          trigger={["click"]}
          onChange={handleChange}
          className="lang-dropdown"
          value={language}
        >
          <Button
            onClick={(e) => e.preventDefault()}
            className="bg-transparent btn-outline btn p-2 border-white"
            aria-labelledby="language"
          >
            <Space align="center">
              <Image
                src={selectedLang.icon}
                width={20}
                alt={selectedLang.label}
                preview={false}
                fetchPriority="high"
              />
              <Text className="text-white fs-13">{selectedLang.label}</Text>
              <DownOutlined className="text-white" />
            </Space>
          </Button>
        </Dropdown>
        <Flex vertical justify="space-between" className="h-100">
          <Flex vertical justify="center" align="center" className="logo-sp">
            <Image
              src="/assets/images/logo.webp"
              alt="jusoor-logo"
              fetchPriority="high"
              width={200}
              preview={false}
            />
            <Title level={5} className="m-0 text-white text-center">
              Shorten the path
            </Title>
          </Flex>
          <div className="bg-shade">
            <img
              src="/assets/images/login.gif"
              alt="signup gif"
              className="w-100 opacity-7"
              fetchPriority="high"
            />
          </div>
        </Flex>
      </Col>
    </Row>
  );
};

export { ForgotPassword };
