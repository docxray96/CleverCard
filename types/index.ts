export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'admin';
  school_id?: string;
  avatar_url?: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Class {
  id: string;
  school_id: string;
  teacher_id: string;
  name: string;
  subject: string;
  academic_year: string;
  created_at: string;
  student_count?: number;
}

export interface Student {
  id: string;
  class_id: string;
  full_name: string;
  registration_number: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  parent_contact?: string;
  address?: string;
  created_at: string;
}

export interface ReportCard {
  id: string;
  student_id: string;
  term: string;
  academic_year: string;
  scores: Record<string, number>;
  teacher_remarks: string;
  ai_insights?: AIInsight[];
  total_score: number;
  grade: string;
  position?: number;
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'improvement';
  subject?: string;
  message: string;
  confidence: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  student_data?: {
    name: string;
    scores: Record<string, number>;
  }[];
}

export interface AppState {
  user: User | null;
  classes: Class[];
  students: Student[];
  reports: ReportCard[];
  isLoading: boolean;
  error: string | null;
}