import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User, Class, Student, ReportCard, AppState } from '@/types';

interface AppStore extends AppState {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  
  // Data actions
  loadClasses: () => Promise<void>;
  loadStudents: (classId?: string) => Promise<void>;
  loadReports: (studentId?: string) => Promise<void>;
  
  // CRUD operations
  createClass: (classData: Partial<Class>) => Promise<Class>;
  createStudent: (studentData: Partial<Student>) => Promise<Student>;
  createReport: (reportData: Partial<ReportCard>) => Promise<ReportCard>;
  
  // Utility actions
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  classes: [],
  students: [],
  reports: [],
  isLoading: false,
  error: null,

  // Auth actions
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ 
        user: {
          id: data.user.id,
          email: data.user.email!,
          full_name: profile?.full_name || '',
          role: profile?.role || 'teacher',
          school_id: profile?.school_id,
          avatar_url: profile?.avatar_url,
        },
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ 
        user: null, 
        classes: [], 
        students: [], 
        reports: [], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          role: 'teacher',
        });
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Data loading actions
  loadClasses: async () => {
    try {
      const { user } = get();
      if (!user) return;

      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students!inner(count)
        `)
        .eq('teacher_id', user.id);

      if (error) throw error;
      
      set({ classes: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadStudents: async (classId?: string) => {
    try {
      let query = supabase.from('students').select('*');
      
      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      set({ students: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadReports: async (studentId?: string) => {
    try {
      let query = supabase.from('report_cards').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      set({ reports: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // CRUD operations
  createClass: async (classData: Partial<Class>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('classes')
        .insert({
          ...classData,
          teacher_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ classes: [...state.classes, data] }));
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  createStudent: async (studentData: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ students: [...state.students, data] }));
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  createReport: async (reportData: Partial<ReportCard>) => {
    try {
      const { data, error } = await supabase
        .from('report_cards')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ reports: [...state.reports, data] }));
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Utility actions
  setError: (error: string | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));