import { useTranslation } from 'react-i18next';
import { formatNumberByLanguage, formatCurrencyByLanguage, formatPhoneByLanguage } from '../utils';

export const useFormatNumber = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const formatNumber = (value) => {
    return formatNumberByLanguage(value, currentLanguage);
  };
  const formatCurrency = (amount) => {
    return formatCurrencyByLanguage(amount, currentLanguage);
  };
  const formatPhone = (phone) => {
    return formatPhoneByLanguage(phone, currentLanguage);
  };
  return {
    formatNumber,
    formatCurrency,
    formatPhone,
    isArabic: currentLanguage === 'ar',
  };
};
