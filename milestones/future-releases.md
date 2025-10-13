# Future Releases

> **Source:** `context/vision.md`  
> **Last Synced:** 2025-10-13

This file tracks upcoming phases from the product vision. Run `/sync-roadmap` to update from vision.md and remove completed features.

---

## Phase 1: Core Marketplace (MVP)

**Version:** v0.3.0  
**Objective:** Launch functional marketplace connecting contractors with operators  
**Timeframe:** 3-4 months  
**Status:** Planned (Next after blog integration)

### Use Cases

1. **UC1: Operator Registration & Profile**
   - Operator creates account with military service verification (DD-214 upload)
   - Operator lists equipment capabilities, certifications, availability
   - Operator sets hourly rates, service areas, equipment types
   - **Acceptance Criteria:** Operator can register, verify military service, create complete profile with 5+ equipment types

2. **UC2: Contractor Service Request**
   - Contractor browses equipment types (excavators, dozers, loaders, graders, etc.)
   - Contractor submits service request with project details (dates, location, equipment needs)
   - System matches request with qualified operators
   - **Acceptance Criteria:** Contractor can submit request, receive 3+ matched operator profiles within 24 hours

3. **UC3: Booking & Payment Flow**
   - Contractor selects operator and confirms booking
   - Platform processes deposit payment (20% upfront via Stripe)
   - Operator accepts booking, project scheduled
   - Final payment processed upon project completion
   - **Acceptance Criteria:** End-to-end booking flow completed, payments processed securely, both parties receive confirmations

4. **UC4: Basic Dashboard**
   - Contractors view active/past bookings, operator ratings
   - Operators view job requests, earnings, upcoming projects
   - Both parties can message each other (basic messaging)
   - **Acceptance Criteria:** Both dashboards display relevant data, messaging works, status updates visible

### Success Criteria

- 10+ operators registered and verified
- 5+ contractors submitted service requests
- 3+ completed bookings with payments processed
- All critical user flows tested and working
- Deployed to production (Vercel)

---

## Phase 2: Enhanced Matching & Trust

**Version:** v0.4.0  
**Objective:** Improve operator discovery, build trust mechanisms, optimize matching  
**Timeframe:** 2-3 months  
**Prerequisites:** Phase 1 complete

### Use Cases

1. **UC5: Advanced Operator Search & Filters**
   - Contractors filter by equipment type, service area, ratings, availability
   - Map-based operator discovery (see operators near project location)
   - Saved searches and notifications for new operators
   - **Acceptance Criteria:** Contractor can search with 5+ filter criteria, map shows operator locations, saved searches send notifications

2. **UC6: Rating & Review System**
   - Contractors rate operators after project completion (1-5 stars + written review)
   - Operators rate contractors (professionalism, payment timeliness, project clarity)
   - Public rating displays on profiles
   - Dispute resolution process for contested ratings
   - **Acceptance Criteria:** Both parties can rate each other, ratings display on profiles, disputes can be submitted

3. **UC7: Certification & Credential Display**
   - Operators upload certifications (OSHA, NCCCO, manufacturer training certificates)
   - Military MOS codes displayed with explanations for civilian contractors
   - Verification badges (military service, certifications, background check)
   - **Acceptance Criteria:** Operators can upload 5+ certification types, badges display on profiles, contractors can filter by certifications

4. **UC8: Availability Calendar**
   - Operators set availability calendar (recurring schedules, blackout dates)
   - Contractors see real-time availability when browsing operators
   - Booking requests auto-declined for unavailable dates
   - **Acceptance Criteria:** Calendar integrates with booking flow, availability accurate, conflicts prevented

### Success Criteria

- Search filters reduce time-to-operator-discovery by 50%
- 80%+ of completed projects have ratings submitted
- Average rating for operators: 4.5+/5.0
- Certification uploads by 60%+ of operators
- Booking conflicts reduced by 90%

---

## Phase 3: Equipment Marketplace & Logistics

**Version:** v0.5.0  
**Objective:** Expand to equipment-only rentals, operator-only staffing, integrated logistics  
**Timeframe:** 3-4 months  
**Prerequisites:** Phase 2 complete

### Use Cases

1. **UC9: Equipment-Only Rentals**
   - Contractors can rent equipment without operator (self-operated)
   - Operators list equipment for rent (daily/weekly rates)
   - Insurance verification required for renters
   - Delivery/pickup coordination
   - **Acceptance Criteria:** Equipment listings separate from operator services, rental flow completed, insurance verified

