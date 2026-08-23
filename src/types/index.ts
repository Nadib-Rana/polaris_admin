export interface QuestionOption {
  id: string;
  text: string;
  recommendationTag?: string;
}

export interface AssessmentQuestion {
  id: number;
  key?: string;
  question: string;
  subtitle: string;
  category: "relation" | "living" | "assistance" | "pflegegrad" | "challenges" | "network" | "spitex" | "legal" | "wellbeing" | "canton" | "respite" | "goals" | "custom";
  options: string[];
  isActive: boolean;
}

export interface AssessmentSubmission {
  id: string;
  caregiver: string;
  relation: string;
  living: string;
  careDegree: string;
  urgency: "High" | "Medium" | "Normal";
  canton: string;
  submittedAt: string;
  score: number;
  answers: Record<string | number, string>;
  advisorNotes?: string;
  status: "Reviewed" | "Pending Action" | "Archived";
}

export interface ConsultationLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  canton: string;
  urgency: "High" | "Medium" | "Standard";
  status: "new" | "contacted" | "scheduled" | "resolved";
  preferredTime: string;
  message: string;
  assessmentId?: string;
  publicCode?: string;
  assignedAdvisor?: string;
  createdAt: string;
  notes: string[];
}

export interface SituationSummary {
  id: string;
  title: string;
  description: string;
  targetCategory: string;
  isActive: boolean;
}

export interface GuidanceResource {
  id: string;
  title: string;
  description: string;
  category: "therapy" | "community" | "equipment" | "spitex" | "legal";
  cantons: string[];
  linkUrl?: string;
  isActive: boolean;
}

export interface TestimonialItem {
  id: number | string;
  name: string;
  role: string;
  canton: string;
  quote: string;
  image?: string;
  imageUrl?: string;
  isVerified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
