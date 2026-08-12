import { apiFetch } from "../../../api/apiFetch";

const COMPANIES_PATH = "/demos/admin";
const COMPANY_STATS_PATH = "/demos/stats";

export class CompaniesRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "CompaniesRequestError";
    this.status = status;
  }
}

const readResponse = async (response, fallbackMessage) => {
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new CompaniesRequestError(
      "The server response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success === false) {
    throw new CompaniesRequestError(
      payload?.message || fallbackMessage,
      response.status,
    );
  }

  return payload;
};

const request = async (path, { signal } = {}) => {
  try {
    return await apiFetch(path, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new CompaniesRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }
};

export const getCompaniesRequest = async (
  { page = 1, search = "", status = "", take = 10 } = {},
  { signal } = {},
) => {
  const parameters = new URLSearchParams({
    page: String(page),
    take: String(take),
  });
  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    parameters.set("search", normalizedSearch);
  }

  if (status) {
    parameters.set("status", status);
  }

  const response = await request(
    `${COMPANIES_PATH}?${parameters.toString()}`,
    { signal },
  );
  const payload = await readResponse(
    response,
    "Companies could not be loaded. Please try again.",
  );

  if (!Array.isArray(payload?.data) || !payload?.meta) {
    throw new CompaniesRequestError(
      "The companies response was incomplete. Please try again.",
      response.status,
    );
  }

  return {
    companies: payload.data,
    meta: payload.meta,
  };
};

export const getCompanyStatsRequest = async ({ signal } = {}) => {
  const response = await request(COMPANY_STATS_PATH, { signal });
  const payload = await readResponse(
    response,
    "Company statistics could not be loaded. Please try again.",
  );
  const statFields = [
    "totalCompanies",
    "activeCompanies",
    "newCompaniesThisMonth",
    "totalMembers",
  ];

  if (
    !payload?.data
    || typeof payload.data !== "object"
    || statFields.some((field) => !Number.isFinite(payload.data[field]))
  ) {
    throw new CompaniesRequestError(
      "The company statistics response was incomplete. Please try again.",
      response.status,
    );
  }

  return payload.data;
};
