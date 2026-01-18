import { describe, it, expect } from "vitest";
import {
  signupSchema,
  loginSchema,
  companySignupSchema,
  setPendingCompanySchema,
  emailSchema,
  createTeamSchema,
  createSurveySchema,
  editSurveySchema,
  createQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema,
  editProfileNameSchema,
  editProfileAvatarSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateTokenSchema,
  changePasswordSchema,
} from "../../src/lib/validation/validation";

// Signup schema validation tests
describe("signupSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
  };

  // Valid signup data should pass
  it("validates correct signup data", () => {
    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Danish characters (æ, ø, å) should be accepted in names
  it("accepts Danish characters in names", () => {
    const result = signupSchema.safeParse({
      ...validData,
      firstName: "Søren",
      lastName: "Ærø",
    });
    expect(result.success).toBe(true);
  });

  // Names with spaces should be accepted
  it("accepts names with spaces", () => {
    const result = signupSchema.safeParse({
      ...validData,
      firstName: "John Paul",
      lastName: "Von Schmidt",
    });
    expect(result.success).toBe(true);
  });

  // First name must be at least 2 characters
  it("rejects first name with less than 2 characters", () => {
    const result = signupSchema.safeParse({ ...validData, firstName: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 2 characters");
    }
  });

  // Last name must be at least 2 characters
  it("rejects last name with less than 2 characters", () => {
    const result = signupSchema.safeParse({ ...validData, lastName: "D" });
    expect(result.success).toBe(false);
  });

  // Names cannot contain numbers
  it("rejects names with numbers", () => {
    const result = signupSchema.safeParse({
      ...validData,
      firstName: "John123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("letters and spaces");
    }
  });

  // Names cannot contain special characters
  it("rejects names with special characters", () => {
    const result = signupSchema.safeParse({
      ...validData,
      firstName: "John@!",
    });
    expect(result.success).toBe(false);
  });

  // Email must be valid format
  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      ...validData,
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
  });

  // Password must be at least 8 characters
  it("rejects password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({ ...validData, password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 8 characters");
    }
  });
});

