import { cache } from 'react';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export type Level = {
  id: string;
  name: string;
  sort_order: number;
};

export type Category = {
  id: string;
  name: string;
  sort_order: number;
};

export type Book = {
  id: string;
  title: string;
  level_id: string;
  category_id: string;
  units_count: number;
};

export type Unit = {
  id: string;
  unit_number: number;
  book_id: string;
};

export type Question = {
  id: string;
  question_number: number;
  answer_key: string | null;
};

async function withSupabase<T>(callback: (client: Awaited<ReturnType<typeof getSupabaseServerClient>>) => Promise<T>) {
  const supabase = await getSupabaseServerClient();
  return callback(supabase);
}

export const getLevels = cache(async (): Promise<Level[]> => {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('level')
      .select('id,name,sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as Level[];
  });
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('category')
      .select('id,name,sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as Category[];
  });
});

export const getBooks = cache(async (): Promise<Book[]> => {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('book')
      .select('id,title,level_id,category_id,units_count')
      .order('title', { ascending: true });
    if (error) throw error;
    return data as Book[];
  });
});

export async function getBookById(bookId: string) {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('book')
      .select('id,title,level_id,category_id,units_count')
      .eq('id', bookId)
      .single();
    if (error) throw error;
    return data as Book;
  });
}

export async function getUnitsForBook(bookId: string) {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('unit')
      .select('id,unit_number,book_id')
      .eq('book_id', bookId)
      .order('unit_number', { ascending: true });
    if (error) throw error;
    return data as Unit[];
  });
}

export async function getUnitByBookAndNumber(bookId: string, unitNumber: number) {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('unit')
      .select('id,unit_number,book_id')
      .eq('book_id', bookId)
      .eq('unit_number', unitNumber)
      .single();
    if (error) throw error;
    return data as Unit;
  });
}

export async function getQuestionsForUnit(unitId: string) {
  return withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from('question')
      .select('id,question_number,answer_key')
      .eq('unit_id', unitId)
      .order('question_number', { ascending: true });
    if (error) throw error;
    return data as Question[];
  });
}
