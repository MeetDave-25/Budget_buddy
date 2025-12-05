-- Migration: Optimize RLS Policies Performance
-- This migration fixes the performance issue where auth.uid() is re-evaluated for each row
-- by wrapping it in a subquery: (select auth.uid())
-- 
-- Run this in your Supabase SQL Editor to update existing policies

-- ============================================
-- PROFILES TABLE - Drop and recreate policies
-- ============================================

-- Drop existing policies
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

-- Recreate with optimized queries
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- ============================================
-- CATEGORIES TABLE - Drop and recreate policies
-- ============================================

-- Drop existing policies
drop policy if exists "Users can view their own categories." on categories;
drop policy if exists "Users can insert their own categories." on categories;
drop policy if exists "Users can update their own categories." on categories;
drop policy if exists "Users can delete their own categories." on categories;

-- Recreate with optimized queries
create policy "Users can view their own categories."
  on categories for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert their own categories."
  on categories for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own categories."
  on categories for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own categories."
  on categories for delete
  using ( (select auth.uid()) = user_id );

-- ============================================
-- EXPENSES TABLE - Drop and recreate policies
-- ============================================

-- Drop existing policies
drop policy if exists "Users can view their own expenses." on expenses;
drop policy if exists "Users can insert their own expenses." on expenses;
drop policy if exists "Users can update their own expenses." on expenses;
drop policy if exists "Users can delete their own expenses." on expenses;

-- Recreate with optimized queries
create policy "Users can view their own expenses."
  on expenses for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert their own expenses."
  on expenses for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own expenses."
  on expenses for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own expenses."
  on expenses for delete
  using ( (select auth.uid()) = user_id );

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, the performance warning in Supabase should disappear
-- and queries should be significantly faster, especially with large datasets
