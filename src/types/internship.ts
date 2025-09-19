export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  stipend: number;
  duration: string;
  location: string;
  deadline: string;
  postedBy: string;
  postedAt: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}