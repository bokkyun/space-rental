import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('DB 연결 안됨');
      return;
    }
    async function fetchProperties() {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select(`
            *,
            users:host_id (id, name, profile_image),
            property_images (image_url, "order", is_cover),
            property_options (option_name, has_option),
            property_hashtags (hashtags (name)),
            likes (id)
          `)
          .eq('status', '게시중')
          .order('created_at', { ascending: false });

        if (filters.type) query = query.eq('type', filters.type);
        if (filters.maxRent) query = query.lte('monthly_rent', filters.maxRent);

        const { data, error: err } = await query;
        if (err) throw err;
        setProperties(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [filters.type, filters.maxRent]);

  return { properties, loading, error };
}

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !supabase) {
      setLoading(false);
      return;
    }
    async function fetchProperty() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from('properties')
          .select(`
            *,
            users:host_id (id, name, profile_image, phone),
            property_images (image_url, "order", is_cover),
            property_options (option_name, has_option),
            property_hashtags (hashtags (name)),
            likes (id)
          `)
          .eq('id', id)
          .single();
        if (err) throw err;
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  return { property, loading, error };
}

export function useStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (!supabase) return;
    async function fetchStories() {
      const { data } = await supabase
        .from('stories')
        .select('*, properties (id, address)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      setStories(data || []);
    }
    fetchStories();
  }, []);

  return { stories };
}
