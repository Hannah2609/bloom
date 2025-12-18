// Role type from database
export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

// Basic user type from database
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  role: Role;
  companyId: string;
}

// User with company data (as in session)
export interface UserWithCompany extends User {
  company: {
    id: string;
    name: string;
    logo?: string | null;
  };
}

// User for table display
export interface UserTableRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// API response types
export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}
