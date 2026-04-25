import { t } from "i18next";

const district = [
  {
    id: 1,
    name: t("Riyadh"),
    value: "riyadh",
  },
  {
    id: 2,
    name: t("Makkah"),
    value: "makkah",
  },
  {
    id: 3,
    name: t("Madinah"),
    value: "madinah",
  },
  {
    id: 4,
    name: t("Eastern Province"),
    value: "eastern-province",
  },
  {
    id: 5,
    name: t("Qassim"),
    value: "qassim",
  },
  {
    id: 6,
    name: t("Asir"),
    value: "asir",
  },
  {
    id: 7,
    name: t("Tabuk"),
    value: "tabuk",
  },
  {
    id: 8,
    name: t("Hail"),
    value: "hail",
  },
  {
    id: 9,
    name: t("Northern Borders"),
    value: "northern-borders",
  },
  {
    id: 10,
    name: t("Al Jouf"),
    value: "al-jouf",
  },
  {
    id: 11,
    name: t("Jazan"),
    value: "jazan",
  },
  {
    id: 12,
    name: t("Najran"),
    value: "najran",
  },
  {
    id: 13,
    name: t("Al Baha"),
    value: "al-baha",
  },
];

const cities = {
  riyadh: [
    { id: 1, name: t("Riyadh"), value: "riyadh" },
    { id: 2, name: t("Al Kharj"), value: "al-kharj" },
    { id: 3, name: t("Al Dawadmi"), value: "al-dawadmi" },
    { id: 4, name: t("Al Majmaah"), value: "al-majmaah" },
    { id: 5, name: t("Wadi Al Dawasir"), value: "wadi-al-dawasir" },
    { id: 6, name: t("Az Zulfi"), value: "az-zulfi" },
  ],
  makkah: [
    { id: 7, name: t("Makkah"), value: "makkah" },
    { id: 8, name: t("Jeddah"), value: "jeddah" },
    { id: 9, name: t("Taif"), value: "taif" },
    { id: 10, name: t("Al Qunfudhah"), value: "al-qunfudhah" },
    { id: 11, name: t("Rabigh"), value: "rabigh" },
  ],
  madinah: [
    { id: 12, name: t("Madinah"), value: "madinah" },
    { id: 13, name: t("Yanbu"), value: "yanbu" },
    { id: 14, name: t("Khaybar"), value: "khaybar" },
    { id: 15, name: t("Al Ula"), value: "al-ula" },
  ],
  qassim: [
    { id: 16, name: t("Buraydah"), value: "buraydah" },
    { id: 17, name: t("Unaizah"), value: "unaizah" },
    { id: 18, name: t("Ar Rass"), value: "ar-rass" },
    { id: 19, name: t("Al Bukayriyah"), value: "al-bukayriyah" },
  ],
  "eastern-province": [
    { id: 20, name: t("Dammam"), value: "dammam" },
    { id: 21, name: t("Khobar"), value: "khobar" },
    { id: 22, name: t("Dhahran"), value: "dhahran" },
    { id: 23, name: t("Jubail"), value: "jubail" },
    { id: 24, name: t("Al Ahsa (Hofuf/Mubarraz)"), value: "al-ahsa" },
    { id: 25, name: t("Qatif"), value: "qatif" },
    { id: 26, name: t("Hafar Al Batin"), value: "hafar-al-batin" },
    { id: 27, name: t("Al Khafji"), value: "al-khafji" },
  ],
  asir: [
    { id: 28, name: t("Abha"), value: "abha" },
    { id: 29, name: t("Khamis Mushait"), value: "khamis-mushait" },
    { id: 30, name: t("Mahail Asir"), value: "mahail-asir" },
    { id: 31, name: t("Bisha"), value: "bisha" },
    { id: 32, name: t("Al Namas"), value: "al-namas" },
    { id: 33, name: t("Sabt Al Alaya"), value: "sabt-al-alaya" },
  ],
  tabuk: [
    { id: 34, name: t("Tabuk"), value: "tabuk" },
    { id: 35, name: t("Al Wajh"), value: "al-wajh" },
    { id: 36, name: t("Duba"), value: "duba" },
    { id: 37, name: t("Haql"), value: "haql" },
    { id: 38, name: t("Umluj"), value: "umluj" },
  ],
  hail: [
    { id: 39, name: t("Hail"), value: "hail" },
    { id: 40, name: t("Baqaa"), value: "baqaa" },
    { id: 41, name: t("Al Ghazalah"), value: "al-ghazalah" },
    { id: 42, name: t("Jubbah"), value: "jubbah" },
    { id: 43, name: t("Ash Shinan"), value: "ash-shinan" },
  ],
  "northern-borders": [
    { id: 44, name: t("Arar"), value: "arar" },
    { id: 45, name: t("Rafha"), value: "rafha" },
    { id: 46, name: t("Turaif"), value: "turaif" },
  ],
  "al-jouf": [
    { id: 47, name: t("Sakaka"), value: "sakaka" },
    { id: 48, name: t("Al Qurayyat"), value: "al-qurayyat" },
    { id: 49, name: t("Dumat Al Jandal"), value: "dumat-al-jandal" },
  ],
  jazan: [
    { id: 50, name: t("Jazan"), value: "jazan" },
    { id: 51, name: t("Samtah"), value: "samtah" },
    { id: 52, name: t("Abu Arish"), value: "abu-arish" },
    { id: 53, name: t("Sabya"), value: "sabya" },
  ],
  najran: [
    { id: 54, name: t("Najran"), value: "najran" },
    { id: 55, name: t("Sharurah"), value: "sharurah" },
    { id: 56, name: t("Hubuna"), value: "hubuna" },
  ],
  "al-baha": [
    { id: 57, name: t("Al Baha"), value: "al-baha" },
    { id: 58, name: t("Baljurashi"), value: "baljurashi" },
    { id: 59, name: t("Al Mandaq"), value: "al-mandaq" },
  ],
};

const teamsizeOp = [
  {
    id: 1,
    name: "1-10",
  },
  {
    id: 2,
    name: "10-20",
  },
  {
    id: 3,
    name: "20-50",
  },
  {
    id: 4,
    name: "50-100",
  },
  {
    id: 5,
    name: "100-200",
  },
  {
    id: 6,
    name: "200+",
  },
];

export { teamsizeOp, district, cities };
