# Context Repository Seed Data

This directory contains the seed data and scripts for the onboarding platform implementation.

## 📁 File Structure

```
docs/context/seed-data/
├── teams-and-users.yaml                    # Teams and users data
├── programs/
│   ├── continental-insurance-program.yaml  # Continental Insurance programs (structure only)
│   ├── super-life-group-program.yaml       # Super Life Group programs (structure only)
│   └── maverick-realty-program.yaml        # Maverick Realty programs (structure only)
├── tasks/
│   ├── continental-insurance-tasks.yaml   # Continental Insurance task details
│   ├── super-life-group-tasks.yaml        # Super Life Group task details
│   └── maverick-realty-tasks.yaml         # Maverick Realty task details
├── seed-from-yaml.ts                       # Seed script that reads YAML files
└── README.md                               # This file
```

## 🚀 Usage

### Prerequisites

1. **Install js-yaml dependency** in the main project:

   ```bash
   npm install js-yaml
   npm install --save-dev @types/js-yaml
   ```

2. **Sync context repository** to get the latest seed data:
   ```bash
   # From the main project root
   ./scripts/sync
   ```

### Running the Seed Script

From the main project root:

```bash
# Run the comprehensive seed script
npx ts-node docs/context/seed-data/seed-from-yaml.ts

# Or add to package.json scripts:
npm run db:seed:context
```

### Individual Seed Operations

```bash
# Clear all data for fresh start
npx ts-node docs/context/seed-data/seed-from-yaml.ts --clear

# Seed only teams and users
npx ts-node docs/context/seed-data/seed-from-yaml.ts --teams-only

# Seed only programs
npx ts-node docs/context/seed-data/seed-from-yaml.ts --programs-only
```

## 📊 Data Overview

### Teams and Users

- **5 Teams**: Super Life Group, Maverick Realty, Ignite West Region Sales, Continental Insurance, Insights Product Team
- **50 Users**: 10 users per team with different roles (OWNER, ADMIN, MEMBER)
- **Mailinator Accounts**: All test accounts use mailinator.com for easy testing

### Programs

- **Continental Insurance**: New Wholesaler School (insurance wholesaler onboarding)
- **Super Life Group**: New Agent School (life insurance agent onboarding)
- **Maverick Realty**: New Realtor School (real estate agent onboarding)

### Program Structure

Each program contains:

- **5 Stages**: Week 1-3 Onboarding, Field Training, Secure First Meeting
- **Program files** define the structure (stages, outcomes, duration)
- **Task files** define the detailed implementation (individual tasks with instructions, resources, etc.)

### Task Types

READING, VIDEO, QUIZ, ASSIGNMENT, MEETING, SHADOWING, PRACTICE, CERTIFICATION, COACHING, TRAINING, NETWORKING, RESEARCH, OTHER

## 🔧 Customization

### Adding New Teams

1. Add team data to `teams-and-users.yaml`
2. Create new program YAML file in `programs/` directory (structure only)
3. Create new task YAML file in `tasks/` directory (task details)
4. Update `seed-from-yaml.ts` to include the new program and task files

### Adding New Programs

1. Create new YAML file in `programs/` directory (program structure, stages, outcomes)
2. Create new YAML file in `tasks/` directory (detailed task implementations)
3. Follow the existing structure with programs → stages and tasks → individual tasks
4. Update `seed-from-yaml.ts` to include the new program and task files

### Modifying Existing Data

1. **Program structure**: Edit files in `programs/` directory
2. **Task details**: Edit files in `tasks/` directory
3. Run the seed script to update the database
4. Changes are automatically synced via the context repository

## 🧪 Test Accounts

After running the seed script, you can use these test accounts:

### Super Life Group

- **Owner**: `1jin-soo.kim@mailinator.com` / `jin@123`
- **Admin**: `1madison.henry@mailinator.com` / `madison@123`
- **Member**: `1avery.lee@mailinator.com` / `avery@123`

### Maverick Realty

- **Owner**: `2jin-soo.kim@mailinator.com` / `jin@123`
- **Admin**: `2madison.henry@mailinator.com` / `madison@123`
- **Member**: `2avery.lee@mailinator.com` / `avery@123`

### Continental Insurance

- **Owner**: `4jin-soo.kim@mailinator.com` / `jin@123`
- **Admin**: `4madison.henry@mailinator.com` / `madison@123`
- **Member**: `4avery.lee@mailinator.com` / `avery@123`

> **Note**: All test accounts use mailinator.com for easy email testing. Check mailinator.com to see any emails sent to these accounts.

## 🔄 Refactored Structure

The seed data has been refactored to separate program structure from task implementation:

### **Program Files** (`programs/` directory)

- Define program structure (name, description, stages, outcomes)
- Contain stage definitions with desired outcomes and duration
- **No task details** - these are now in separate task files

### **Task Files** (`tasks/` directory)

- Define detailed task implementations
- Contain individual tasks with instructions, resources, duration
- Reference programs and stages by name
- Support the same task types as before

### **Benefits of Refactoring**

- **Separation of concerns**: Structure vs. implementation
- **Easier maintenance**: Update tasks without touching program structure
- **Better organization**: Related tasks grouped together
- **Scalability**: Easy to add new task files for different programs
- **Reusability**: Task definitions can be shared across programs

## 🔄 Integration with Main Project

The main project's `prisma/seed.ts` can be updated to call this context seed script:

```typescript
// In prisma/seed.ts
import { seedFromYaml } from '../docs/context/seed-data/seed-from-yaml';

async function main() {
  // Check if context repo is available
  if (fs.existsSync('./docs/context/seed-data/seed-from-yaml.ts')) {
    console.log('🌱 Using context repository seed data...');
    await seedFromYaml();
  } else {
    console.log('🌱 Using default seed data...');
    // Fall back to default seed
  }
}
```

## 📝 Maintenance

- **YAML files** are the source of truth for seed data
- **Changes to programs** should be made in YAML files, not directly in the database
- **Context repository sync** ensures all developers have the latest seed data
- **Version control** tracks changes to seed data over time
