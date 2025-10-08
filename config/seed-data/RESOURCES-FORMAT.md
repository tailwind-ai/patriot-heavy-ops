# Task Resources Format Documentation

## Overview

The `resources` field in task YAML files supports two formats for backward compatibility:

1. **Legacy Format** (string only) - Still supported
2. **New Format** (object with name + URL) - Recommended for new tasks

## Format Examples

### Legacy Format (Still Supported)

```yaml
resources:
  actions:
    - 'Complete Your Profile'
    - 'Watch Now'
    - 'Schedule Exam'
```

**Use Case:** Simple action names without URLs

---

### New Format (Recommended)

```yaml
resources:
  actions:
    - name: 'Complete Your Profile'
      url: 'https://www.mygficonnect.com/agent-profile'
    - name: 'Watch Now'
      url: 'https://share.synthesia.io/embeds/videos/1ae9b7e9-409d-4f3d-92c7-4b16f0d14303'
    - name: 'Add Training to Your Calendar'
      url: 'https://docs.google.com/spreadsheets/d/1WRV7tWuDGnUVpFZp6OnlId7jKlrNN72nCzL6KXkqfLQ/edit'
```

**Use Case:** Actions with associated URLs for direct access

**Benefits:**
- Users can click directly to resources
- Better UX in the application
- More context about what each action does

---

### Mixed Format (Both Supported)

```yaml
resources:
  actions:
    - 'Simple Action'  # Legacy format
    - name: 'Action with URL'
      url: 'https://example.com/resource'  # New format
    - 'Another Simple Action'  # Legacy format
```

**Use Case:** Transitioning from legacy to new format, or when some actions don't have URLs

---

## Database Storage

Both formats are stored as-is in the `Task.resources` JSON field:

```json
{
  "actions": [
    "Simple Action",
    {
      "name": "Action with URL",
      "url": "https://example.com"
    }
  ]
}
```

## TypeScript Interface

```typescript
type ResourceAction = string | { name: string; url: string };

interface TaskDataFromFile {
  // ... other fields
  resources: {
    actions: ResourceAction[];
  };
}
```

## Migration Guide

### For Existing YAML Files

No changes required! Legacy format continues to work.

### For New YAML Files

Use the new format with URLs:

```yaml
resources:
  actions:
    - name: 'Action Name'
      url: 'https://full-url-to-resource'
```

### Converting Legacy to New Format

**Before:**
```yaml
resources:
  actions:
    - 'Watch Video'
```

**After:**
```yaml
resources:
  actions:
    - name: 'Watch Video'
      url: 'https://example.com/video'
```

## Example Files

- **Legacy Format:** `config/seed-data/tasks/super-life-group-tasks.yml`
- **New Format:** `config/seed-data/tasks/gfi-sample-task.yml`
- **Mixed Format:** `config/seed-data/tasks/gfi-sample-task.yml` (task #2)

## Implementation Details

The seed script (`config/seed-data/seed-from-yaml.ts`) automatically handles both formats through:

1. **Union Type:** `ResourceAction = string | { name: string; url: string }`
2. **Normalization Function:** `normalizeResources()` passes data through as-is
3. **JSON Storage:** Prisma's `Json` field type stores any valid JSON structure

No database migration is required - the existing `Task.resources` field already supports this.

## Best Practices

1. **Use new format for all new tasks** - Provides better UX
2. **Include full URLs** - Don't use relative paths
3. **Use descriptive names** - Make it clear what the action does
4. **Keep legacy files as-is** - Don't break existing implementations
5. **Test both formats** - Ensure backward compatibility

## Related Issues

- Issue #2: Schema Analysis & Updates for Resources Structure
- Epic #1: Convert GFI Onboarding Redesign to YAML Seed Data
