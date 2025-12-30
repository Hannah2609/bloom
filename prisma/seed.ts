import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { Role } from "@/types/user";
import { SurveyStatus } from "@/types/survey";
const prisma = new PrismaClient();

// Company data
const company = {
  name: "Dwarf A/S",
  domain: "dwarf.dk",
  logo: "/dwarf-logo.webp",
};

// Seed data - Core users (with team membership)
const coreUsers = [
  {
    firstName: "Hannah",
    lastName: "Grenade",
    email: "hannah@dwarf.dk",
    password: "password123",
    role: "ADMIN" as Role,
  },
  {
    firstName: "Katja",
    lastName: "Krogh",
    email: "katja@dwarf.dk",
    password: "password123",
    role: "ADMIN" as Role,
  },
  {
    firstName: "Karen",
    lastName: "Hansen",
    email: "karen@dwarf.dk",
    password: "password123",
    role: "MANAGER" as Role,
  },
  {
    firstName: "Mads",
    lastName: "Andersen",
    email: "mads@dwarf.dk",
    password: "password123",
    role: "EMPLOYEE" as Role,
  },
];

// Additional employees (not in teams yet)
const additionalEmployees = [
  { firstName: "Emma", lastName: "Nielsen", email: "emma@dwarf.dk" },
  { firstName: "Oliver", lastName: "Jensen", email: "oliver@dwarf.dk" },
  { firstName: "Sofia", lastName: "Pedersen", email: "sofia@dwarf.dk" },
  { firstName: "Lucas", lastName: "Christensen", email: "lucas@dwarf.dk" },
  { firstName: "Isabella", lastName: "Larsen", email: "isabella@dwarf.dk" },
  { firstName: "William", lastName: "Sørensen", email: "william@dwarf.dk" },
  { firstName: "Ella", lastName: "Rasmussen", email: "ella@dwarf.dk" },
  { firstName: "Noah", lastName: "Jørgensen", email: "noah@dwarf.dk" },
  { firstName: "Freja", lastName: "Petersen", email: "freja@dwarf.dk" },
  { firstName: "Oscar", lastName: "Madsen", email: "oscar@dwarf.dk" },
  { firstName: "Alma", lastName: "Kristensen", email: "alma@dwarf.dk" },
  { firstName: "Victor", lastName: "Olsen", email: "victor@dwarf.dk" },
  { firstName: "Clara", lastName: "Thomsen", email: "clara@dwarf.dk" },
  { firstName: "Frederik", lastName: "Møller", email: "frederik@dwarf.dk" },
  { firstName: "Ida", lastName: "Eriksen", email: "ida@dwarf.dk" },
  { firstName: "Malthe", lastName: "Johansen", email: "malthe@dwarf.dk" },
  { firstName: "Maja", lastName: "Knudsen", email: "maja@dwarf.dk" },
  { firstName: "Carl", lastName: "Poulsen", email: "carl@dwarf.dk" },
  { firstName: "Josefine", lastName: "Jakobsen", email: "josefine@dwarf.dk" },
  { firstName: "August", lastName: "Mortensen", email: "august@dwarf.dk" },
];

const teams = [{ name: "Design" }, { name: "Frontend" }, { name: "Backend" }];

async function seedCompany() {
  console.log("🏢 Seeding company...");

  const createdCompany = await prisma.company.upsert({
    where: { domain: company.domain },
    update: company,
    create: company,
  });

  console.log(`✅ Company: ${createdCompany.name}`);
  return createdCompany;
}

