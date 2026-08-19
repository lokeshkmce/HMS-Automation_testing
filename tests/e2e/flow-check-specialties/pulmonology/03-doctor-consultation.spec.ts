import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - Pulmonology', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_PULMONOLOGY [VALID]: Doctor Consultation for Pulmonology', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const doctorPage = new DoctorPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('qa.pulmonology@omnivva.com', 'password123');

    // 2. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Complete All 3 Steps of Doctor Consultation with clinical orders
    await doctorPage.completeFull3StepConsultation('Pulmonology', {
      specialty: 'Pulmonology',
      chiefComplaint: 'Clinical consultation and examination required for Pulmonology',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for Pulmonology. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - Pulmonology',
      icd10Code: 'J45.909',
      treatmentPlan: 'Standard medical treatment and supportive care for Pulmonology. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
