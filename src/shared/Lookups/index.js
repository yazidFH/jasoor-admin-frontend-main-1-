import { useTranslation } from "react-i18next";
import { t } from "i18next";

const categoriesItems = [
  { id: "1", name: "Digital Business" },
  { id: "2", name: "Physical Business" },
];

const priorityItems = [
  { id: 1, name: "Low" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
];

const useGroupItem = () => {
  const { t } = useTranslation();
  const groupselectItem = [
    { id: "OLD", name: t("Old") },
    { id: "NEW", name: t("New") },
    { id: "BOTH", name: t("Both") },
  ];
  return groupselectItem;
};

const useDistrictItem = () => {
  const { t } = useTranslation();
  const districtselectItem = [
    { id: "riyadh", name: t("Riyadh") },
    { id: "makkah", name: t("Makkah") },
    { id: "madinah", name: t("Madinah") },
    { id: "eastern-province", name: t("Eastern Province") },
    { id: "qassim", name: t("Qassim") },
    { id: "asir", name: t("Asir") },
    { id: "tabuk", name: t("Tabuk") },
    { id: "hail", name: t("Hail") },
    { id: "northern-borders", name: t("Northern Borders") },
    { id: "al-jouf", name: t("Al Jouf") },
    { id: "jazan", name: t("Jazan") },
    { id: "najran", name: t("Najran") },
    { id: "al-baha", name: t("Al Baha") },
  ];
  return districtselectItem;
};

const useDistricts = () => {
  const { t } = useTranslation();

  const districts = [
    { id: "riyadh", name: t("Riyadh") },
    { id: "makkah", name: t("Makkah") },
    { id: "madinah", name: t("Madinah") },
    { id: "eastern-province", name: t("Eastern Province") },
    { id: "qassim", name: t("Qassim") },
    { id: "asir", name: t("Asir") },
    { id: "tabuk", name: t("Tabuk") },
    { id: "hail", name: t("Hail") },
    { id: "northern-borders", name: t("Northern Borders") },
    { id: "al-jouf", name: t("Al Jouf") },
    { id: "jazan", name: t("Jazan") },
    { id: "najran", name: t("Najran") },
    { id: "al-baha", name: t("Al Baha") },
  ];

  return districts;
};

const useCities = () => {
  const { t } = useTranslation();

  const cities = {
    riyadh: [
      { id: "riyadh", name: t("Riyadh") },
      { id: "al-kharj", name: t("Al Kharj") },
      { id: "al-dawadmi", name: t("Al Dawadmi") },
      { id: "al-majmaah", name: t("Al Majmaah") },
      { id: "wadi-al-dawasir", name: t("Wadi Al Dawasir") },
      { id: "az-zulfi", name: t("Az Zulfi") },
    ],
    makkah: [
      { id: "makkah", name: t("Makkah") },
      { id: "jeddah", name: t("Jeddah") },
      { id: "taif", name: t("Taif") },
      { id: "al-qunfudhah", name: t("Al Qunfudhah") },
      { id: "rabigh", name: t("Rabigh") },
    ],
    madinah: [
      { id: "madinah", name: t("Madinah") },
      { id: "yanbu", name: t("Yanbu") },
      { id: "khaybar", name: t("Khaybar") },
      { id: "al-ula", name: t("Al Ula") },
    ],
    qassim: [
      { id: "buraydah", name: t("Buraydah") },
      { id: "unaizah", name: t("Unaizah") },
      { id: "ar-rass", name: t("Ar Rass") },
      { id: "al-bukayriyah", name: t("Al Bukayriyah") },
    ],
    "eastern-province": [
      { id: "dammam", name: t("Dammam") },
      { id: "khobar", name: t("Khobar") },
      { id: "dhahran", name: t("Dhahran") },
      { id: "jubail", name: t("Jubail") },
      { id: "al-ahsa", name: t("Al Ahsa (Hofuf/Mubarraz)") },
      { id: "qatif", name: t("Qatif") },
      { id: "hafar-al-batin", name: t("Hafar Al Batin") },
      { id: "al-khafji", name: t("Al Khafji") },
    ],
    asir: [
      { id: "abha", name: t("Abha") },
      { id: "khamis-mushait", name: t("Khamis Mushait") },
      { id: "mahail-asir", name: t("Mahail Asir") },
      { id: "bisha", name: t("Bisha") },
      { id: "al-namas", name: t("Al Namas") },
      { id: "sabt-al-alaya", name: t("Sabt Al Alaya") },
    ],
    tabuk: [
      { id: "tabuk", name: t("Tabuk") },
      { id: "al-wajh", name: t("Al Wajh") },
      { id: "duba", name: t("Duba") },
      { id: "haql", name: t("Haql") },
      { id: "umluj", name: t("Umluj") },
    ],
    hail: [
      { id: "hail", name: t("Hail") },
      { id: "baqaa", name: t("Baqaa") },
      { id: "al-ghazalah", name: t("Al Ghazalah") },
      { id: "jubbah", name: t("Jubbah") },
      { id: "ash-shinan", name: t("Ash Shinan") },
    ],
    "northern-borders": [
      { id: "arar", name: t("Arar") },
      { id: "rafha", name: t("Rafha") },
      { id: "turaif", name: t("Turaif") },
    ],
    "al-jouf": [
      { id: "sakaka", name: t("Sakaka") },
      { id: "al-qurayyat", name: t("Al Qurayyat") },
      { id: "dumat-al-jandal", name: t("Dumat Al Jandal") },
    ],
    jazan: [
      { id: "jazan", name: t("Jazan") },
      { id: "samtah", name: t("Samtah") },
      { id: "abu-arish", name: t("Abu Arish") },
      { id: "sabya", name: t("Sabya") },
    ],
    najran: [
      { id: "najran", name: t("Najran") },
      { id: "sharurah", name: t("Sharurah") },
      { id: "hubuna", name: t("Hubuna") },
    ],
    "al-baha": [
      { id: "al-baha", name: t("Al Baha") },
      { id: "baljurashi", name: t("Baljurashi") },
      { id: "al-mandaq", name: t("Al Mandaq") },
    ],
  };

  return cities;
};

const districtItems = [
  { key: "1", label: t("Makkah") },
  { key: "2", label: t("Eastern") },
  { key: "3", label: t("Al-Madinah") },
  { key: "4", label: t("Asir") },
  { key: "5", label: t("Tabuk") },
  { key: "6", label: t("Najran") },
  { key: "7", label: t("Al-Qassim") },
  { key: "8", label: t("Hail") },
  { key: "9", label: t("Al-Jouf") },
  { key: "10", label: t("Al-Bahah") },
  { key: "11", label: t("Riyadh") },
  { key: "12", label: t("Northern Borders") },
  { key: "13", label: t("Jazan") },
];

const statusItems = [
  { key: "1", label: t("All") },
  { key: "2", label: t("Active") },
  { key: "3", label: t("Inactive") },
];

const typeItems = [
  { key: "1", label: t("All") },
  { key: "2", label: t("New") },
  { key: "3", label: t("Old") },
];

const meetingItems = [
  { id: "2", name: "Scheduled" },
  { id: "3", name: "Held" },
  { id: "4", name: "Rescheduled" },
];

const pushstatusItem = [
  { id: true, name: "Send" },
  { id: false, name: "Schedule" },
];

const groupItems = [
  { id: "2", name: "New" },
  { id: "3", name: "Old" },
  { id: "4", name: "Both" },
];

const yearOp = [
  {
    key: "1",
    label: "2025",
  },
  {
    key: "2",
    label: "2024",
  },
  {
    key: "3",
    label: "2023",
  },
  {
    key: "4",
    label: "2022",
  },
  {
    key: "5",
    label: "2021",
  },
];

const langItems = [
  {
    id: "1",
    name: "English",
  },
  {
    id: "2",
    name: "Arabic",
  },
];

const revenueLookups = [
  {
    id: 1,
    name: "Last 6 Months",
  },
  {
    id: 2,
    name: "Last Year",
  },
];

export {
  categoriesItems,
  revenueLookups,
  priorityItems,
  districtItems,
  statusItems,
  typeItems,
  meetingItems,
  pushstatusItem,
  groupItems,
  useGroupItem,
  useDistrictItem,
  useDistricts,
  useCities,
  yearOp,
  langItems,
};
