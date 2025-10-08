import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const client = new PrismaClient();

// Types for YAML data
interface UserData {
  name: string;
  email: string;
  password: string;
  emailVerified: string | null;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface TeamData {
  name: string;
  slug: string;
  domain: string;
  defaultRole: 'MEMBER';
  users: UserData[];
}

interface TeamsData {
  teams: TeamData[];
}

interface StageData {
  name: string;
  order: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  expectedDuration: number;
  milestone?: string;
  successCriteria: string[];
}

interface ProgramData {
  name: string;
  subtitle: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  stages: StageData[];
}

interface ProgramsData {
  programs: ProgramData[];
}

// Define proper TaskType enum for type safety
type TaskType =
  | 'READING'
  | 'VIDEO'
  | 'QUIZ'
  | 'ASSIGNMENT'
  | 'MEETING'
  | 'SHADOWING'
  | 'PRACTICE'
  | 'CERTIFICATION'
  | 'COACHING'
  | 'TRAINING'
  | 'NETWORKING'
  | 'RESEARCH'
  | 'OTHER';

/**
 * Resource action can be either:
 * - Simple string format (legacy): 'Action Name'
 * - Object format (new): { name: 'Action Name', url: 'https://...' }
 */
type ResourceAction = string | { name: string; url: string };

/**
 * Task data structure from YAML files.
 * Supports both legacy and new resource formats for backward compatibility.
 */
interface TaskDataFromFile {
  program: string;
  stage: string;
  order: number;
  name: string;
  type: TaskType;
  estimatedDuration: number;
  description: string;
  instructions: string;
  resources: {
    actions: ResourceAction[];
  };
  autoComplete: boolean;
}

interface TasksData {
  tasks: TaskDataFromFile[];
}

// Helper function to parse email verification date
function parseEmailVerified(emailVerified: string | null): Date | null {
  if (!emailVerified) return null;
  return new Date(emailVerified);
}

/**
 * Normalizes resource actions to ensure consistent format in database.
 * Accepts both legacy string format and new object format with URLs.
 * 
 * @param resources - Resources object from YAML file
 * @returns Normalized resources object ready for database storage
 * 
 * @example
 * // Legacy format (still supported)
 * { actions: ['Action 1', 'Action 2'] }
 * 
 * @example
 * // New format with URLs
 * { actions: [
 *   { name: 'Watch Video', url: 'https://example.com/video' },
 *   { name: 'Download PDF', url: 'https://example.com/pdf' }
 * ]}
 * 
 * @example
 * // Mixed format (both supported)
 * { actions: [
 *   'Simple Action',
 *   { name: 'Action with URL', url: 'https://example.com' }
 * ]}
 */
function normalizeResources(resources: { actions: ResourceAction[] }): any {
  // Pass through as-is - JSON field in Prisma handles both formats
  // This function exists for future normalization if needed
  return resources;
}

// Load and parse YAML files
async function loadYamlFile<T>(filePath: string): Promise<T> {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    throw error;
  }
}

// Seed Teams and Users
async function seedTeamsAndUsers(teamsData: TeamsData) {
  console.log('🏢 Seeding Teams and Users...');

  const createdTeams: { [key: string]: any } = {};
  const createdUsers: { [key: string]: any } = {};

  for (const teamData of teamsData.teams) {
    // Check if team already exists, if not create it
    let team = await client.team.findUnique({
      where: { slug: teamData.slug },
    });

    if (!team) {
      team = await client.team.create({
        data: {
          name: teamData.name,
          slug: teamData.slug,
          domain: teamData.domain,
          defaultRole: teamData.defaultRole,
        },
      });
      console.log(`✅ Created team: ${team.name}`);
    } else {
      console.log(`⏭️  Team already exists: ${team.name}`);
    }

    createdTeams[teamData.name] = team;

    // Create users for this team
    for (const userData of teamData.users) {
      // Check if user already exists
      let user = await client.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        // Create new user
        const hashedPassword = await hash(userData.password, 12);
        user = await client.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            emailVerified: parseEmailVerified(userData.emailVerified),
          },
        });
        createdUsers[userData.email] = user;
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        createdUsers[userData.email] = user;
        console.log(`ℹ️  User already exists: ${user.name} (${user.email})`);
      }

      // Create team membership
      await client.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: user.id,
          },
        },
        update: {
          role: userData.role,
        },
        create: {
          teamId: team.id,
          userId: user.id,
          role: userData.role,
        },
      });
      console.log(`✅ Added ${user.name} to ${team.name} as ${userData.role}`);
    }
  }

  return { createdTeams, createdUsers };
}

