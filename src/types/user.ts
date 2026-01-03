// Role type from database
export type Role = "ADMIN" | "EMPLOYEE";

// Basic user type from database
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  role: Role;
  companyId: string;
};

// User with company data (as in session)
export interface UserWithCompany extends User {
  company: {
    id: string;
    name: string;
    logo?: string | null;
  };
}

// User for table display
export type UserTableRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

// API response types
export type UserResponse = {
  user: User;
};

export type UsersResponse = {
  users: User[];
};