async function seedUsers(companyId: string) {
  console.log("👤 Seeding users...");

  const createdUsers = [];

  // Create core users
  for (const userData of coreUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        ...userData,
        password: hashedPassword,
        companyId,
      },
      create: {
        ...userData,
        password: hashedPassword,
        companyId,
      },
    });

    createdUsers.push(user);
    console.log(`  ✓ ${user.firstName} ${user.lastName} (${user.role})`);
  }

  // Create additional employees
  for (const userData of additionalEmployees) {
    const hashedPassword = await bcrypt.hash("password123", 12);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        ...userData,
        password: hashedPassword,
        role: "EMPLOYEE" as Role,
        companyId,
      },
      create: {
        ...userData,
        password: hashedPassword,
        role: "EMPLOYEE" as Role,
        companyId,
      },
    });

    createdUsers.push(user);
    console.log(`  ✓ ${user.firstName} ${user.lastName} (EMPLOYEE)`);
  }

  console.log(
    `✅ Users: ${createdUsers.length} (${coreUsers.length} core + ${additionalEmployees.length} additional)`
  );
  return createdUsers;
}

async function seedTeams(
  companyId: string,
  allUsers: { id: string; role: Role }[]
) {
  console.log("👥 Seeding teams...");

  const createdTeams = [];

  // Only add first 4 users (core users) to teams
  const coreTeamMembers = allUsers.slice(0, coreUsers.length);

  for (const teamData of teams) {
    // Find existing team or create new one
    let team = await prisma.team.findFirst({
      where: {
        name: teamData.name,
        companyId,
      },
    });

    if (!team) {
      team = await prisma.team.create({
        data: {
          name: teamData.name,
          companyId,
        },
      });
    }

    // Add only core users to teams
    for (const user of coreTeamMembers) {
      await prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: user.id,
          },
        },
        update: {},
        create: {
          teamId: team.id,
          userId: user.id,
          role: user.role,
        },
      });
    }

    createdTeams.push(team);
    console.log(`  ✓ ${team.name} (${coreTeamMembers.length} members)`);
  }

  console.log(`✅ Teams: ${teams.length}`);
  return createdTeams;
}

// Helper function to generate random rating (1-5)
function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}

