// ✅ Phase 4 — useEmployeeProfile hook
import { useState, useEffect, useCallback } from "react";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  uploadFile,
  deleteFile,
} from "@/services/employeeApi";

export function useEmployeeProfile(id) {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);

  // 4.1 Fetch on mount / id change
  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployeeProfile(id);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // 4.2 Save full profile
  const saveProfile = useCallback(async (payload) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateEmployeeProfile(id, payload);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [id]);

  // 4.3 Upload a single file → save URL back to profile
  const uploadProfileFile = useCallback(async (bucket, file, field, section) => {
    setSaving(true);
    try {
      // Delete old file if exists
      const oldUrl = profile?.[section]?.[field];
      if (oldUrl) await deleteFile(bucket, oldUrl);

      // Upload new file
      const url = await uploadFile(bucket, file, id);

      // Patch profile state + save to DB
      const patch = { [section]: { ...profile?.[section], [field]: url } };
      await saveProfile(patch);

      return url;
    } finally {
      setSaving(false);
    }
  }, [id, profile, saveProfile]);

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile,
    saveProfile,
    uploadProfileFile,
  };
}