2. **UC10: Operator-Only Staffing**
   - Contractors request operators without equipment (operate contractor's equipment)
   - Operators specify which equipment they're qualified to operate
   - Liability and insurance handled appropriately
   - **Acceptance Criteria:** Staffing requests distinct from equipment+operator bookings, liability terms clear

3. **UC11: Delivery & Logistics Coordination**
   - Equipment transport scheduling (lowboy trailers, hotshot delivery)
   - Integration with third-party logistics providers
   - Delivery tracking and notifications
   - **Acceptance Criteria:** Delivery options available, third-party integration working, tracking updates visible

4. **UC12: Multi-Day Project Management**
   - Support for multi-day/multi-week projects
   - Time tracking and daily logs
   - Progress photos and reporting
   - Milestone-based payments
   - **Acceptance Criteria:** Projects can span multiple days, time tracking accurate, milestone payments processed

### Success Criteria

- 20% of revenue from equipment-only rentals
- 15% of revenue from operator-only staffing
- Delivery logistics completed for 80%+ of equipment rentals
- Multi-day projects represent 40%+ of bookings
- Customer satisfaction remains above 85%

---

## Phase 4: Enterprise & Marketplace Expansion

**Version:** v0.6.0  
**Objective:** Scale to enterprise contractors, expand equipment types, geographic reach  
**Timeframe:** 4-6 months  
**Prerequisites:** Phase 3 complete

### Use Cases

1. **UC13: Enterprise Contractor Accounts**
   - Multi-user accounts for construction companies
   - Team management (project managers, admins, accounting)
   - Bulk booking and preferred operator pools
   - Corporate billing and invoicing
   - **Acceptance Criteria:** Enterprise accounts support 5+ users, bulk bookings work, corporate billing integrated

2. **UC14: Specialized Equipment Categories**
   - Expand beyond heavy equipment (cranes, aerial lifts, concrete equipment, paving equipment)
   - Specialty certifications (rigging, crane operation, CDL requirements)
   - Equipment-specific safety protocols
   - **Acceptance Criteria:** 10+ new equipment categories added, specialty certifications supported

3. **UC15: Geographic Expansion**
   - Expand service areas state-by-state
   - Localized operator recruiting partnerships (VFW, American Legion, SkillBridge programs)
   - Regional insurance and compliance requirements
   - **Acceptance Criteria:** Platform available in 5+ states, regional partnerships established

4. **UC16: Analytics & Reporting**
   - Contractors access project analytics (cost tracking, operator performance, equipment utilization)
   - Operators see earnings reports, utilization metrics, performance trends
   - Platform-wide insights dashboard
   - **Acceptance Criteria:** Both user types have analytics dashboards, reports exportable, insights actionable

### Success Criteria

- 10+ enterprise accounts active
- 20+ specialized equipment types listed
- Platform operational in 5+ states
- Analytics accessed by 70%+ of active users
- Annual GMV exceeds $5M

---

## Post-Phase 4: Future Considerations

These are longer-term possibilities beyond the current 18-month roadmap:

- **Mobile Apps**: Native iOS/Android apps for on-site operator management
- **AI-Powered Matching**: Machine learning for optimal operator recommendations
- **Training & Certification**: Platform-provided training programs and certifications
- **International Expansion**: Canada, allied countries with similar military structures
- **Franchise Model**: Regional operator cooperatives and franchise partnerships
- **Equipment Sales**: Marketplace for buying/selling used heavy equipment
- **Insurance Products**: Platform-specific insurance products and risk management tools
- **Supply Chain Integration**: Construction materials, parts, maintenance services

---

## Release Sequencing

| Phase | Version | Timeframe | Cumulative Months |
|-------|---------|-----------|-------------------|
| Blog (Current) | v0.2.0 | 1 month | 0-1 |
| Phase 1 MVP | v0.3.0 | 3-4 months | 1-5 |
| Phase 2 Trust | v0.4.0 | 2-3 months | 5-8 |
| Phase 3 Logistics | v0.5.0 | 3-4 months | 8-12 |
| Phase 4 Enterprise | v0.6.0 | 4-6 months | 12-18 |

**Total to Phase 4:** 18 months from blog launch
