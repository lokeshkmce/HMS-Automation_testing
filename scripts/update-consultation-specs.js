const fs = require('fs');
const path = require('path');

const specialtiesMap = [
  { folder: 'psychiatry', name: 'Psychiatry', email: 'qa.psychiatry@omnivva.com', code: 'PSYCHIATRY' },
  { folder: 'pulmonology', name: 'Pulmonology', email: 'qa.pulmonology@omnivva.com', code: 'PULMONOLOGY' },
  { folder: 'rheumatology', name: 'Rheumatology', email: 'qa.rheumatology@omnivva.com', code: 'RHEUMATOLOGY' },
  { folder: 'pmr-rehab', name: 'PMR & Rehab', email: 'qa.pmr.rehab@omnivva.com', code: 'PMR_REHAB' },
  { folder: 'urology', name: 'Urology', email: 'qa.urology@omnivva.com', code: 'UROLOGY' },
  { folder: 'neurosurgery', name: 'Neurosurgery', email: 'qa.neurosurgery@omnivva.com', code: 'NEUROSURGERY' },
  { folder: 'oncology', name: 'Oncology', email: 'qa.oncology@omnivva.com', code: 'ONCOLOGY' },
  { folder: 'ophthalmology', name: 'Ophthalmology', email: 'qa.opthalmology@omnivva.com', code: 'OPHTHALMOLOGY' },
  { folder: 'orthopedics', name: 'Orthopedics', email: 'qa.orthopedics@omnivva.com', code: 'ORTHOPEDICS' },
  { folder: 'plastic-surgery', name: 'Plastic Surgery', email: 'qa.plastic.surgery@omnivva.com', code: 'PLASTIC_SURGERY' },
  { folder: 'infectious-disease', name: 'Infectious Disease', email: 'qa.infectious.disease@omnivva.com', code: 'INFECTIOUS_DISEASE' },
  { folder: 'internal-medicine', name: 'Internal Medicine', email: 'qa.internal.medicine@omnivva.com', code: 'INTERNAL_MEDICINE' },
  { folder: 'maternity', name: 'Maternity', email: 'qa.maternity@omnivva.com', code: 'MATERNITY' },
  { folder: 'nephrology', name: 'Nephrology', email: 'qa.nephrology@omnivva.com', code: 'NEPHROLOGY' },
  { folder: 'neurology', name: 'Neurology', email: 'qa.neurology@omnivva.com', code: 'NEUROLOGY' },
  { folder: 'cardio-surgery', name: 'Cardio Surgery', email: 'qa.cardio.surgery@omnivva.com', code: 'CARDIO_SURGERY' },
  { folder: 'dental', name: 'Dental', email: 'qa.dental@omnivva.com', code: 'DENTAL' },
  { folder: 'ent', name: 'ENT', email: 'qa.ent@omnivva.com', code: 'ENT' },
  { folder: 'family-medicine', name: 'Family Medicine', email: 'qa.family@ominvva.com', code: 'FAMILY_MEDICINE' },
  { folder: 'gastroenterology', name: 'Gastroenterology', email: 'qa.gastro@ominvva.com', code: 'GASTROENTEROLOGY' },
  { folder: 'dermatology', name: 'Dermatology', email: 'qa.derma@omnivva.com', code: 'DERMATOLOGY' },
  { folder: 'emergency-endocrinology', name: 'Emergency & Endocrinology', email: 'qa.emergency.endo@ominvva.com', code: 'EMERGENCY_ENDOCRINOLOGY' },
  { folder: 'general-surgery', name: 'General Surgery', email: 'qa.generalsurgery@omnivva.com', code: 'GENERAL_SURGERY' },
];

const basePath = path.resolve(__dirname, '..', 'tests', 'e2e', 'flow-check-specialties');

for (const item of specialtiesMap) {
  const filePath = path.join(basePath, item.folder, '03-doctor-consultation.spec.ts');
  const content = `import { test, expect } from '@playwright/test';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - ${item.name}', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_${item.code} [VALID]: Doctor Consultation for ${item.name}', async ({ page }) => {
    const doctorPage = new DoctorPage(page);

    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

    const staffLoginBtnDoc = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtnDoc.isVisible({ timeout: 5000 }).catch(() => false)) {
      await staffLoginBtnDoc.click();
    }

    const docUserInput = page.getByRole('textbox', { name: /Username|Email/i }).first();
    await docUserInput.waitFor({ state: 'visible', timeout: 15_000 });

    const docPassInput = page.getByRole('textbox', { name: /Password/i }).first();
    const docSignInBtn = page.getByRole('button', { name: /Sign In|Submit/i }).first();

    const emailsToTry = Array.from(new Set([
      '${item.email}',
      '${item.email}'.replace('cardio.surgery', 'cardiosurgery'),
      '${item.email}'.replace('cardiosurgery', 'cardio.surgery'),
      '${item.email}'.replace('@ominvva.com', '@omnivva.com'),
      '${item.email}'.replace('@omnivva.com', '@ominvva.com')
    ]));

    for (const email of emailsToTry) {
      await docUserInput.click();
      await docUserInput.fill(email);
      await docPassInput.click();
      await docPassInput.fill('password123');

      if (await docSignInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await docSignInBtn.click();
      } else {
        await docPassInput.press('Enter');
      }

      await page.waitForTimeout(2000);
      const isInvalidDoc = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
      if (!isInvalidDoc) {
        break;
      }
    }

    await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // 1. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 2. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 3. Complete All 3 Steps of Doctor Consultation
    await doctorPage.completeFull3StepConsultation('${item.name}', {
      specialty: '${item.name}',
      chiefComplaint: 'Clinical consultation and examination required for ${item.name}',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for ${item.name}. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - ${item.name}',
      icd10Code: 'I20.8',
      treatmentPlan: 'Standard medical treatment and supportive care for ${item.name}. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}
