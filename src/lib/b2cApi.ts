export interface GuestLoginResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    accessToken: string;
    tokenType: string;
    expiresInSeconds: number;
    accessTokenExpiresAtUtc: string;
    refreshToken: string;
    refreshTokenExpiresAtUtc: string;
  };
  errorCode?: string;
  errors?: Record<string, string[]>;
}

export interface RegisterCraPartnerPayload {
  fullName: string;
  mobile: string;
  email?: string | null;
  pincode: string;
}

export interface RegisterCraPartnerResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    received: boolean;
  };
  errorCode?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
  timestamp?: string;
}

// In-memory token cache for guest session
let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

function getEnvConfig() {
  const baseUrl = process.env.B2C_API_BASE_URL || process.env.API_BASE_URL;
  const user = process.env.B2C_GUEST_USER || process.env.GUEST_USER || process.env.API_USER;
  const pass = process.env.B2C_GUEST_PASS || process.env.GUEST_PASS || process.env.API_PASS;

  if (!baseUrl || !user || !pass) {
    const missing: string[] = [];
    if (!baseUrl) missing.push("B2C_API_BASE_URL");
    if (!user) missing.push("B2C_GUEST_USER");
    if (!pass) missing.push("B2C_GUEST_PASS");

    console.error(
      `[B2C API Configuration Error] Missing required environment variables in .env: ${missing.join(", ")}`
    );

    throw new Error(
      "The registration service is temporarily unavailable due to a server configuration issue. Please try again shortly or contact support."
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    user,
    pass,
  };
}

/**
 * Obtains an active Bearer guest token from the B2C API.
 * Uses in-memory caching to avoid redundant login calls.
 */
export async function getGuestToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const { baseUrl, user, pass } = getEnvConfig();

  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/guest/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: user,
        password: pass,
      }),
      cache: "no-store",
    });

    const result: GuestLoginResponse = await response.json();

    if (!response.ok || !result.success || !result.data?.accessToken) {
      console.error("[B2C API Guest Login Error]", {
        status: response.status,
        result,
      });

      throw new Error(
        "Unable to establish a secure connection to the partner service. Please try again in a few moments."
      );
    }

    const expiresInMs = (result.data.expiresInSeconds || 1800) * 1000;
    cachedToken = {
      token: result.data.accessToken,
      expiresAt: now + expiresInMs,
    };

    return cachedToken.token;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("secure connection")) {
      throw error;
    }
    console.error("[B2C API Guest Login Network Error]", error);
    throw new Error(
      "Unable to connect to the partner verification service. Please check your network and try again."
    );
  }
}

/**
 * Submits CRA Lead registration to the B2C API.
 * Handles authentication and automatic token refresh on 401.
 */
export async function registerCraLead(payload: RegisterCraPartnerPayload): Promise<RegisterCraPartnerResponse> {
  const { baseUrl } = getEnvConfig();
  let token = await getGuestToken();

  const makeRequest = async (bearerToken: string) => {
    return fetch(`${baseUrl}/api/v1/cra-lead/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        fullName: payload.fullName.trim(),
        mobile: payload.mobile.trim(),
        email: payload.email?.trim() || null,
        pincode: payload.pincode.trim(),
      }),
      cache: "no-store",
    });
  };

  let response = await makeRequest(token);

  // If token expired (401), force refresh and retry once
  if (response.status === 401) {
    token = await getGuestToken(true);
    response = await makeRequest(token);
  }

  const result: RegisterCraPartnerResponse = await response.json();

  if (!response.ok || !result.success) {
    console.error("[B2C API Register Lead Error]", {
      status: response.status,
      result,
    });

    const firstValidationError = result.errors
      ? Object.values(result.errors).flat()[0]
      : null;

    const userFriendlyMessage =
      firstValidationError ||
      result.message ||
      "We could not process your partner registration. Please verify your details and try again.";

    return {
      success: false,
      statusCode: response.status,
      message: userFriendlyMessage,
      errors: result.errors,
    };
  }

  return result;
}
