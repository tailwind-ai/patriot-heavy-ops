# Phase 2: Systematic Interface → Type Conversion Plan

## 📊 **Scope Analysis**

- **Total Interfaces**: 58 interfaces across 45 files
- **Test Coverage**: 51 comprehensive tests (45 failing, 6 placeholders)
- **Priority Levels**: HIGH → MEDIUM → LOW for systematic conversion

## 🎯 **Conversion Strategy**

### **HIGH PRIORITY: Core API Types (18 interfaces)**

**File**: `types/api.ts`
**Impact**: Critical - affects all API responses and requests
**Interfaces**: 18 core API response/request types
**Dependencies**: Used throughout components, hooks, and API routes

### **MEDIUM PRIORITY: React Components (20+ interfaces)**

**Files**: `components/**/*.tsx`
**Impact**: High - affects UI component props and rendering
**Categories**:

- User components (4 interfaces)
- UI components (2 interfaces)
- Navigation components (4 interfaces)
- Service request components (3 interfaces)
- Post components (2 interfaces)
- Form components (2 interfaces)
- Dashboard components (14 interfaces across 7 files)

### **MEDIUM PRIORITY: React Hooks (2 interfaces)**

**Files**: `hooks/use-*.ts`
**Impact**: Medium - affects form handling and state management
**Interfaces**: Hook props and return types

### **LOW PRIORITY: App Layouts (9 interfaces)**

**Files**: `app/**/layout.tsx`
**Impact**: Low - simple layout prop interfaces
**Pattern**: Mostly `{ children: React.ReactNode }` interfaces

### **LOW PRIORITY: API Routes (2 interfaces)**

**Files**: `app/api/**/route.ts`
**Impact**: Low - request/response typing for specific endpoints

### **LOW PRIORITY: Scripts & Utilities (4 interfaces)**

**Files**: `scripts/*.ts`, `__tests__/**/*.tsx`
**Impact**: Low - development and testing utilities

## 🔄 **Conversion Order (Dependency-Based)**

### **Phase 2A: Core API Types** (CRITICAL FIRST)

1. `types/api.ts` - Convert all 18 interfaces
   - Foundation for all API interactions
   - Must be done first to avoid breaking changes

### **Phase 2B: React Hooks** (SECOND)

2. `hooks/use-service-request-form.ts` - 1 interface
3. `hooks/use-operator-application-form.ts` - 1 interface
   - Used by components, convert before components

### **Phase 2C: React Components** (THIRD)

4. User components (4 files, 4 interfaces)
5. UI components (2 files, 2 interfaces)
6. Navigation components (4 files, 4 interfaces)
7. Service/Post components (5 files, 5 interfaces)
8. Dashboard components (7 files, 14 interfaces)

### **Phase 2D: Low Priority** (FINAL)

9. App layouts (9 files, 9 interfaces)
10. API routes (2 files, 2 interfaces)
11. Scripts & utilities (4 files, 4 interfaces)

## 🧪 **Testing Strategy**

- **TDD Approach**: Tests already written and failing
- **Incremental Validation**: Run tests after each phase
- **Backward Compatibility**: Ensure no breaking changes
- **Type Safety**: Maintain or improve TypeScript strictness

## 📋 **Implementation Checklist**

### Phase 2A: Core API Types

- [ ] Convert 18 interfaces in `types/api.ts`
- [ ] Run tests to confirm conversion
- [ ] Validate no breaking changes in dependent files

### Phase 2B: React Hooks

- [ ] Convert hook interfaces (2 files)
- [ ] Validate hook return types
- [ ] Test form functionality

### Phase 2C: React Components

- [ ] Convert component prop interfaces (20+ files)
- [ ] Validate React component compatibility
- [ ] Test UI rendering and interactions

### Phase 2D: Low Priority

- [ ] Convert remaining interfaces (15 files)
- [ ] Final validation tests
- [ ] Complete TypeScript compilation check

## ✅ **Success Criteria**

- [ ] All 58 interfaces converted to types
- [ ] All 51 tests passing
- [ ] TypeScript compilation clean
- [ ] No breaking changes to existing functionality
- [ ] Consistent with .cursorrules.md standards

## 🚀 **Ready for Phase 3**

After Phase 2 completion:

- Foundation + Systematic conversion complete
- Ready for Phase 3: Compatibility validation
- Ready for Phase 4: Any remaining edge cases
