import { Role, User } from "./user";

export type Team = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;
};

export type TeamMember = {
  id: string;
  userId: string;
  user: User;
  role: Role;
  joinedAt: Date;
  leftAt: Date | null;
};
