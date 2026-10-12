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
