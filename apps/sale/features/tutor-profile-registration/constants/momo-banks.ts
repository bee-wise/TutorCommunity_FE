export interface MomoBank {
  code: string;
  name: string;
  napasCode: string;
  logoUrl: string;
}

const bankEntries: ReadonlyArray<readonly [string, string, string]> = [
  ["VCB", "VietcomBank", "970436"],
  ["CTG", "VietinBank", "970415"],
  ["TCB", "Techcombank", "970407"],
  ["BIDV", "BIDV", "970418"],
  ["VARB", "Agribank", "970405"],
  ["NVB", "NCB", "970419"],
  ["STB", "Sacombank", "970403"],
  ["ACB", "ACB", "970416"],
  ["MB", "MBBank", "970422"],
  ["TPB", "TPBank", "970423"],
  ["SVB", "Shinhan Bank", "970424"],
  ["VIB", "VIB", "970441"],
  ["VPB", "VPBank", "970432"],
  ["SHB", "SHB", "970443"],
  ["EIB", "Eximbank", "970431"],
  ["BVB", "BaoVietBank", "970438"],
  ["VCCB", "VietCapital Bank", "970454"],
  ["SCB", "SCB", "970429"],
  ["VRB", "Vietnam-Russia Bank", "970421"],
  ["ABB", "ABBank", "970425"],
  ["PVCB", "PVcomBank", "970412"],
  ["OJB", "OceanBank", "970414"],
  ["NAB", "Nam A Bank", "970428"],
  ["HDB", "HDBank", "970437"],
  ["VB", "VietBank", "970433"],
  ["CFC", "VietCredit", "970460"],
  ["PBVN", "Public Bank Vietnam", "970439"],
  ["HLB", "Hong Leong Bank", "970442"],
  ["PGB", "PGBank", "970430"],
  ["COB", "Co-opBank", "970446"],
  ["CIMB", "CIMB Vietnam", "422589"],
  ["IVB", "Indovina Bank", "970434"],
  ["DAB", "DongA Bank", "970406"],
  ["GPB", "GPBank", "970408"],
  ["NASB", "Bac A Bank", "970409"],
  ["VAB", "VietABank", "970427"],
  ["SGB", "SaigonBank", "970400"],
  ["MSB", "MSB", "970426"],
  ["LPB", "LPBank", "970449"],
  ["KLB", "KienLongBank", "970452"],
  ["IBKHN", "IBK Hà Nội", "970455"],
  ["WOO", "Woori Bank", "970457"],
  ["SEAB", "SeABank", "970440"],
  ["UOB", "UOB Vietnam", "970458"],
  ["OCB", "OCB", "970448"],
  ["MAFC", "Mirae Asset Finance", "970468"],
  ["KEBHANAHCM", "Keb Hana TP.HCM", "970466"],
  ["KEBHANAHN", "Keb Hana Hà Nội", "970467"],
  ["STANDARD", "Standard Chartered", "970410"],
  ["CAKE", "CAKE by VPBank", "546034"],
  ["Ubank", "Ubank by VPBank", "546035"],
  ["NonghyupBankHN", "Nonghyup Bank Hà Nội", "801011"],
  ["KBHN", "Kookmin Bank Hà Nội", "970462"],
  ["KBHCM", "Kookmin Bank TP.HCM", "970463"],
  ["DBSHCM", "DBS Bank TP.HCM", "796500"],
  ["CBBank", "CBBank", "970444"],
  ["KBankHCM", "Kasikornbank TP.HCM", "668888"],
  ["HSBC", "HSBC Vietnam", "458761"],
  ["Timo", "Timo", ""],
];

const mserviceIoCodes = new Set([
  "HLB", "COB", "CIMB", "STANDARD", "CAKE", "Ubank",
  "NonghyupBankHN", "KBHN", "KBHCM", "DBSHCM", "CBBank",
  "KBankHCM", "HSBC", "Timo",
]);

export const MOMO_BANKS: readonly MomoBank[] = bankEntries.map(
  ([code, name, napasCode]) => ({
    code,
    name,
    napasCode,
    logoUrl: `https://img.${mserviceIoCodes.has(code) ? "mservice.io" : "mservice.com.vn"}/momo_app_v2/img/${code}.png`,
  }),
);
