import { Flex } from "antd";
import {
  BankAccountCard,
  CommissionSocial,
  ModuleTopHeading,
  PasswordManager,
} from "../../components";
import { GET_SETTINGS } from "../../graphql/query";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { data } = useQuery(GET_SETTINGS);

  const comssionSocial = data?.getSetting
    ? {
        id: data.getSetting.id,
        commissionRate: data.getSetting.commissionRate,
        facebook: data.getSetting.faceBook,
        instagram: data.getSetting.instagram,
        twitter: data.getSetting.x,
        email: data.getSetting.email,
        whatsapp: data.getSetting.whatsApp,
        language: data.getSetting.language,
      }
    : null;

  useEffect(() => {
    const backendLang = comssionSocial?.language?.toLowerCase();
    const storedLang = localStorage.getItem("lang");
    const finalLang = backendLang || storedLang || "en";
    i18n.changeLanguage(finalLang);
    localStorage.setItem("lang", finalLang);
    document.documentElement.setAttribute(
      "dir",
      finalLang === "ar" ? "rtl" : "ltr",
    );
  }, [comssionSocial?.language, i18n]);

  const settingId = comssionSocial ? comssionSocial.id : null;
  return (
    <Flex vertical gap={20}>
      <ModuleTopHeading level={4} name={t("Settings")} />
      <CommissionSocial comssionSocial={comssionSocial} />
      <PasswordManager />
      <BankAccountCard settingId={settingId} />
    </Flex>
  );
};

export { SettingsPage };
