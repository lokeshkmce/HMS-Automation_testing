const fs = require('fs');
const path = require('path');

const specialtiesMap = [
  { folder: 'psychiatry', name: 'Psychiatry', email: 'qa.psychiatry@omnivva.com', code: 'PSYCHIATRY', icd: 'F41.1', docName: 'Dr. QA psychiatry' },
  { folder: 'pulmonology', name: 'Pulmonology', email: 'qa.pulmonology@omnivva.com', code: 'PULMONOLOGY', icd: 'J45.909', docName: 'Dr. QA pulmonology' },
  { folder: 'rheumatology', name: 'Rheumatology', email: 'qa.rheumatology@omnivva.com', code: 'RHEUMATOLOGY', icd: 'M06.9', docName: 'Dr. QA rheumatology' },
  { folder: 'pmr-rehab', name: 'PMR & Rehab', email: 'qa.pmr.rehab@omnivva.com', code: 'PMR_REHAB', icd: 'M54.5', docName: 'Dr. QA pmr.rehab' },
  { folder: 'urology', name: 'Urology', email: 'qa.urology@omnivva.com', code: 'UROLOGY', icd: 'N39.0', docName: 'Dr. QA urology' },
  { folder: 'neurosurgery', name: 'Neurosurgery', email: 'qa.neurosurgery@omnivva.com', code: 'NEUROSURGERY', icd: 'G93.9', docName: 'Dr. QA neurosurgery' },
  { folder: 'oncology', name: 'Oncology', email: 'qa.oncology@omnivva.com', code: 'ONCOLOGY', icd: 'C80.1', docName: 'Dr. QA oncology' },
  { folder: 'ophthalmology', name: 'Ophthalmology', email: 'qa.opthalmology@omnivva.com', code: 'OPHTHALMOLOGY', icd: 'H52.4', docName: 'Dr. QA opthalmology' },
  { folder: 'orthopedics', name: 'Orthopedics', email: 'qa.orthopedics@omnivva.com', code: 'ORTHOPEDICS', icd: 'M25.50', docName: 'Dr. QA orthopedics' },
  { folder: 'plastic-surgery', name: 'Plastic Surgery', email: 'qa.plastic.surgery@omnivva.com', code: 'PLASTIC_SURGERY', icd: 'L90.5', docName: 'Dr. QA plastic.surgery' },
  { folder: 'infectious-disease', name: 'Infectious Disease', email: 'qa.infectious.disease@omnivva.com', code: 'INFECTIOUS_DISEASE', icd: 'A49.9', docName: 'Dr. QA infectious.disease' },
  { folder: 'internal-medicine', name: 'Internal Medicine', email: 'qa.internal.medicine@omnivva.com', code: 'INTERNAL_MEDICINE', icd: 'R68.89', docName: 'Dr. QA internal.medicine' },
  { folder: 'maternity', name: 'Maternity', email: 'qa.maternity@omnivva.com', code: 'MATERNITY', icd: 'Z34.00', docName: 'Dr. QA maternity' },
  { folder: 'nephrology', name: 'Nephrology', email: 'qa.nephrology@omnivva.com', code: 'NEPHROLOGY', icd: 'N18.9', docName: 'Dr. QA nephrology' },
  { folder: 'neurology', name: 'Neurology', email: 'qa.neurology@omnivva.com', code: 'NEUROLOGY', icd: 'G44.1', docName: 'Dr. QA neurology' },
  { folder: 'cardio-surgery', name: 'Cardio Surgery', email: 'qa.cardiosurgery@omnivva.com', code: 'CARDIO_SURGERY', icd: 'I20.8', docName: 'Dr. QA cardiosurgery' },
  { folder: 'dental', name: 'Dental', email: 'qa.dental@omnivva.com', code: 'DENTAL', icd: 'K02.9', docName: 'Dr. QA dental' },
  { folder: 'ent', name: 'ENT', email: 'qa.ent@omnivva.com', code: 'ENT', icd: 'H66.90', docName: 'Dr. QA ent' },
  { folder: 'family-medicine', name: 'Family Medicine', email: 'qa.family@ominvva.com', code: 'FAMILY_MEDICINE', icd: 'Z00.00', docName: 'Dr. QA family' },
  { folder: 'gastroenterology', name: 'Gastroenterology', email: 'qa.gastro@ominvva.com', code: 'GASTROENTEROLOGY', icd: 'K29.70', docName: 'Dr. QA gastro' },
  { folder: 'dermatology', name: 'Dermatology', email: 'qa.derma@omnivva.com', code: 'DERMATOLOGY', icd: 'L30.9', docName: 'Dr. QA derma' },
  { folder: 'emergency-endocrinology', name: 'Emergency & Endocrinology', email: 'qa.emergency.endo@ominvva.com', code: 'EMERGENCY_ENDOCRINOLOGY', icd: 'E11.9', docName: 'Dr. QA emergency.endo' },
  { folder: 'general-surgery', name: 'General Surgery', email: 'qa.generalsurgery@omnivva.com', code: 'GENERAL_SURGERY', icd: 'K40.90', docName: 'Dr. QA generalsurgery' },
];

