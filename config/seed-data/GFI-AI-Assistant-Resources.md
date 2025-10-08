# GFI New Agent School - AI Assistant Context Resources

This document contains all AI Assistant Context requirements extracted from the GFI onboarding redesign spec. These are preloaded knowledge requirements for the AI assistant to support agents through each task.

---

## STAGE 1: Week 1 Onboarding

### Task 1.1: Start Here: Your Week 1 Launch Pad

**AI Assistant Context:**
*The AI should be preloaded with:*
- GFI company overview and mission
- Week 1-3 roadmap summary
- Week 1 presentation: https://docs.google.com/presentation/d/1O-tb0bMxJI1L_EiW5aLka_HEkj5wzUBb/edit?slide=id.p1#slide=id.p1
- Technical help for profile completion
- State-specific licensing requirements based on user's location
- FAQ about the onboarding platform
- Reminder to check email for invitation to sign into mygficonnect for the first time

---

### Task 1.2: Enroll in Pre-Licensing Course

**AI Assistant Context:**
*The AI should be preloaded with:*
- State-by-state course requirements
- Approved provider list with pros/cons (Provider Comparison Guide)
- GFI subsidy eligibility rules
- Typical course timelines
- Troubleshooting for enrollment issues
- Ability to send enrollment confirmation to upline/manager

---

### Task 1.3: Schedule Your State Exam

**AI Assistant Context:**
*The AI should be preloaded with:*
- State exam details (course provider, cost, passing score, question count)
- Recommended study timeline
- What to bring on exam day (Get Ready for Exam Day guide)
- Rescheduling policies
- Pass/fail statistics for encouragement

---

### Task 1.4: Money. Wealth. Life Insurance.

**AI Assistant Context:**
*The AI should be preloaded with:*
- Full text of Chapters 1-3 for reference
- Quick Notes Summary and Key Concepts: https://help.wealthsmyth.ai/en/articles/11101063-read-money-wealth-life-insurance
- NOT SUPPORTED YET: 
- Common agent questions about the material
- Quiz questions for comprehension checking
- Real-world examples and analogies

---

### Task 1.5: The Client Experience

**AI Assistant Context:**
*The AI should be preloaded with:*
- The 5 Magic Questions with sample responses
- Ability to guide agent through Financial Questionnaire as a conversational exercise
- GFI's broker-dealer model (access to 25-30 AAA+ carriers including platinum providers)
- Encouragement and support for completing this self-reflection exercise

---

### Task 1.6: Attend Orientation

**AI Assistant Context:**
*The AI should be preloaded with:*
- Agenda and speaker bios
- Timezones and Zoom Codes for Weekly Training: https://docs.google.com/spreadsheets/d/1WRV7tWuDGnUVpFZp6OnlId7jKlrNN72nCzL6KXkqfLQ/edit?gid=859216918#gid=859216918
- Common orientation FAQs
- Technical support for Zoom/attendance issues
- Post-orientation checklist

---

### Task 1.7: Schedule Week 2 Coaching

**AI Assistant Context:**
*The AI should be preloaded with:*
- Trainer bio and coaching style
- What to expect in coaching calls
- Week 2 priorities (license, 3-3-60, lead building)
- The 10-6-3-1 marketing ratio
- How to prepare for effective coaching
- Rescheduling policies
- Sample questions agents typically ask in Week 2 coaching

---

## STAGE 2: Week 2 Onboarding

### Task 2.1: Learn the 3-3-60 Game Plan

**AI Assistant Context:**
*The AI should be preloaded with:*
- 3-3-60 methodology details
- Income calculator functionality
- GFI Contract Levels and Rates

---

### Task 2.2: Build Your Dream Team

**AI Assistant Context:**
*The AI should be preloaded with:*
- What Makes a Good Agency Co-Founder

---

### Task 2.3: Expand Your List with Memory Joggers

**AI Assistant Context:**
*The AI should be preloaded with:*
- Detailed memory jogger ideas
- Encouragement throughout the process
- Celebration when agent hits 50 names

---

### Task 2.4: Pass Your State Exam

**AI Assistant Context:**
*The AI should be preloaded with:*
- State-specific exam details (questions, passing score, time limit)
- Study tips and test-taking strategies
- Practice question generator
- Anxiety management tips
- What to do if you fail
- Post-pass next steps like Check Email GFI about SureLC Registration with GFI
- Ability to notify team when agent passes

---

### Task 2.5: Schedule Week 3 Coaching

**AI Assistant Context:**
*The AI should be preloaded with:*
- How to prepare for Week 3 coaching session (200 names)
- Week 3 priorities (MACHO qualification, ETHOR Script)
- Learn the Role-play scenarios
- External rescheduling policies

---

## STAGE 3: Week 3 Onboarding

### Task 3.1: Qualify Your List with MACHO

**AI Assistant Context:**
*The AI should be preloaded with:*
- Three-Part Test framework
- 3 Good Qualities detailed explanations
- MACHO criteria detailed explanations
- Connection Levels detailed explanations
- How to profile leads systematically
- Warm Network strategy and benefits
- Examples of high-priority vs. low-priority leads

---

### Task 3.2: Learn the ETHOR Script

**AI Assistant Context:**
*The AI should be preloaded with:*
- Full ETHOR script
- Role-play Practice Methods (Record yourself, Mirror, AI Role-play, Trainer Review)
- Feedback on delivery and tone
- Common objections and responses
- Reminders about calling vs. texting
- When agent sounds ready vs. needs more practice

---

### Task 3.3: Make Initial Introductions

**AI Assistant Context:**
*The AI should be preloaded with:*
- How trainers use 3 Good Qualities Script
- Tracking introductions and outcomes
- Encouragement after each attempt
- What to observe during trainer-led conversations
- Debrief prompts after each introduction

---

## STAGE 4: Field Training

### Task 4.1: Kickoff Meeting

**AI Assistant Context:**
*The AI should be preloaded with:*
- Field training methodology
- Appointment tracking functionality
- Tips for working effectively with upline
- Encouragement when agent feels nervous
- Guidance on how many appointments is realistic per week
- Ability to help agent schedule and prepare for each appointment

---

### Tasks 4.2-4.11: Appointments 1-10

**AI Assistant Context:**
*The AI should be preloaded with:*
- How to Create Rapport and Introduce Trainer
- Setup Your Zoom Background for GFI
- How to Setup Zoom AI Companion to take Notes
- Appointment structure and timing
- Pre-appointment preparation checklist
- Common objections and responses
- Meeting Types 1 (Intro / Discover) and Type 2 (Recommend)
- Post-appointment debrief

---

## Implementation Notes

**Current Status:**
These AI Assistant Context requirements are NOT currently stored in the database schema. They represent future functionality for an AI-powered onboarding assistant.

**Potential Implementation Approaches:**
1. Store as JSON in Task.resources field under an "aiContext" key
2. Create a separate AIContext table linked to Tasks
3. Maintain as external documentation for AI prompt engineering
4. Embed in application code as context for AI interactions

**Next Steps:**
- Determine implementation approach
- Map context items to specific AI capabilities
- Create prompt templates for each task type
- Test AI assistant responses with actual agents
