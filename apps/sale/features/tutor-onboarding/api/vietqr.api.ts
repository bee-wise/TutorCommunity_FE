export interface VietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported?: number;
  lookupSupported?: number;
  short_name?: string;
  support?: number;
  isTransfer?: number;
  swift_code?: string;
}

export interface VietQRLookupResult {
  success: boolean;
  accountName?: string;
  error?: string;
  isKeyMissing?: boolean;
}

let cachedBanks: VietQRBank[] | null = null;

/**
 * Fetch list of banks supported by VietQR
 * GET https://api.vietqr.io/v2/banks
 */
export async function getVietQRBanks(): Promise<VietQRBank[]> {
  if (cachedBanks && cachedBanks.length > 0) {
    return cachedBanks;
  }

  try {
    const res = await fetch("https://api.vietqr.io/v2/banks", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch banks list: ${res.status}`);
    }

    const data = await res.json();
    if (data.code === "00" && Array.isArray(data.data)) {
      cachedBanks = data.data;
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching VietQR banks:", error);
    return [];
  }
}

/**
 * Lookup bank account holder name via VietQR API
 * POST https://api.vietqr.io/v2/lookup
 */
export async function lookupVietQRAccount(
  bin: string,
  accountNumber: string,
): Promise<VietQRLookupResult> {
  const cleanAccount = accountNumber.trim().replace(/\s+/g, "");
  const cleanBin = bin.trim();

  if (!cleanBin || !cleanAccount) {
    return { success: false, error: "Vui lòng chọn ngân hàng và nhập số tài khoản" };
  }

  const clientId = process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID || "";
  const apiKey = process.env.NEXT_PUBLIC_VIETQR_API_KEY || "";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (clientId) headers["x-client-id"] = clientId;
    if (apiKey) headers["x-api-key"] = apiKey;

    const res = await fetch("https://api.vietqr.io/v2/lookup", {
      method: "POST",
      headers,
      body: JSON.stringify({
        bin: cleanBin,
        accountNumber: cleanAccount,
      }),
    });

    const data = await res.json();

    if (res.status === 401 || data.code === "401") {
      return {
        success: false,
        error: "VietQR yêu cầu x-client-id và x-api-key để tra cứu tài khoản thực tế.",
        isKeyMissing: true,
      };
    }

    if (data.code === "00" && data.data?.accountName) {
      return {
        success: true,
        accountName: data.data.accountName,
      };
    }

    return {
      success: false,
      error: data.desc || "Không tìm thấy thông tin tài khoản hoặc số tài khoản không hợp lệ.",
    };
  } catch (error) {
    console.error("Error looking up VietQR account:", error);
    return {
      success: false,
      error: "Không thể kết nối đến hệ thống tra cứu ngân hàng.",
    };
  }
}
