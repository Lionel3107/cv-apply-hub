# AI Consent Setup Guide

## Overview
This guide explains how to set up AI consent functionality for job applications, ensuring GDPR compliance and transparency.

## Features Added

### 1. AI Consent Form
- **Location**: Job application form (`JobApplicationForm.tsx`)
- **Features**:
  - Clear explanation of AI processing
  - Required checkbox for consent
  - Information about data protection
  - Visual indicators with icons

### 2. Database Schema Updates
- **New Columns**:
  - `ai_consent` (BOOLEAN): Whether the applicant consented to AI processing
  - `consent_date` (TIMESTAMP): When the consent was given

### 3. UI Updates
- **Application Success Page**: Confirmation message about AI processing
- **Recruiter Dashboard**: Status indicators showing consent status
- **Analysis Status**: Visual indicators for consent vs no consent

## Setup Instructions

### Step 1: Apply Database Migration

1. **Go to Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Navigate to SQL Editor**
3. **Run the migration**:

```sql
-- Add AI consent fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS ai_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the fields
COMMENT ON COLUMN applications.ai_consent IS 'Whether the applicant consented to AI processing of their application materials';
COMMENT ON COLUMN applications.consent_date IS 'When the AI consent was given by the applicant';
```

### Step 2: Update Application Form Hook

The `use-application-form.tsx` hook has been updated to:
- Track consent state
- Validate consent before submission
- Store consent information in database

### Step 3: Test the Implementation

1. **Submit a new application** with consent
2. **Check the database** to verify consent is stored
3. **View in recruiter dashboard** to see consent status

## User Experience Flow

### For Job Seekers:
1. Fill out application form
2. See AI consent section with clear explanation
3. Must check consent box to proceed
4. Receive confirmation on success page

### For Recruiters:
1. View applications in dashboard
2. See consent status for each applicant
3. Only analyze applications with consent
4. Clear indicators for consent status

## Legal Compliance

### GDPR Requirements Met:
- ✅ **Transparency**: Clear explanation of AI processing
- ✅ **Consent**: Explicit opt-in required
- ✅ **Data Protection**: Information about data security
- ✅ **Right to Withdraw**: Information about data deletion
- ✅ **Record Keeping**: Consent date stored

### Privacy Policy Updates Needed:
Consider updating your privacy policy to include:
- AI processing of application materials
- Purpose of AI analysis
- Data retention policies
- User rights regarding AI-processed data

## Code Changes Summary

### Files Modified:
1. `JobApplicationForm.tsx` - Added consent UI
2. `use-application-form.tsx` - Added consent logic
3. `ApplicationSuccess.tsx` - Added confirmation message
4. `AnalysisStatusIndicator.tsx` - Added consent status
5. `use-best-applicants.tsx` - Added consent data handling
6. `JobApplicantsCard.tsx` - Added consent display
7. `applicant.ts` - Added consent types

### New Files:
1. `20250115000000_add_ai_consent_fields.sql` - Database migration
2. `AI_CONSENT_SETUP.md` - This documentation

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] Application form shows consent section
- [ ] Consent checkbox is required
- [ ] Form submission works with consent
- [ ] Consent information stored in database
- [ ] Recruiter dashboard shows consent status
- [ ] Analysis only proceeds with consent
- [ ] Success page shows confirmation message

## Troubleshooting

### Common Issues:

1. **Migration fails**: Check if columns already exist
2. **TypeScript errors**: Ensure all types are updated
3. **UI not showing**: Check if components are imported correctly
4. **Database errors**: Verify column names match exactly

### Support:
If you encounter issues, check:
1. Database schema in Supabase
2. Console logs for errors
3. Network tab for API calls
4. TypeScript compilation errors 