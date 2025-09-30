# Test Coverage Priorities - Action Plan

## 🎯 Executive Summary

**Current Coverage**: 37% overall (1,871 tests passing)  
**Target**: 70% overall within 6 weeks  
**Highest Risk**: Payment Service (4.16% coverage) - $$ Financial Impact

---

## 🔴 **PRIORITY 1: PAYMENT SERVICE** (Week 1)

### File: `lib/services/payment-service.ts`
**Current**: 4.16% | **Target**: 80%+ | **Business Impact**: CRITICAL

### Test File to Create: `__tests__/lib/services/payment-service.test.ts`

#### Required Test Scenarios:

```typescript
describe('PaymentService', () => {
  // 1. Deposit Payment Flow
  describe('createDepositPayment', () => {
    ✓ should create Stripe payment intent for deposit
    ✓ should calculate correct deposit amount (50% of total)
    ✓ should update service request with payment intent ID
    ✓ should handle Stripe API failures gracefully
    ✓ should validate minimum deposit amount
    ✓ should handle currency conversion if needed
  })

  // 2. Final Payment Flow
  describe('createFinalPayment', () => {
    ✓ should create payment intent for remaining balance
    ✓ should verify deposit was paid before final payment
    ✓ should calculate correct final amount (total - deposit)
    ✓ should handle overpayment scenarios
    ✓ should update service request status after payment
  })

  // 3. Payment Confirmation
  describe('confirmPayment', () => {
    ✓ should mark deposit as paid when confirmed
    ✓ should mark final payment as paid when confirmed
    ✓ should update service request status correctly
    ✓ should handle payment confirmation failures
    ✓ should prevent duplicate confirmations
  })

  // 4. Refund Operations
  describe('processRefund', () => {
    ✓ should create Stripe refund for deposit
    ✓ should create Stripe refund for final payment
    ✓ should update payment records after refund
    ✓ should handle partial refunds
    ✓ should handle refund failures
  })

  // 5. Webhook Handling
  describe('handleStripeWebhook', () => {
    ✓ should process payment_intent.succeeded event
    ✓ should process payment_intent.failed event
    ✓ should process charge.refunded event
    ✓ should validate webhook signature
    ✓ should handle unknown event types gracefully
    ✓ should be idempotent (handle duplicate webhooks)
  })

  // 6. Error Scenarios
  describe('error handling', () => {
    ✓ should handle network timeouts
    ✓ should handle invalid payment amounts
    ✓ should handle expired payment intents
    ✓ should handle insufficient funds
    ✓ should rollback database on payment failure
  })

  // 7. Security
  describe('security', () => {
    ✓ should never expose Stripe secret keys in logs
    ✓ should validate user owns service request
    ✓ should prevent payment manipulation
    ✓ should sanitize payment metadata
  })
})
```

**Estimated Effort**: 2-3 days  
**Risk Reduction**: HIGH

---

## 🔴 **PRIORITY 2: REGISTRATION API** (Week 1)

### File: `app/api/auth/register/route.ts`
**Current**: 0% | **Target**: 90%+ | **Business Impact**: CRITICAL

### Test File to Create: `__tests__/api/auth/register/route.test.ts`

#### Required Test Scenarios:

```typescript
describe('POST /api/auth/register', () => {
  // 1. Successful Registration
  describe('successful registration', () => {
    ✓ should create new user with valid data
    ✓ should hash password before storing
    ✓ should set default USER role
    ✓ should generate verification token
    ✓ should send verification email
    ✓ should return user data without password
  })

  // 2. Validation
  describe('input validation', () => {
    ✓ should require email
    ✓ should require password
    ✓ should validate email format
    ✓ should require minimum password length (8 chars)
    ✓ should require password complexity
    ✓ should validate name format
    ✓ should validate phone format if provided
  })

  // 3. Duplicate Prevention
  describe('duplicate handling', () => {
    ✓ should reject duplicate email
    ✓ should return appropriate error message
    ✓ should not reveal existing user information
  })

  // 4. Security
  describe('security', () => {
    ✓ should never return password in response
    ✓ should hash password with bcrypt
    ✓ should use secure salt rounds
    ✓ should prevent SQL injection
    ✓ should sanitize input data
    ✓ should rate limit registration attempts
  })

  // 5. Error Handling
  describe('error handling', () => {
    ✓ should handle database connection errors
    ✓ should handle email service failures
    ✓ should rollback on partial failures
    ✓ should return user-friendly error messages
  })
})
```

