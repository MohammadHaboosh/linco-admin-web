import { useState, useEffect, useCallback } from "react";
import { tagsApi } from "../api/tagsApi";

export const useTagsManager = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError("");
      }
    });

    const loadInitialTags = async () => {
      try {
        const data = await tagsApi.getAllTags();
        if (isMounted) {
          setTags(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load tags.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialTags();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshTags = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await tagsApi.getAllTags();
      setTags(data || []);
    } catch (err) {
      setError(err.message || "Failed to load tags.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTag = async (name) => {
    if (!name.trim()) return false;
    setIsSubmitting(true);
    setError("");
    try {
      const newTag = await tagsApi.createTag(name.trim());
      setTags((prev) => [...prev, newTag]);
      return true;
    } catch (err) {
      setError(err.message || "Failed to add tag.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTag = async (tagId) => {
    setIsSubmitting(true);
    setError("");
    try {
      await tagsApi.deleteTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete tag. It might be in use.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tags,
    isLoading,
    isSubmitting,
    error,
    addTag,
    removeTag,
    refreshTags,
  };
};
