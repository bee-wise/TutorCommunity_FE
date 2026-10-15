const bankNamesByBin: Readonly<Record<string, string>> = {
  "970436": "Vietcombank",
  "970415": "VietinBank",
  "970407": "Techcombank",
  "970418": "BIDV",
  "970405": "Agribank",
  "970419": "NCB",
  "970403": "Sacombank",
  "970416": "ACB",
  "970422": "MB Bank",
  "970423": "TPBank",
  "970424": "Shinhan Bank",
  "970441": "VIB",
  "970432": "VPBank",
  "970443": "SHB",
  "970431": "Eximbank",
  "970438": "BaoViet Bank",
  "970454": "BVBank",
  "970429": "SCB",
  "970421": "VRB",
  "970425": "ABBank",
  "970412": "PVcomBank",
  "970414": "OceanBank",
  "970428": "Nam A Bank",
  "970437": "HDBank",
  "970433": "VietBank",
  "970460": "VietCredit",
  "970439": "Public Bank Vietnam",
  "970442": "Hong Leong Bank",
  "970430": "PGBank",
  "970446": "Co-opBank",
  "422589": "CIMB Vietnam",
  "970434": "Indovina Bank",
  "970406": "DongA Bank",
  "970408": "GPBank",
  "970409": "Bac A Bank",
  "970427": "VietABank",
  "970400": "SaigonBank",
  "970426": "MSB",
  "970449": "LPBank",
  "970452": "KienlongBank",
  "970455": "IBK Hà Nội",
  "970457": "Woori Bank",
  "970440": "SeABank",
  "970458": "UOB Vietnam",
  "970448": "OCB",
  "970468": "Mirae Asset Finance",
  "970466": "Keb Hana TP.HCM",
  "970467": "Keb Hana Hà Nội",
  "970410": "Standard Chartered",
  "546034": "CAKE by VPBank",
  "546035": "Ubank by VPBank",
  "801011": "Nonghyup Bank Hà Nội",
  "970462": "Kookmin Bank Hà Nội",
  "970463": "Kookmin Bank TP.HCM",
  "796500": "DBS Bank TP.HCM",
  "970444": "CBBank",
  "668888": "Kasikornbank TP.HCM",
  "458761": "HSBC Vietnam",
};

function readTlvFields(value: string): Map<string, string> {
  const fields = new Map<string, string>();
  let offset = 0;

  while (offset + 4 <= value.length) {
    const tag = value.slice(offset, offset + 2);
    const lengthText = value.slice(offset + 2, offset + 4);
    if (!/^\d{2}$/.test(tag) || !/^\d{2}$/.test(lengthText)) break;

    const length = Number(lengthText);
    const end = offset + 4 + length;
    if (end > value.length) break;
    fields.set(tag, value.slice(offset + 4, end));
    offset = end;
  }

  return fields;
}

/** Reads the receiving bank BIN from a VietQR merchant account payload. */
export function getVietQrBankBin(qrCode: string): string | undefined {
  const fields = readTlvFields(qrCode);
  for (let tag = 26; tag <= 51; tag += 1) {
    const merchantAccount = fields.get(String(tag));
    if (!merchantAccount) continue;

    const merchantFields = readTlvFields(merchantAccount);
    if (merchantFields.get("00") !== "A000000727") continue;

    const account = merchantFields.get("01");
    if (!account) continue;
    const bin = readTlvFields(account).get("00");
    if (bin && /^\d{6}$/.test(bin)) return bin;
  }
}

export function getVietQrBankName(bin?: string | null): string | undefined {
  return bin ? bankNamesByBin[bin] : undefined;
}
