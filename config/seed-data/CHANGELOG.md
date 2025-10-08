# Seed Data Changelog

## 2025-10-08 - GFI New Agent School Program Added

### Added
- **Global Financial Impact Team**: Added new team to `teams-and-users.yml`
  - Team slug: `global-financial-impact`
  - Domain: `globalfinancialimpact.com`
  - Users: Jin Kim (Owner), Madison Henry (Admin), Avery Lee (Member)

- **GFI New Agent School Program**: Added to seed script execution
  - File: `programs/gfi-new-agent-school-program.yml`
  - 4 stages: Week 1 Onboarding, Week 2 Onboarding, Week 3 Onboarding, Field Training
  - Total duration: 35 days

- **GFI New Agent School Tasks**: Added to seed script execution
  - File: `tasks/gfi-new-agent-school-tasks.yml`
  - 26 tasks across all 4 stages
  - Uses enhanced resource format with `name` and `url` fields

### Modified
- **seed-from-yaml.ts**: 
  - Added GFI program to `programFiles` array
  - Added GFI tasks to `taskFiles` array
  - Updated summary output to note GFI's enhanced resource format

### Technical Notes
- The enhanced resource format (`{ name: string, url: string }`) is fully backward compatible with the legacy string format
- TypeScript interfaces were updated in Issue #2 to support both formats
- The `normalizeResources()` function handles both old and new formats transparently

### Testing
- ✅ All YAML files validated for syntax
- ✅ Confirmed 26 tasks in GFI tasks file
- ✅ Verified new resource format structure
- ✅ Verified backward compatibility with existing seed files