**Estimated Effort**: 1-2 days  
**Risk Reduction**: HIGH

---

## 🔴 **PRIORITY 3: WORKFLOW COMPONENTS** (Week 2)

### Files: `components/workflow/*.tsx`
**Current**: 0% | **Target**: 70%+ | **Business Impact**: HIGH

### 3A. Assignment Interface

#### Test File: `__tests__/components/workflow/assignment-interface.test.tsx`

```typescript
describe('AssignmentInterface', () => {
  // 1. Rendering
  describe('rendering', () => {
    ✓ should display available operators
    ✓ should show operator details (name, experience, certs)
    ✓ should display assignment button for each operator
    ✓ should show loading state while fetching operators
    ✓ should show empty state when no operators available
  })

  // 2. Operator Selection
  describe('operator assignment', () => {
    ✓ should call assignment API on button click
    ✓ should disable button while assigning
    ✓ should show success message after assignment
    ✓ should refresh data after successful assignment
    ✓ should handle assignment errors
  })

  // 3. Filtering
  describe('operator filtering', () => {
    ✓ should filter by certifications
    ✓ should filter by location
    ✓ should filter by availability
    ✓ should show filtered count
  })

  // 4. Permissions
  describe('permissions', () => {
    ✓ should show assignment UI for MANAGER role
    ✓ should show assignment UI for ADMIN role
    ✓ should hide assignment UI for USER role
    ✓ should hide assignment UI for OPERATOR role
  })
})
```

### 3B. Status Transition Button

#### Test File: `__tests__/components/workflow/status-transition-button.test.tsx`

```typescript
describe('StatusTransitionButton', () => {
  describe('valid transitions', () => {
    ✓ should show available transitions for current status
    ✓ should display transition button with correct label
    ✓ should call transition API on click
    ✓ should show confirmation dialog for critical transitions
    ✓ should update UI after successful transition
  })

  describe('invalid transitions', () => {
    ✓ should disable invalid transition buttons
    ✓ should show tooltip explaining why disabled
    ✓ should hide transitions not allowed for user role
  })

  describe('role-based permissions', () => {
    ✓ should allow MANAGER to transition any status
    ✓ should restrict USER transitions
    ✓ should allow OPERATOR specific transitions only
  })
})
```

**Estimated Effort**: 2-3 days  
**Risk Reduction**: MEDIUM-HIGH

---

## 🔴 **PRIORITY 4: AUTH.TS** (Week 2)

### File: `lib/auth.ts`
**Current**: 38.23% | **Target**: 90%+ | **Business Impact**: CRITICAL

### Test File: `__tests__/lib/auth.test.ts` (Expand existing)

#### Additional Test Scenarios Needed:

```typescript
describe('Auth - Additional Coverage', () => {
  // Lines 33-85 uncovered
  describe('session validation', () => {
    ✓ should validate active session tokens
    ✓ should reject expired session tokens
    ✓ should refresh expiring sessions
    ✓ should handle session store failures
    ✓ should validate session signature
  })

  // Lines 108-132 uncovered
  describe('permission checking', () => {
    ✓ should check resource-level permissions
    ✓ should check role-based permissions
    ✓ should handle permission inheritance
    ✓ should cache permission checks
    ✓ should deny by default on errors
  })

  describe('token management', () => {
    ✓ should generate secure tokens
    ✓ should rotate tokens on refresh
    ✓ should invalidate tokens on logout
    ✓ should handle concurrent token refreshes
  })
})
```

