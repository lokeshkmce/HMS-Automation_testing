import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - Emergency & Endocrinology', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_EMERGENCY_ENDOCRINOLOGY [VALID]: Doctor Consultation for Emergency & Endocrinology', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const doctorPage = new DoctorPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('qa.emergency.endo@ominvva.com', 'password123');

    // 2. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Complete All 3 Steps of Doctor Consultation with clinical orders
    await doctorPage.completeFull3StepConsultation('Emergency & Endocrinology', {
      specialty: 'Emergency & Endocrinology',
      chiefComplaint: 'Clinical consultation and examination required for Emergency & Endocrinology',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for Emergency & Endocrinology. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - Emergency & Endocrinology',
      icd10Code: 'E11.9',
      treatmentPlan: 'Standard medical treatment and supportive care for Emergency & Endocrinology. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
