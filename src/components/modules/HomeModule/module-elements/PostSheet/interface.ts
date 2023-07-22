import { User } from "@/components/contexts/AuthContext/interface";

export interface Comment {
  id: string;
  created_at: string;
  message: string;
  user: User;
}

export interface Mentor {
  id: string;
  user: User;
  mentees_count: number;
  source_country: string;
  source_country_code: string;
  destination_country: string;
  destination_country_code: string;
  mentees?: Mentee[];
  is_available?: boolean;
}

export interface Mentee {
  id: string;
  user: User;
  mentor: Mentor;
}