// Login schema validation tests
describe("loginSchema", () => {
  // Valid login credentials should pass
  it("validates correct login data", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  // Email is required
  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  // Password is required
  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

// Company signup schema validation tests
describe("companySignupSchema", () => {
  const validData = {
    companyName: "Acme Corp",
    companyDomain: "acme.com",
  };

  // Valid company data should pass
  it("validates correct company data", () => {
    const result = companySignupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Company names can include special business characters
  it("accepts company name with special characters", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyName: "Acme & Co. (Ltd.)",
    });
    expect(result.success).toBe(true);
  });

  // Company names can include Danish characters
  it("accepts company name with Danish characters", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyName: "Ærø Corporation",
    });
    expect(result.success).toBe(true);
  });

  // Company name must be at least 2 characters
  it("rejects company name shorter than 2 characters", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyName: "A",
    });
    expect(result.success).toBe(false);
  });

  // Domain must be valid format
  it("accepts valid domain", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyDomain: "example.com",
    });
    expect(result.success).toBe(true);
  });

  // Domain can include subdomains
  it("accepts domain with subdomain", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyDomain: "mail.acme.com",
    });
    expect(result.success).toBe(true);
  });

  // Domain can include hyphens
  it("accepts domain with hyphen", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyDomain: "my-company.com",
    });
    expect(result.success).toBe(true);
  });

  // Domain must have valid TLD
  it("rejects invalid domain format", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyDomain: "not-a-valid-domain",
    });
    expect(result.success).toBe(false);
  });

  // Domain must be lowercase
  it("rejects domain with uppercase", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      companyDomain: "Acme.com",
    });
    expect(result.success).toBe(false);
  });

  // Logo is optional but must be valid URL if provided
  it("accepts optional logo URL", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      logo: "https://example.com/logo.png",
    });
    expect(result.success).toBe(true);
  });

  // Invalid logo URL should be rejected
  it("rejects invalid logo URL", () => {
    const result = companySignupSchema.safeParse({
      ...validData,
      logo: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  // Logo can be omitted
  it("allows missing logo", () => {
    const result = companySignupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

// Set pending company schema validation tests
describe("setPendingCompanySchema", () => {
  // Valid company ID and role should pass
  it("validates correct data", () => {
    const result = setPendingCompanySchema.safeParse({
      companyId: "123e4567-e89b-12d3-a456-426614174000",
      role: "ADMIN",
    });
    expect(result.success).toBe(true);
  });

  // EMPLOYEE role should be accepted
  it("accepts EMPLOYEE role", () => {
    const result = setPendingCompanySchema.safeParse({
      companyId: "123e4567-e89b-12d3-a456-426614174000",
      role: "EMPLOYEE",
    });
    expect(result.success).toBe(true);
  });

  // Email is optional
  it("accepts optional email", () => {
    const result = setPendingCompanySchema.safeParse({
      companyId: "123e4567-e89b-12d3-a456-426614174000",
      role: "ADMIN",
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  // Company ID must be valid UUID
  it("rejects invalid UUID", () => {
    const result = setPendingCompanySchema.safeParse({
      companyId: "not-a-uuid",
      role: "ADMIN",
    });
    expect(result.success).toBe(false);
  });

  // Role must be ADMIN or EMPLOYEE
  it("rejects invalid role", () => {
    const result = setPendingCompanySchema.safeParse({
      companyId: "123e4567-e89b-12d3-a456-426614174000",
      role: "INVALID_ROLE",
    });
    expect(result.success).toBe(false);
  });
});

// Email schema validation tests
describe("emailSchema", () => {
  // Valid email should pass
  it("validates correct email", () => {
    const result = emailSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  // Invalid email format should be rejected
  it("rejects invalid email", () => {
    const result = emailSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });
});

// Create team schema validation tests
describe("createTeamSchema", () => {
  // Team name should be accepted
  it("validates correct team name", () => {
    const result = createTeamSchema.safeParse({ name: "Engineering" });
    expect(result.success).toBe(true);
  });

  // Team name cannot be empty
  it("rejects empty team name", () => {
    const result = createTeamSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

// Create survey schema validation tests
describe("createSurveySchema", () => {
  const validGlobalSurvey = {
    title: "Employee Survey",
    description: "Optional description",
    isGlobal: true,
  };

  const validTeamSurvey = {
    title: "Team Survey",
    isGlobal: false,
    teamIds: ["team1", "team2"],
  };

  // Global survey doesn't require teams
  it("validates global survey", () => {
    const result = createSurveySchema.safeParse(validGlobalSurvey);
    expect(result.success).toBe(true);
  });

  // Team-specific survey requires team IDs
  it("validates team-specific survey", () => {
    const result = createSurveySchema.safeParse(validTeamSurvey);
    expect(result.success).toBe(true);
  });

  // Survey title is required
  it("rejects empty title", () => {
    const result = createSurveySchema.safeParse({
      ...validGlobalSurvey,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  // Non-global survey must have at least one team
  it("rejects non-global survey without teams", () => {
    const result = createSurveySchema.safeParse({
      title: "Survey",
      isGlobal: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least one team");
    }
  });

  // Non-global survey cannot have empty teams array
  it("rejects non-global survey with empty teams array", () => {
    const result = createSurveySchema.safeParse({
      title: "Survey",
      isGlobal: false,
      teamIds: [],
    });
    expect(result.success).toBe(false);
  });

  // Description is optional
  it("accepts optional description", () => {
    const result = createSurveySchema.safeParse({
      ...validGlobalSurvey,
      description: "Some description",
    });
    expect(result.success).toBe(true);
  });

  // Survey can be created without description
  it("accepts survey without description", () => {
    const result = createSurveySchema.safeParse({
      title: "Survey",
      isGlobal: true,
    });
    expect(result.success).toBe(true);
  });
});

// Edit survey schema validation tests
describe("editSurveySchema", () => {
  // Global survey edit should pass
  it("validates global survey edit", () => {
    const result = editSurveySchema.safeParse({
      title: "Updated Survey",
      isGlobal: true,
    });
    expect(result.success).toBe(true);
  });

  // Team survey edit with teams should pass
  it("validates team survey edit", () => {
    const result = editSurveySchema.safeParse({
      title: "Updated Survey",
      isGlobal: false,
      teamIds: ["team1"],
    });
    expect(result.success).toBe(true);
  });

  // Non-global survey must have teams
  it("rejects non-global survey without teams", () => {
    const result = editSurveySchema.safeParse({
      title: "Survey",
      isGlobal: false,
    });
    expect(result.success).toBe(false);
  });
});

// Create question schema validation tests
describe("createQuestionSchema", () => {
  // SATISFACTION question type should be accepted
  it("validates question with SATISFACTION type", () => {
    const result = createQuestionSchema.safeParse({
      title: "How satisfied are you?",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(true);
  });

  // AGREEMENT question type should be accepted
  it("validates question with AGREEMENT type", () => {
    const result = createQuestionSchema.safeParse({
      title: "Do you agree?",
      answerType: "AGREEMENT",
    });
    expect(result.success).toBe(true);
  });

  // SCALE question type should be accepted
  it("validates question with SCALE type", () => {
    const result = createQuestionSchema.safeParse({
      title: "Rate from 1-5",
      answerType: "SCALE",
    });
    expect(result.success).toBe(true);
  });

  // Description is optional for questions
  it("accepts optional description", () => {
    const result = createQuestionSchema.safeParse({
      title: "Question",
      description: "Additional context",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(true);
  });

  // Required field defaults to true
  it("defaults required to true", () => {
    const result = createQuestionSchema.safeParse({
      title: "Question",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.required).toBe(true);
    }
  });

  // Questions can be marked as not required
  it("accepts required false", () => {
    const result = createQuestionSchema.safeParse({
      title: "Question",
      answerType: "SATISFACTION",
      required: false,
    });
    expect(result.success).toBe(true);
  });

  // Question title cannot be empty
  it("rejects empty title", () => {
    const result = createQuestionSchema.safeParse({
      title: "",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(false);
  });

  // Answer type must be valid enum value
  it("rejects invalid answer type", () => {
    const result = createQuestionSchema.safeParse({
      title: "Question",
      answerType: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});

// Update question schema validation tests
describe("updateQuestionSchema", () => {
  // Valid question ID should pass
  it("validates update with questionId", () => {
    const result = updateQuestionSchema.safeParse({
      questionId: "123e4567-e89b-12d3-a456-426614174000",
      title: "Updated Question",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(true);
  });

  // Question ID must be valid UUID
  it("rejects invalid UUID", () => {
    const result = updateQuestionSchema.safeParse({
      questionId: "not-a-uuid",
      title: "Question",
      answerType: "SATISFACTION",
    });
    expect(result.success).toBe(false);
  });
});

// Reorder questions schema validation tests
describe("reorderQuestionsSchema", () => {
  // Valid question orders should pass
  it("validates correct question orders", () => {
    const result = reorderQuestionsSchema.safeParse({
      questionOrders: [
        {
          questionId: "123e4567-e89b-12d3-a456-426614174000",
          order: 1,
        },
        {
          questionId: "223e4567-e89b-12d3-a456-426614174000",
          order: 2,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  // Order must be positive
  it("rejects negative order", () => {
    const result = reorderQuestionsSchema.safeParse({
      questionOrders: [
        {
          questionId: "123e4567-e89b-12d3-a456-426614174000",
          order: -1,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  // Order must be at least 1
  it("rejects zero order", () => {
    const result = reorderQuestionsSchema.safeParse({
      questionOrders: [
        {
          questionId: "123e4567-e89b-12d3-a456-426614174000",
          order: 0,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  // Order must be integer
  it("rejects decimal order", () => {
    const result = reorderQuestionsSchema.safeParse({
      questionOrders: [
        {
          questionId: "123e4567-e89b-12d3-a456-426614174000",
          order: 1.5,
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

// Edit profile name schema validation tests
describe("editProfileNameSchema", () => {
  // Valid name data should pass
  it("validates correct name data", () => {
    const result = editProfileNameSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
    });
    expect(result.success).toBe(true);
  });

  // Danish characters should be accepted
  it("accepts Danish characters", () => {
    const result = editProfileNameSchema.safeParse({
      firstName: "Søren",
      lastName: "Ærø",
    });
    expect(result.success).toBe(true);
  });

  // Names cannot contain numbers
  it("rejects names with numbers", () => {
    const result = editProfileNameSchema.safeParse({
      firstName: "John123",
      lastName: "Doe",
    });
    expect(result.success).toBe(false);
  });
});

// Edit profile avatar schema validation tests
describe("editProfileAvatarSchema", () => {
  // Valid URL should pass
  it("validates valid URL", () => {
    const result = editProfileAvatarSchema.safeParse({
      avatar: "https://example.com/avatar.jpg",
    });
    expect(result.success).toBe(true);
  });

  // Avatar can be null (removed)
  it("accepts null avatar", () => {
    const result = editProfileAvatarSchema.safeParse({ avatar: null });
    expect(result.success).toBe(true);
  });

  // Avatar must be valid URL if provided
  it("rejects invalid URL", () => {
    const result = editProfileAvatarSchema.safeParse({
      avatar: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// Forgot password schema validation tests
describe("forgotPasswordSchema", () => {
  // Valid email should pass
  it("validates correct email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  // Email should be converted to lowercase
  it("converts email to lowercase", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "User@Example.COM",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  // Invalid email format should be rejected
  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });
});

// Reset password schema validation tests
describe("resetPasswordSchema", () => {
  const validData = {
    token: "some-token",
    password: "Password123",
    confirmPassword: "Password123",
  };

  // Valid password reset should pass
  it("validates correct password reset", () => {
    const result = resetPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Password must contain at least one letter
  it("rejects password without letter", () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(result.success).toBe(false);
  });

  // Password must contain at least one number
  it("rejects password without number", () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      password: "Password",
      confirmPassword: "Password",
    });
    expect(result.success).toBe(false);
  });

  // Password must be at least 8 characters
  it("rejects password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      password: "Pass1",
      confirmPassword: "Pass1",
    });
    expect(result.success).toBe(false);
  });

  // Special characters are allowed in password
  it("accepts special characters", () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      password: "Password123!@#",
      confirmPassword: "Password123!@#",
    });
    expect(result.success).toBe(true);
  });

  // Password and confirm password must match
  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });
});

// Validate token schema validation tests
describe("validateTokenSchema", () => {
  // Token string should be accepted
  it("validates token", () => {
    const result = validateTokenSchema.safeParse({ token: "some-token" });
    expect(result.success).toBe(true);
  });
});

// Change password schema validation tests
describe("changePasswordSchema", () => {
  const validData = {
    currentPassword: "OldPassword123",
    newPassword: "NewPassword123",
    confirmPassword: "NewPassword123",
  };

  // Valid password change should pass
  it("validates correct password change", () => {
    const result = changePasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Current password is required
  it("rejects empty current password", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      currentPassword: "",
    });
    expect(result.success).toBe(false);
  });

  // New password must contain at least one letter
  it("rejects new password without letter", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "12345678",
      confirmPassword: "12345678",
    });
    expect(result.success).toBe(false);
  });

  // New password must contain at least one number
  it("rejects new password without number", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "Password",
      confirmPassword: "Password",
    });
    expect(result.success).toBe(false);
  });

  // New password and confirm password must match
  it("rejects mismatched passwords", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });

  // Special characters are allowed in new password
  it("accepts special characters in new password", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "NewPassword123!@#",
      confirmPassword: "NewPassword123!@#",
    });
    expect(result.success).toBe(true);
  });
});
