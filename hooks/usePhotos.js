"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, PHOTOS_TABLE } from "@/utils/supabase";

function sortPhotos(photos, filter) {
  const sorted = [...photos];

  switch (filter) {
    case "top":
      return sorted.sort((a, b) => {
        const likeDiff = (b.likes_count || 0) - (a.likes_count || 0);
        if (likeDiff !== 0) return likeDiff;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    case "today": {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      return sorted
        .filter((p) => new Date(p.created_at) >= startOfDay)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    case "latest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  }
}

export function usePhotos({ filter = "latest", search = "" } = {}) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhotos = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from(PHOTOS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;
    return data || [];
  }, []);

  const updatePhotoInState = useCallback((updated) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPhotos();
        if (mounted) setPhotos(data);
      } catch (err) {
        if (mounted) setError("LOAD_FAILED");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel("photos-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: PHOTOS_TABLE },
        (payload) => {
          setPhotos((prev) => {
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: PHOTOS_TABLE },
        (payload) => {
          updatePhotoInState(payload.new);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchPhotos, updatePhotoInState]);

  const filteredPhotos = useMemo(() => {
    let result = sortPhotos(photos, filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.user_name?.toLowerCase().includes(q) ||
          p.message?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [photos, filter, search]);

  const patchPhoto = useCallback((photoId, patch) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, ...patch } : p))
    );
  }, []);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (err) {
      setError("LOAD_FAILED");
    }
  }, [fetchPhotos]);

  return { photos: filteredPhotos, loading, error, refetch, patchPhoto };
}
