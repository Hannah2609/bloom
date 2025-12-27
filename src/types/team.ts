import { Role } from "./user";

export type Team = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  deletedAt: Date | null;
  memberCount?: number; // Optional for list views
};

export type TeamMember = {
  id: string;
  userId: string;
  role: Role;
  joinedAt: Date;
  leftAt: Date | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
};

export type TeamWithMembers = Team & {
  members: TeamMember[];
};
