import { supabase } from '@/config/supabaseClient';
import { logAction } from './adminService';

/* ══════════════════════════════════════════════
   ACTIVITIES
   ══════════════════════════════════════════════ */

export const getActivities = async (publishedOnly = true) => {
  let query = supabase
    .from('activities')
    .select('*')
    .order('display_order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createActivity = async (activityData) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('activities')
    .insert([{ ...activityData, created_by: user.id }])
    .select()
    .single();

  if (error) throw error;

  await logAction(`Created activity: ${activityData.title}`, 'activities', data?.id, activityData);
  return data;
};

export const updateActivity = async (id, updates) => {
  const { data, error } = await supabase
    .from('activities')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await logAction(`Updated activity #${id}`, 'activities', id, updates);
  return data;
};

export const deleteActivity = async (id) => {
  await logAction(`Deleted activity #${id}`, 'activities', id);
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
};

/* ══════════════════════════════════════════════
   JOURNEY MILESTONES
   ══════════════════════════════════════════════ */

export const getJourneyMilestones = async (publishedOnly = true) => {
  let query = supabase
    .from('journey_milestones')
    .select('*')
    .order('display_order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createMilestone = async (milestoneData) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('journey_milestones')
    .insert([{ ...milestoneData, created_by: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMilestone = async (id, updates) => {
  const { data, error } = await supabase
    .from('journey_milestones')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMilestone = async (id) => {
  const { error } = await supabase.from('journey_milestones').delete().eq('id', id);
  if (error) throw error;
};

/* ══════════════════════════════════════════════
   TEAM MEMBERS
   ══════════════════════════════════════════════ */

export const getTeamMembers = async (publishedOnly = true) => {
  let query = supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createTeamMember = async (memberData) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('team_members')
    .insert([{ ...memberData, created_by: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTeamMember = async (id, updates) => {
  const { data, error } = await supabase
    .from('team_members')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTeamMember = async (id) => {
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
};

/* ══════════════════════════════════════════════
   FOOTPRINTS
   ══════════════════════════════════════════════ */

export const getFootprints = async () => {
  const { data, error } = await supabase
    .from('footprints')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateFootprint = async (id, updates) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('footprints')
    .update({ ...updates, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* ══════════════════════════════════════════════
   HOMEPAGE CONTENT
   ══════════════════════════════════════════════ */

export const getHomepageContent = async () => {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*');

  if (error) throw error;

  const contentMap = {};
  (data || []).forEach((item) => {
    contentMap[item.section_key] = item;
  });
  return contentMap;
};

export const updateHomepageContent = async (sectionKey, updates) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('homepage_content')
    .update({ ...updates, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('section_key', sectionKey)
    .select()
    .single();

  if (error) throw error;
  return data;
};