async function seedSurveys(
  companyId: string,
  teamIds: string[],
  allUsers: { id: string }[]
) {
  console.log("📋 Seeding surveys...");

  // 1. DRAFT Survey
  const draftSurvey = await prisma.survey.create({
    data: {
      title: "Q2 2025 Planning Survey",
      description: "Help us plan for the next quarter",
      status: "DRAFT" as SurveyStatus,
      isGlobal: true,
      companyId,
      questions: {
        create: [
          {
            title: "How excited are you about upcoming projects?",
            description: "Rate your enthusiasm for Q2 initiatives",
            order: 1,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How confident are you in our Q2 goals?",
            order: 2,
            required: true,
            answerType: "AGREEMENT",
          },
        ],
      },
    },
  });
  console.log(`  ✓ DRAFT: ${draftSurvey.title}`);

  // 2. ACTIVE Survey - Global (Updated dates)
  const activeSurvey = await prisma.survey.create({
    data: {
      title: "Q1 2025 Employee Engagement Survey",
      description: "Help us understand your experience at the company",
      status: "ACTIVE" as SurveyStatus,
      isGlobal: true,
      startDate: new Date("2025-12-15"),
      endDate: new Date("2026-01-31"),
      companyId,
      questions: {
        create: [
          {
            title: "How satisfied are you with work-life balance?",
            description: "Consider flexibility, workload, and time off",
            order: 1,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How valued do you feel at work?",
            order: 2,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How clear are your career growth opportunities?",
            order: 3,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How satisfied are you with team collaboration?",
            order: 4,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How would you rate company communication?",
            order: 5,
            required: true,
            answerType: "SCALE",
          },
        ],
      },
    },
  });
  console.log(`  ✓ ACTIVE (global): ${activeSurvey.title}`);

  // 3. ACTIVE Survey - Team Specific (Frontend + Backend) (Updated dates)
  const teamSurvey = await prisma.survey.create({
    data: {
      title: "Engineering Team Feedback",
      description: "Share your thoughts on our engineering practices",
      status: "ACTIVE" as SurveyStatus,
      isGlobal: false,
      startDate: new Date("2025-12-20"),
      endDate: new Date("2026-01-20"),
      companyId,
      teams: {
        create: [
          { teamId: teamIds[1] }, // Frontend
          { teamId: teamIds[2] }, // Backend
        ],
      },
      questions: {
        create: [
          {
            title: "How satisfied are you with our development tools?",
            order: 1,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How clear are technical requirements?",
            order: 2,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How effective is our code review process?",
            order: 3,
            required: true,
            answerType: "AGREEMENT",
          },
        ],
      },
    },
  });
  console.log(`  ✓ ACTIVE (Frontend + Backend): ${teamSurvey.title}`);

  // 4. CLOSED Survey with 20 responses
  const closedSurvey = await prisma.survey.create({
    data: {
      title: "Q4 2024 Year-End Reflection",
      description: "Looking back at 2024",
      status: "CLOSED" as SurveyStatus,
      isGlobal: true,
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-31"),
      companyId,
      questions: {
        create: [
          {
            title: "How satisfied were you with 2024 overall?",
            order: 1,
            required: true,
            answerType: "SATISFACTION",
          },
          {
            title: "How well did we achieve our 2024 goals?",
            order: 2,
            required: true,
            answerType: "AGREEMENT",
          },
          {
            title: "How prepared do you feel for 2025?",
            order: 3,
            required: true,
            answerType: "SCALE",
          },
        ],
      },
    },
    include: {
      questions: true,
    },
  });
  console.log(`  ✓ CLOSED: ${closedSurvey.title}`);

  // Add 20 responses to the closed survey
  console.log("  📝 Adding 20 responses to closed survey...");
  const selectedUsers = allUsers.slice(0, 20); // First 20 users

  for (const user of selectedUsers) {
    // Get user's team (if they have one)
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId: user.id },
      select: { teamId: true },
    });

    await prisma.surveyResponse.create({
      data: {
        surveyId: closedSurvey.id,
        userId: user.id,
        teamId: teamMember?.teamId,
        submittedAt: new Date(
          2024,
          11, // December
          Math.floor(Math.random() * 28) + 1 // Random day between 1-28
        ),
        answers: {
          create: closedSurvey.questions.map((question) => ({
            questionId: question.id,
            ratingValue: getRandomRating(),
          })),
        },
      },
    });
  }
  console.log(`  ✓ Added 20 responses`);

  // 5. ARCHIVED Survey
  const archivedSurvey = await prisma.survey.create({
    data: {
      title: "Q3 2024 Mid-Year Check-in",
      description: "Archived feedback from mid-2024",
      status: "ARCHIVED" as SurveyStatus,
      isGlobal: true,
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-07-31"),
      companyId,
      questions: {
        create: [
          {
            title: "How satisfied were you with H1 2024 progress?",
            order: 1,
            required: true,
            answerType: "SATISFACTION",
          },
        ],
      },
    },
  });
  console.log(`  ✓ ARCHIVED: ${archivedSurvey.title}`);

  console.log(`✅ Surveys: 5 (1 per status) + 20 responses on closed survey`);
}

async function main() {
  console.log("🌱 Starting seed...\n");

  try {
    // ✅ Clean ALL data first (avoid duplicates)
    console.log("🧹 Cleaning existing data...");
    await prisma.surveyResponse.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.surveyTeam.deleteMany({});
    await prisma.survey.deleteMany({});
    await prisma.teamMember.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("✅ Data cleaned\n");

    const company = await seedCompany();
    const users = await seedUsers(company.id);
    const teams = await seedTeams(company.id, users);
    const teamIds = teams.map((t) => t.id);
    await seedSurveys(company.id, teamIds, users);

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  • 1 company (${company.name})`);
    console.log(
      `  • ${users.length} users (${coreUsers.length} in teams, ${additionalEmployees.length} without teams)`
    );
    console.log(`  • ${teams.length} teams`);
    console.log(
      `  • 5 surveys (DRAFT, ACTIVE x2, CLOSED with 20 responses, ARCHIVED)`
    );
  } catch (error) {
    console.error("\n❌ Seed error:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
