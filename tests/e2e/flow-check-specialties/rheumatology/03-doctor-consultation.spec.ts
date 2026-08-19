import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - Rheumatology', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_RHEUMATOLOGY [VALID]: Doctor Consultation for Rheumatology', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const doctorPage = new DoctorPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('qa.rheumatology@omnivva.com', 'password123');

    // 2. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Complete All 3 Steps of Doctor Consultation with clinical orders
    await doctorPage.completeFull3StepConsultation('Rheumatology', {
      specialty: 'Rheumatology',
      chiefComplaint: 'Clinical consultation and examination required for Rheumatology',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for Rheumatology. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - Rheumatology',
      icd10Code: 'M06.9',
      treatmentPlan: 'Standard medical treatment and supportive care for Rheumatology. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