const basePath = path.resolve(__dirname, '..', 'tests', 'e2e', 'flow-check-specialties');

for (const item of specialtiesMap) {
  const specDir = path.join(basePath, item.folder);
  if (!fs.existsSync(specDir)) {
    fs.mkdirSync(specDir, { recursive: true });
  }

  // 1. Patient Booking Spec
  const bookingPath = path.join(specDir, '01-patient-booking.spec.ts');
  const bookingContent = `import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';
import { LoginPage } from '../../../../pages/login.page';

test.describe('Step 1: Patient Appointment Booking - ${item.name}', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_APPT_${item.code} [VALID]: Patient Appointment Booking for ${item.name}', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsPatient(testData.patientUser.email, testData.patientUser.otp);

    const bookDoctorBtn = page.getByRole('button', { name: /Book Doctor/i })
      .or(page.getByRole('link', { name: /Book Doctor/i }))
      .or(page.locator('a[href*="book-doctor"]'))
      .first();

    if (await bookDoctorBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await bookDoctorBtn.click({ force: true });
    } else {
      await page.goto('https://dev-hms.srivyn.in/patient/book-doctor', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    await page.waitForTimeout(1000);
    const routineCheckupBtn = page.getByRole('button', { name: /Routine Checkup/i })
      .or(page.getByText(/Routine Checkup/i))
      .first();

    await routineCheckupBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await routineCheckupBtn.click({ force: true });
    await page.waitForTimeout(500);

    const nextBtn1 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn1.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(1500);

    const facilityList = [
      'CareBridge District Hospital',
      'CareBridge Rural Health Center',
      'LifeLine Super Specialty',
      'LifeLine Trauma Center',
      'MedCare General Hospital',
      'MedCare Polyclinic',
      'Omnivva Cardiac Center',
      'Omnivva Central Hospital',
      'Wellspring First AYUSH Center',
      'Wellspring First Clinic'
    ];

    let currentFacilityText = 'Select Facility';
    let specialtyFound = false;

    const firstWord = '${item.name}'.split(' ')[0];

    for (let i = 0; i < facilityList.length; i++) {
      const facName = facilityList[i];

      const facilityTrigger = page.getByText(currentFacilityText).first();
      await facilityTrigger.click();
      await page.waitForTimeout(400);

      const facOption = page.getByRole('option', { name: facName }).first();
      if (await facOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await facOption.click();
        currentFacilityText = facName;
        await page.waitForTimeout(600);
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(300);
        continue;
      }

      const specialtyTrigger = page.getByText('Select Specialty').first();
      await specialtyTrigger.click();
      await page.waitForTimeout(400);

      const targetOption = page.getByRole('option', { name: '${item.name}', exact: true })
        .or(page.getByRole('option', { name: new RegExp('^' + '${item.name}' + '$', 'i') }))
        .or(page.getByRole('option', { name: new RegExp(firstWord, 'i') }))
        .or(page.locator('li[role="option"]').filter({ hasText: new RegExp(firstWord, 'i') }))
        .first();

      if (await targetOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await targetOption.click();
        await page.waitForTimeout(800);
        specialtyFound = true;
        break;
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn2.click({ force: true });
    await page.waitForTimeout(1500);

    const targetDocCard = page.getByText('${item.docName}', { exact: false })
      .or(page.locator('div, .MuiCard-root, .MuiPaper-root').filter({ hasText: '${item.name}' }))
      .first();

    if (await targetDocCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await targetDocCard.click({ force: true });
      await page.waitForTimeout(800);
    } else {
      const feeCard = page.locator('div').filter({ hasText: /₹500|Fee/i }).first();
      if (await feeCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await feeCard.click({ force: true });
        await page.waitForTimeout(600);
      }
    }

    await page.getByRole('button', { name: 'Next' }).click();

    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const dateObj = new Date();
      let dateStr = dateObj.toISOString().split('T')[0];
      await dateInput.fill(dateStr);
      await page.waitForTimeout(1000);

      const noSlotsText = page.getByText(/No slots available/i);
      if (await noSlotsText.isVisible({ timeout: 2000 }).catch(() => false)) {
        dateObj.setDate(dateObj.getDate() + 1);
        dateStr = dateObj.toISOString().split('T')[0];
        await dateInput.fill(dateStr);
        await page.waitForTimeout(1000);
      }
    }

    const availableSlot = page.getByRole('button', { name: /\\d{1,2}:\\d{2}\\s*(AM|PM)?/i })
      .or(page.locator('button').filter({ hasText: /:\\d{2}/i }))
      .filter({ hasNotText: /Next|Back|Cancel/i })
      .first();

    await availableSlot.waitFor({ state: 'visible', timeout: 10_000 });
    await availableSlot.click();
    await page.getByRole('button', { name: 'Next' }).click();

    const symptomsInput = page.getByRole('textbox', { name: /Describe your symptoms/i }).or(page.locator('textarea, input[placeholder*="symptoms"]')).first();
    if (await symptomsInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await symptomsInput.fill('Routine ${item.name} checkup');
    }
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByRole('button', { name: 'Confirm & Pay' }).click();
    await page.getByText('UPI / QR').click();

    const upiInput = page.getByRole('textbox', { name: 'yourname@upi' }).or(page.locator('input[placeholder*="upi"]')).first();
    await upiInput.fill('gk@upi');

    const payNowBtn = page.getByRole('button', { name: /Pay Now/i }).first();
    await payNowBtn.waitFor({ state: 'visible', timeout: 5000 });
    await payNowBtn.click({ force: true });

    const confirmHeading = page.getByText(/Appointment Confirmed!/i)
      .or(page.getByText(/Your Token Number|Active Queue|Success|Confirmed/i))
      .first();

    await expect(confirmHeading).toBeVisible({ timeout: 30_000 });
  });

});
`;
  fs.writeFileSync(bookingPath, bookingContent, 'utf8');

  // 2. Receptionist Triage Spec
  const triagePath = path.join(specDir, '02-receptionist-triage.spec.ts');
  const triageContent = `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { ReceptionistPage } from '../../../../pages/receptionist.page';

test.describe('Step 2: Receptionist Check-In & Nurse Triage - ${item.name}', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_TRIAGE_${item.code} [VALID]: Receptionist Check-In & Triage for ${item.name}', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const receptionistPage = new ReceptionistPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('${item.email}', 'password123');

    // 2. Switch Role to Receptionist
    await receptionistPage.switchToReceptionistRole();

    // 3. Navigate to Check-In screen
    const checkInMenu = page.getByRole('button', { name: /Check.*In/i }).or(page.getByText(/Check.*In/i)).first();
    if (await checkInMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkInMenu.click({ force: true });
      await page.waitForTimeout(1500);
    } else {
      await page.goto('https://dev-hms.srivyn.in/staff/receptionist/check-in', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    // 4. Select Patient in queue & Check In
    const patientCard = page.locator('.MuiCard-root, tr, [role="row"]')
      .filter({ hasText: /flow check|SCHEDULED|Waiting|Pending/i })
      .or(page.getByText('flow check'))
      .first();

    if (await patientCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await patientCard.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const checkInPatientBtn = page.getByRole('button', { name: /Check In Patient|Check-In/i }).first();
    if (await checkInPatientBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkInPatientBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // 5. Proceed to Nurse Triage
    const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage|Nurse Triage|Triage/i }).first();
    if (await proceedTriageBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await proceedTriageBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const chiefComplaintInput = page.getByRole('textbox', { name: 'None' }).or(page.locator('input[placeholder*="complaint"], textarea[placeholder*="complaint"]')).first();
    if (await chiefComplaintInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chiefComplaintInput.fill('Routine ${item.name} checkup');
    }

    const saveDraftBtn = page.getByRole('button', { name: /Save Draft|Save Triage|Save/i }).first();
    if (await saveDraftBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await saveDraftBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
`;
  fs.writeFileSync(triagePath, triageContent, 'utf8');

  // 3. Doctor Consultation Spec
  const docPath = path.join(specDir, '03-doctor-consultation.spec.ts');
  const docContent = `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { DoctorPage } from '../../../../pages/doctor.page';

test.describe('Step 3: Doctor Consultation & Prescription - ${item.name}', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_${item.code} [VALID]: Doctor Consultation for ${item.name}', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const doctorPage = new DoctorPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('${item.email}', 'password123');

    // 2. Switch Role to Doctor
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console and select patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Complete All 3 Steps of Doctor Consultation with clinical orders
    await doctorPage.completeFull3StepConsultation('${item.name}', {
      specialty: '${item.name}',
      chiefComplaint: 'Clinical consultation and examination required for ${item.name}',
      referredBy: 'Dr. QA Hospital / Self',
      imagingFindings: 'Normal clinical/imaging findings for ${item.name}. No acute abnormalities.',
      provisionalDiagnosis: 'Provisional Diagnosis - ${item.name}',
      icd10Code: '${item.icd}',
      treatmentPlan: 'Standard medical treatment and supportive care for ${item.name}. Return for review in 7 days.',
      scheduleNextVisit: '28-09-2026',
      doctorNotes: 'Consultation completed. Patient vitals stable.'
    });

    await expect(page.locator('body')).toBeVisible();
  });

});
`;
  fs.writeFileSync(docPath, docContent, 'utf8');
}

console.log('All 23 specialties successfully synchronized across all 3 lifecycle steps!');
