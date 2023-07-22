import { User } from "@/components/contexts/AuthContext/interface";

export interface Comment {
  id: string;
  created_at: string;
  message: string;
  user: User;
}