**Estimated Effort**: 1 day  
**Risk Reduction**: HIGH

---

## 🟡 **PRIORITY 5: WORKFLOW TRANSITIONS API** (Week 3)

### File: `app/api/service-requests/[requestId]/transitions/route.ts`
**Current**: 0% | **Target**: 80%+ | **Business Impact**: HIGH

### Test File to Create: `__tests__/api/service-requests/[requestId]/transitions/route.test.ts`

```typescript
describe('POST /api/service-requests/[id]/transitions', () => {
  describe('valid transitions', () => {
    ✓ should transition SUBMITTED → UNDER_REVIEW
    ✓ should transition UNDER_REVIEW → APPROVED
    ✓ should transition APPROVED → OPERATOR_MATCHING
    ✓ should create status history entry
    ✓ should validate transition is allowed
  })

  describe('invalid transitions', () => {
    ✓ should reject SUBMITTED → COMPLETED
    ✓ should reject backwards transitions
    ✓ should reject transition from terminal state
    ✓ should return appropriate error messages
  })

  describe('authorization', () => {
    ✓ should allow MANAGER all transitions
    ✓ should restrict USER transitions
    ✓ should restrict OPERATOR to specific transitions
    ✓ should validate user owns request
  })

  describe('concurrent transitions', () => {
    ✓ should handle race conditions
    ✓ should use database transactions
    ✓ should prevent duplicate transitions
  })
})
```

**Estimated Effort**: 1-2 days  
**Risk Reduction**: MEDIUM-HIGH

---

## 📊 **Implementation Timeline**

### Week 1: Critical Security & Revenue
- **Mon-Tue**: Payment Service tests (Priority 1)
- **Wed-Thu**: Registration API tests (Priority 2)
- **Fri**: Auth.ts expansion (Priority 4)
- **Deliverable**: 0% critical files eliminated

### Week 2: Core Workflows
- **Mon-Wed**: Workflow components (Priority 3)
- **Thu-Fri**: Workflow Transitions API (Priority 5)
- **Deliverable**: 55% overall coverage

### Week 3-4: Dashboard & UI
- Dashboard components: 14% → 60%
- Critical UI components: 0% → 50%
- **Deliverable**: 60% overall coverage

### Week 5-6: Subscription & Edge Cases
- Subscription service: 40% → 80%
- Repository edge cases
- Service layer gaps
- **Deliverable**: 70% overall coverage

---

## 🎓 **Testing Guidelines**

### For Payment Tests:
- Mock Stripe API calls
- Use test Stripe keys
- Test webhook signature validation
- Test idempotency keys
- Verify database rollbacks

### For Auth Tests:
- Test session expiry
- Test concurrent sessions
- Test token refresh races
- Mock external auth providers
- Test rate limiting

### For Workflow Tests:
- Test all role permissions
- Test state machine rules
- Mock database transactions
- Test concurrent access
- Test UI interactions

---

## 📈 **Success Metrics**

### Week 1 Target:
- Payment Service: 4% → 80% ✓
- Registration: 0% → 90% ✓
- Auth.ts: 38% → 80% ✓
- **Overall**: 37% → 45%

### Month 1 Target:
- No critical files at 0%
- All revenue-critical paths: 80%+
- **Overall**: 55%+

### Month 2 Target:
- All core workflows: 70%+
- **Overall**: 70%+

---

## 🚨 **Risk Mitigation**

### Immediate Risks (This Week):
1. **Payment bugs** → Financial loss
2. **Auth bugs** → Security breach
3. **Registration bugs** → User onboarding failure

### Mitigation:
- Prioritize payment tests Monday
- Deploy payment changes only after 80%+ coverage
- Add integration tests for payment flow
- Manual QA on staging before production

---

**Created**: December 2024  
**Next Review**: After Week 1 completion
