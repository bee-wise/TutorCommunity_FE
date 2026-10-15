import assert from "node:assert/strict";
import test from "node:test";
import { getVietQrBankBin, getVietQrBankName } from "./vietqr-bank.ts";

test("reads the receiving bank from a PayOS VietQR payload", () => {
  const qrCode = "00020101021238570010A000000727012700069704220113VQRQAMUFZ35140208QRIBFTTA5303704540450005802VN62290825BeeWise ";

  assert.equal(getVietQrBankBin(qrCode), "970422");
  assert.equal(getVietQrBankName("970422"), "MB Bank");
});

test("does not assign a bank name to an unknown or malformed payload", () => {
  assert.equal(getVietQrBankBin("not-a-vietqr-code"), undefined);
  assert.equal(getVietQrBankName("970436"), "Vietcombank");
  assert.equal(getVietQrBankName("999999"), undefined);
});
