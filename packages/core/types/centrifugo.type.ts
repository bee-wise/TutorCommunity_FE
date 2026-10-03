export interface CentrifugoTokenResponse {
  token?: string | null;
  expiresAt: string;
  userId: string;
  webSocketUrl?: string | null;
}

export interface CentrifugoSubscriptionTokenResponse {
  token?: string | null;
  channel?: string | null;
  expiresAt: string;
}

export interface CentrifugoHealthResponse {
  status: "OK" | "UNREACHABLE" | string;
  error?: string | null;
  details?: Record<string, unknown>;
}
