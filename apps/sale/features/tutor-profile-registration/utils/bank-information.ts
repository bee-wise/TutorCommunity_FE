import { z } from "zod";

const bankInformationSchema = z.object({
  bankCode: z.string(),
  bankName: z.string(),
  napasCode: z.string(),
  bankLogoUrl: z.string(),
  accountNumber: z.string(),
  accountHolder: z.string(),
});

export type BankInformation = z.infer<typeof bankInformationSchema>;

export const emptyBankInformation: BankInformation = {
  bankCode: "",
  bankName: "",
  napasCode: "",
  bankLogoUrl: "",
  accountNumber: "",
  accountHolder: "",
};

export function parseBankInformation(value: string): BankInformation {
  if (!value.trim()) return emptyBankInformation;

  try {
    const parsed: unknown = JSON.parse(value);
    return bankInformationSchema.parse(parsed);
  } catch {
    const [bankName = "", accountNumber = "", accountHolder = ""] =
      value.split("|").map((item) => item.trim());
    return {
      ...emptyBankInformation,
      bankName,
      accountNumber,
      accountHolder,
    };
  }
}

export function serializeBankInformation(value: BankInformation): string {
  if (!value.bankCode && !value.accountNumber && !value.accountHolder) return "";
  return JSON.stringify(value);
}
