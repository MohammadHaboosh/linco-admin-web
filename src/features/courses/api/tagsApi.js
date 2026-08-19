import { apiFetch } from "../../../api/apiFetch";

export const tagsApi = {
  getAllTags: async ({ signal } = {}) => {
    const response = await apiFetch("/tags", { method: "GET", signal });
    const payload = await response.json();
    if (!response.ok || !payload.success)
      throw new Error(payload.message || "Failed to fetch tags");
    return payload.data || [];
  },

  createTag: async (name) => {
    const response = await apiFetch("/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.success)
      throw new Error(payload.message || "Failed to create tag");
    return payload.data;
  },

  deleteTag: async (tagId) => {
    const response = await apiFetch(`/tags/${tagId}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok || !payload.success)
      throw new Error(payload.message || "Failed to delete tag");
    return true;
  },
};