// Seed Tasks from task files
async function seedTasks(
  tasksData: TasksData,
  teamName: string,
  createdTeams: { [key: string]: any }
) {
  console.log(`📋 Seeding Tasks for ${teamName}...`);

  const team = createdTeams[teamName];
  if (!team) {
    console.error(`❌ Team ${teamName} not found in created teams`);
    return;
  }

  for (const taskData of tasksData.tasks) {
    // Find the program
    const program = await client.program.findFirst({
      where: {
        name: taskData.program,
        teamId: team.id,
      },
    });

    if (!program) {
      console.error(
        `❌ Program ${taskData.program} not found for team ${teamName}`
      );
      continue;
    }

    // Find the stage
    const stage = await client.stage.findFirst({
      where: {
        name: taskData.stage,
        programId: program.id,
      },
    });

    if (!stage) {
      console.error(
        `❌ Stage ${taskData.stage} not found for program ${taskData.program}`
      );
      continue;
    }

    // Check if task already exists
    const existingTask = await client.task.findFirst({
      where: {
        name: taskData.name,
        stageId: stage.id,
      },
    });

    if (!existingTask) {
      await client.task.create({
        data: {
          name: taskData.name,
          description: taskData.description,
          order: taskData.order,
          status: 'ACTIVE',
          type: taskData.type,
          instructions: taskData.instructions,
          resources: normalizeResources(taskData.resources),
          estimatedDuration: taskData.estimatedDuration,
          autoComplete: taskData.autoComplete,
          stageId: stage.id,
        },
      });
      console.log(`✅ Created task: ${taskData.name}`);
    } else {
      console.log(`⏭️  Task already exists: ${taskData.name}`);
    }
  }
}

// Seed Programs, Stages, and Tasks
async function seedPrograms(
  programsData: ProgramsData,
  teamName: string,
  createdTeams: { [key: string]: any }
) {
  console.log(`📋 Seeding Programs for ${teamName}...`);

  const team = createdTeams[teamName];
  if (!team) {
    console.error(`❌ Team ${teamName} not found in created teams`);
    return;
  }

  for (const programData of programsData.programs) {
    // Check if program already exists for this team
    let program = await client.program.findFirst({
      where: {
        name: programData.name,
        teamId: team.id,
      },
    });

    if (!program) {
      program = await client.program.create({
        data: {
          name: programData.name,
          subtitle: programData.subtitle,
          description: programData.description,
          status: programData.status,
          teamId: team.id,
          totalStages: programData.stages.length,
        },
      });
      console.log(`✅ Created program: ${program.name}`);
    } else {
      console.log(`⏭️  Program already exists: ${program.name}`);
    }

    // Create stages (tasks are now handled separately)
    for (const stageData of programData.stages) {
      // Check if stage already exists for this program
      let stage = await client.stage.findFirst({
        where: {
          name: stageData.name,
          programId: program.id,
        },
      });

      if (!stage) {
        stage = await client.stage.create({
          data: {
            name: stageData.name,
            description: `${stageData.name} stage for ${program.name}`,
            order: stageData.order,
            status: stageData.status,
            expectedDuration: stageData.expectedDuration,
            programId: program.id,
          },
        });
        console.log(`✅ Created stage: ${stage.name}`);
      } else {
        console.log(`⏭️  Stage already exists: ${stage.name}`);
      }
    }
  }
}

// Main seed function
async function main() {
  try {
    console.log('🌱 Starting comprehensive seed from YAML files...');

    // Load teams and users data
    const teamsData = await loadYamlFile<TeamsData>(
      './seed-data/teams-and-users.yml'
    );
    const { createdTeams, createdUsers } = await seedTeamsAndUsers(teamsData);

    // Load and seed programs for each team
    const programFiles = [
      {
        file: './seed-data/programs/continental-insurance-program.yml',
        team: 'Continental Insurance',
      },
      {
        file: './seed-data/programs/super-life-group-program.yml',
        team: 'Super Life Group',
      },
      {
        file: './seed-data/programs/maverick-realty-program.yml',
        team: 'Maverick Realty',
      },
      {
        file: './seed-data/programs/gfi-new-agent-school-program.yml',
        team: 'Global Financial Impact',
      },
    ];

    for (const { file, team } of programFiles) {
      try {
        const programsData = await loadYamlFile<ProgramsData>(file);
        await seedPrograms(programsData, team, createdTeams);
      } catch (error) {
        console.error(`❌ Error seeding programs for ${team}:`, error);
        // Continue with other teams even if one fails
      }
    }

    // Load and seed tasks for each team
    const taskFiles = [
      {
        file: './seed-data/tasks/continental-insurance-tasks.yml',
        team: 'Continental Insurance',
      },
      {
        file: './seed-data/tasks/super-life-group-tasks.yml',
        team: 'Super Life Group',
      },
      {
        file: './seed-data/tasks/maverick-realty-tasks.yml',
        team: 'Maverick Realty',
      },
      {
        file: './seed-data/tasks/gfi-new-agent-school-tasks.yml',
        team: 'Global Financial Impact',
      },
    ];

    for (const { file, team } of taskFiles) {
      try {
        const tasksData = await loadYamlFile<TasksData>(file);
        await seedTasks(tasksData, team, createdTeams);
      } catch (error) {
        console.error(`❌ Error seeding tasks for ${team}:`, error);
        // Continue with other teams even if one fails
      }
    }

    console.log('✅ Comprehensive seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Teams created: ${Object.keys(createdTeams).length}`);
    console.log(`- Users created: ${Object.keys(createdUsers).length}`);
    console.log(`- Programs seeded for: ${programFiles.length} teams`);
    console.log(`- Task files processed: ${taskFiles.length} teams`);
    console.log('\n💡 Note: GFI New Agent School program includes 26 tasks with enhanced resource format (name + URL)');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

// Run the seed
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
}

export { main as seedFromYaml };
