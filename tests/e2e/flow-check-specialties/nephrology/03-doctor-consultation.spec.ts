import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - Nephrology', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_NEPHROLOGY [VALID]: Doctor Consultation for Nephrology', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const doctorPage = new DoctorPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('qa.nephrology@omnivva.com', 'password123');

    // 2. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Complete All 3 Steps of Doctor Consultation with clinical orders
    await doctorPage.completeFull3StepConsultation('Nephrology', {
      specialty: 'Nephrology',
      chiefComplaint: 'Clinical consultation and examination required for Nephrology',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for Nephrology. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - Nephrology',
      icd10Code: 'N18.9',
      treatmentPlan: 'Standard medical treatment and supportive care for Nephrology. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
