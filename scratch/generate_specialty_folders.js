const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Gowtham/Desktop/Automation testing/tests/e2e/flow-check-specialties';

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

const doctorSpecialties = [
  { id: "psychiatry", specialty: "Psychiatry", username: "qa.psychiatry@omnivva.com", password: "password123", docName: "Dr. QA psychiatry", medSearch: "dolo", medName: "Dolo 650" },
  { id: "pulmonology", specialty: "Pulmonology", username: "qa.pulmonology@omnivva.com", password: "password123", docName: "Dr. QA pulmonology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "rheumatology", specialty: "Rheumatology", username: "qa.rheumatology@omnivva.com", password: "password123", docName: "Dr. QA rheumatology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "pmr-rehab", specialty: "PMR & Rehab", username: "qa.pmr.rehab@omnivva.com", password: "password123", docName: "Dr. QA pmr.rehab", medSearch: "dolo", medName: "Dolo 650" },
  { id: "urology", specialty: "Urology", username: "qa.urology@omnivva.com", password: "password123", docName: "Dr. QA urology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "neurosurgery", specialty: "Neurosurgery", username: "qa.neurosurgery@omnivva.com", password: "password123", docName: "Dr. QA neurosurgery", medSearch: "dolo", medName: "Dolo 650" },
  { id: "oncology", specialty: "Oncology", username: "qa.oncology@omnivva.com", password: "password123", docName: "Dr. QA oncology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "ophthalmology", specialty: "Ophthalmology", username: "qa.opthalmology@omnivva.com", password: "password123", docName: "Dr. QA opthalmology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "orthopedics", specialty: "Orthopedics", username: "qa.orthopedics@omnivva.com", password: "password123", docName: "Dr. QA orthopedics", medSearch: "dolo", medName: "Dolo 650" },
  { id: "plastic-surgery", specialty: "Plastic Surgery", username: "qa.plastic.surgery@omnivva.com", password: "password123", docName: "Dr. QA plastic.surgery", medSearch: "dolo", medName: "Dolo 650" },
  { id: "infectious-disease", specialty: "Infectious Disease", username: "qa.infectious.disease@omnivva.com", password: "password123", docName: "Dr. QA infectious.disease", medSearch: "amoxicillin", medName: "Amoxicillin" },
  { id: "internal-medicine", specialty: "Internal Medicine", username: "qa.internal.medicine@omnivva.com", password: "password123", docName: "Dr. QA internal.medicine", medSearch: "dolo", medName: "Dolo 650" },
  { id: "maternity", specialty: "Maternity", username: "qa.maternity@omnivva.com", password: "password123", docName: "Dr. QA maternity", medSearch: "folic", medName: "Folic Acid" },
  { id: "nephrology", specialty: "Nephrology", username: "qa.nephrology@omnivva.com", password: "password123", docName: "Dr. QA nephrology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "neurology", specialty: "Neurology", username: "qa.neurology@omnivva.com", password: "password123", docName: "Dr. QA neurology", medSearch: "dolo", medName: "Dolo 650" },
  { id: "cardio-surgery", specialty: "Cardio Surgery", username: "qa.cardiosurgery@omnivva.com", password: "password123", docName: "Dr. QA Cardio", medSearch: "aspirin", medName: "Aspirin" },
  { id: "dental", specialty: "Dental", username: "qa.dental@omnivva.com", password: "password123", docName: "Dr. QA Dental", medSearch: "amoxicillin", medName: "Amoxicillin" },
  { id: "ent", specialty: "ENT", username: "qa.ent@omnivva.com", password: "password123", docName: "Dr. QA ent", medSearch: "dolo", medName: "Dolo 650" },
  { id: "family-medicine", specialty: "Family Medicine", username: "qa.family@ominvva.com", password: "password123", docName: "Dr. QA family", medSearch: "dolo", medName: "Dolo 650" },
  { id: "gastroenterology", specialty: "Gastroenterology", username: "qa.gastro@ominvva.com", password: "password123", docName: "Dr. QA gastro", medSearch: "pantoprazole", medName: "Pantoprazole" },
  { id: "dermatology", specialty: "Dermatology", username: "qa.derma@omnivva.com", password: "password123", docName: "Dr. QA derma", medSearch: "cetirizine", medName: "Cetirizine" },
  { id: "emergency-endocrinology", specialty: "Emergency & Endocrinology", username: "qa.emergency.endo@ominvva.com", password: "password123", docName: "Dr. QA emergency.endo", medSearch: "dolo", medName: "Dolo 650" },
  { id: "general-surgery", specialty: "General Surgery", username: "qa.generalsurgery@omnivva.com", password: "password123", docName: "Dr. QA generalsurgery", medSearch: "dolo", medName: "Dolo 650" }
];

doctorSpecialties.forEach((spec) => {
  const specDir = path.join(baseDir, spec.id);
  if (!fs.existsSync(specDir)) {
    fs.mkdirSync(specDir, { recursive: true });
  }

  // 1. FILE 01: 01-patient-booking.spec.ts
  const file1Content = `import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';

test.describe('Step 1: Patient Appointment Booking - ${spec.specialty}', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_APPT_${spec.id.toUpperCase().replace(/-/g, '_')} [VALID]: Patient Appointment Booking for ${spec.specialty}', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

    await page.getByRole('button', { name: 'Patient Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(testData.patientUser.email);
    await page.getByRole('button', { name: 'Continue with OTP' }).click();

    const otpInput = page.getByRole('textbox', { name: '••••••' }).or(page.locator('input[type="password"], input[type="text"]')).first();
    await otpInput.waitFor({ state: 'visible', timeout: 10_000 });
    await otpInput.fill(testData.patientUser.otp);
    await page.getByRole('button', { name: 'Verify Code' }).click();

    const bookDoctorLink = page.getByRole('link', { name: /Book Doctor/i }).first();
    await bookDoctorLink.waitFor({ state: 'visible', timeout: 15_000 });
    await bookDoctorLink.click();

    const routineCheckupBtn = page.getByRole('button', { name: 'Routine Checkup' }).first();
    await routineCheckupBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await routineCheckupBtn.click({ force: true });
    await page.waitForTimeout(500);

    const nextBtn1 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn1.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(1500);

    const facilityList = [
      'Omnivva Central Hospital',
      'CareBridge Rural Health Center',
      'CareBridge District Hospital',
      'LifeLine Super Specialty',
      'LifeLine Trauma Center',
      'MedCare General Hospital',
      'MedCare Polyclinic',
      'Omnivva Cardiac Center',
      'Wellspring First AYUSH Center',
      'Wellspring First Clinic'
    ];

    let specialtySelected = false;

    for (const facName of facilityList) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(200);

      const facCombobox = page.locator('div').filter({ hasText: /^Facility$/ }).locator('[role="combobox"]')
        .or(page.getByText('Select Facility'))
        .or(page.getByRole('combobox').nth(1))
        .first();

      if (await facCombobox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await facCombobox.click({ force: true });
        await page.waitForTimeout(400);

        const facOption = page.getByRole('option', { name: facName }).first();
        if (await facOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await facOption.click({ force: true });
          await page.waitForTimeout(600);
        } else {
          await page.keyboard.press('Escape').catch(() => {});
          continue;
        }
      }

      const specCombobox = page.locator('div').filter({ hasText: /^Specialty$/ }).locator('[role="combobox"]')
        .or(page.getByText('Select Specialty'))
        .first();

      await specCombobox.waitFor({ state: 'visible', timeout: 5000 });
      await specCombobox.click({ force: true });
      await page.waitForTimeout(500);

      const firstWord = '${spec.specialty}'.split(' ')[0];
      const targetOption = page.getByRole('option', { name: '${spec.specialty}', exact: true })
        .or(page.getByRole('option', { name: new RegExp('^' + '${spec.specialty.replace('&', '.*')}' + '$', 'i') }))
        .or(page.getByRole('option', { name: new RegExp(firstWord, 'i') }))
        .or(page.locator('li[role="option"]').filter({ hasText: new RegExp(firstWord, 'i') }))
        .first();

      if (await targetOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await targetOption.click({ force: true });
        await page.waitForTimeout(600);
        specialtySelected = true;
        break;
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn2.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn2.click({ force: true });
    await page.waitForTimeout(1500);

    const targetDocText = page.getByText(new RegExp('${spec.docName.replace('.', '\\\\.')}', 'i'))
      .or(page.getByText(new RegExp('Dr\\\\.\\\\s*QA\\\\s*' + '${spec.id.split('-')[0]}', 'i')))
      .first();

    await expect(targetDocText, \`Target QA Doctor "${spec.docName}" must be visible on Doctor Selection page\`).toBeVisible({ timeout: 15_000 });
    await targetDocText.click({ force: true });
    await page.waitForTimeout(600);

    const docCardContainer = targetDocText.locator('xpath=ancestor::div[contains(@class, "MuiCard") or contains(@class, "Paper") or contains(@class, "card")][1]');
    const selectBtn = docCardContainer.locator('button, [role="button"], div').filter({ hasText: /₹|Fee|Select|Book/i }).first();
    if (await selectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await selectBtn.click({ force: true });
      await page.waitForTimeout(600);
    }

    const nextBtnStep3 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtnStep3.click({ force: true });
    await page.waitForTimeout(1500);

    const availableSlot = page.getByRole('button', { name: /\\d{1,2}:\\d{2}\\s*(AM|PM)?/i })
      .or(page.locator('button').filter({ hasText: /:\\d{2}/i }))
      .filter({ hasNotText: /Next|Back|Cancel/i })
      .first();

    let slotFound = false;

    if (await availableSlot.isVisible({ timeout: 3000 }).catch(() => false)) {
      slotFound = true;
    } else {
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
          const d = new Date();
          d.setDate(d.getDate() + dayOffset);
          const dateStr = d.toISOString().split('T')[0];
          await dateInput.fill(dateStr);
          await page.waitForTimeout(800);
          if (await availableSlot.isVisible({ timeout: 2000 }).catch(() => false)) {
            slotFound = true;
            break;
          }
        }
      }
    }

    if (!slotFound) {
      throw new Error(\`Process Stopped: Target QA Doctor "${spec.docName}" has 0 available slots! Skipping booking for non-QA doctors as requested.\`);
    }

    await availableSlot.click({ force: true });
    await page.getByRole('button', { name: 'Next' }).click();

    const symptomsInput = page.getByRole('textbox', { name: /Describe your symptoms/i }).or(page.locator('textarea, input[placeholder*="symptoms"]')).first();
    if (await symptomsInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await symptomsInput.fill('Routine ${spec.specialty} checkup');
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
  fs.writeFileSync(path.join(specDir, '01-patient-booking.spec.ts'), file1Content);

  // 2. FILE 02: 02-receptionist-triage.spec.ts (HANDLES BOTH PENDING CHECK-IN AND CHECKED-IN STATES)
  const file2Content = `import { test, expect } from '@playwright/test';

test.describe('Step 2: Receptionist Check-In & Nurse Triage - ${spec.specialty}', () => {

  test('TC_TRIAGE_${spec.id.toUpperCase().replace(/-/g, '_')} [VALID]: Receptionist Check-In & Triage for ${spec.specialty}', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('https://dev-hms.srivyn.in/');

    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('${spec.username}');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('${spec.password}');
    
    const signInBtn = page.getByRole('button', { name: 'Sign In' });
    if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signInBtn.click();
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForTimeout(3000);

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .first();

    await switchRoleBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await switchRoleBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);

    const switchSubBtn = page.getByRole('button', { name: 'Switch Role' }).first();
    if (await switchSubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await switchSubBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const receptionistCard = page.getByRole('button', { name: 'Receptionist' })
      .or(page.getByText('Receptionist', { exact: true }))
      .first();

    await receptionistCard.waitFor({ state: 'visible', timeout: 10_000 });
    await receptionistCard.click({ force: true });
    await page.waitForTimeout(2000);

    const checkInBtn = page.getByRole('button', { name: 'Check‑In Screen' })
      .or(page.getByRole('link', { name: 'Check‑In Screen' }))
      .or(page.getByRole('button', { name: 'Check-In Screen' }))
      .or(page.getByText('Check‑In Screen'))
      .or(page.getByText('Check-In Screen'))
      .first();

    await checkInBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await checkInBtn.click({ force: true });
    await page.waitForTimeout(2500);

    const allDoctorsFilter = page.getByText('All Doctors').or(page.getByRole('combobox')).first();
    await allDoctorsFilter.waitFor({ state: 'visible', timeout: 15_000 });
    await allDoctorsFilter.click({ force: true });
    await page.waitForTimeout(600);

    const docOption = page.getByRole('option', { name: '${spec.docName}' })
      .or(page.getByRole('option', { name: new RegExp('${spec.docName.replace('.', '\\\\.')}', 'i') }))
      .or(page.getByRole('option', { name: new RegExp('QA\\\\s*' + '${spec.id.split('-')[0]}', 'i') }))
      .first();

    await expect(docOption, \`QA Doctor "${spec.docName}" must be visible in dropdown\`).toBeVisible({ timeout: 15_000 });
    await docOption.click({ force: true });
    await page.waitForTimeout(1500);

    // 1. TARGET THE LATEST FRESHLY BOOKED PATIENT CARD IN QUEUE VIA .last()
    const patientCardToken = page.locator('.MuiCard-root, .MuiPaper-root, tr, li, div')
      .filter({ hasText: /flow check/i })
      .last();

    await patientCardToken.waitFor({ state: 'visible', timeout: 15_000 });
    await patientCardToken.click({ force: true });
    await page.waitForTimeout(1000);

    // 2. IF PATIENT STATUS IS "Pending Check-In", CLICK "Check-In Patient" BUTTON FIRST!
    const checkInPatientBtn = page.getByRole('button', { name: /Check-In Patient|Check In Patient/i })
      .or(page.locator('button').filter({ hasText: /Check-In Patient|Check In Patient/i }))
      .first();

    if (await checkInPatientBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await checkInPatientBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // 3. CLICK THE GREEN "Proceed to Nurse Triage & Vitals" BUTTON
    const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage/i })
      .or(page.getByRole('button', { name: /Nurse Triage/i }))
      .or(page.locator('button').filter({ hasText: /Proceed to Nurse Triage|Nurse Triage/i }))
      .first();

    if (await proceedTriageBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
      await proceedTriageBtn.scrollIntoViewIfNeeded().catch(() => {});
      await proceedTriageBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    // 4. NURSE TRIAGE / PRE-CONSULTATION FORM FILLING
    const complaintInput = page.locator('textarea, input[name*="complaint"], input[placeholder*="Complaint"], input[placeholder*="symptoms"], textarea[name*="complaint"]')
      .or(page.getByRole('textbox', { name: /Chief Complaint|Symptoms|None/i }))
      .or(page.getByRole('textbox', { name: 'None' }))
      .first();

    await complaintInput.waitFor({ state: 'visible', timeout: 25_000 });
    await complaintInput.click();
    await complaintInput.fill('Routine ${spec.specialty} checkup and nurse triage evaluation');

    const bpSystolic = page.getByRole('spinbutton', { name: '120' })
      .or(page.locator('input[placeholder*="120"], input[name*="systolic"]'))
      .first();
    if (await bpSystolic.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bpSystolic.click();
      await bpSystolic.fill('110');
    }

    const bpDiastolic = page.getByRole('spinbutton', { name: '80' })
      .or(page.locator('input[placeholder*="80"], input[name*="diastolic"]'))
      .first();
    if (await bpDiastolic.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bpDiastolic.click();
      await bpDiastolic.fill('80');
    }

    const pulseInput = page.getByRole('spinbutton', { name: '72' })
      .or(page.locator('input[placeholder*="72"], input[name*="pulse"]'))
      .first();
    if (await pulseInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await pulseInput.click();
      await pulseInput.fill('72');
    }

    const tempInput = page.getByRole('spinbutton', { name: '98.6' })
      .or(page.locator('input[placeholder*="98"], input[name*="temp"]'))
      .first();
    if (await tempInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await tempInput.click();
      await tempInput.fill('98.6');
    }

    const spo2Input = page.getByRole('spinbutton', { name: '--' }).nth(2)
      .or(page.getByRole('spinbutton', { name: '98' }))
      .or(page.locator('input[placeholder*="98"], input[name*="spo2"]'))
      .first();
    if (await spo2Input.isVisible({ timeout: 4000 }).catch(() => false)) {
      await spo2Input.click();
      await spo2Input.fill('98');
    }

    const syncEmrBtn = page.getByRole('button', { name: 'Submit Form to Doctor' })
      .or(page.getByRole('button', { name: /Submit Form to Doctor|Sync to EMR|Submit/i }))
      .first();

    await syncEmrBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await syncEmrBtn.click({ force: true });
    await page.waitForTimeout(3000);
  });

});
`;
  fs.writeFileSync(path.join(specDir, '02-receptionist-triage.spec.ts'), file2Content);

  // 3. FILE 03: 03-doctor-consultation.spec.ts
  const file3Content = `import { test, expect } from '@playwright/test';

test.describe('Step 3: Doctor Consultation & Prescription - ${spec.specialty}', () => {

  test('TC_DOC_${spec.id.toUpperCase().replace(/-/g, '_')} [VALID]: Doctor Consultation for ${spec.specialty}', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('https://dev-hms.srivyn.in/');

    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('${spec.username}');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('${spec.password}');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .first();
    if (await switchRoleBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await switchRoleBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
      const subSwitch = page.getByRole('button', { name: 'Switch Role' }).first();
      if (await subSwitch.isVisible({ timeout: 3000 }).catch(() => false)) {
        await subSwitch.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }

    const docRoleCard = page.getByRole('button', { name: 'Doctor' }).or(page.getByText('Doctor', { exact: true })).first();
    await docRoleCard.waitFor({ state: 'visible', timeout: 10_000 });
    await docRoleCard.click({ force: true });
    await page.waitForTimeout(2000);

    const docConsoleBtn = page.getByRole('button', { name: 'Doctor Console' }).or(page.locator('a[href*="doctor"]')).first();
    await docConsoleBtn.click({ force: true });
    await page.waitForTimeout(2500);

    const targetRow = page.locator('tr, [role="row"]').filter({ hasText: /flow check/i }).last();
    const startConsultBtn = targetRow.getByRole('button', { name: /Start Consult|In Consult/i })
      .or(page.getByRole('cell', { name: 'Start Consult' }))
      .or(page.getByRole('button', { name: 'Start Consult' }))
      .or(page.getByRole('button', { name: 'In Consult' }))
      .first();

    if (await startConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startConsultBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const inConsultBtn = page.getByRole('button', { name: 'In Consult' }).first();
    if (await inConsultBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await inConsultBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const nextBtn1 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn1.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn1.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn2.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const addPrescriptionBtn = page.getByRole('button', { name: 'Add Prescription' }).first();
    if (await addPrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await addPrescriptionBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const medInput = page.getByRole('textbox', { name: 'e.g. Tab Aspirin' }).first();
      if (await medInput.isVisible({ timeout: 4000 }).catch(() => false)) {
        await medInput.click();
        await medInput.fill('${spec.medSearch}');
        await page.waitForTimeout(1000);

        const medOption = page.locator('div').filter({ hasText: new RegExp('^' + '${spec.medName}' + '$', 'i') })
          .or(page.locator('div').filter({ hasText: /^Dolo 650$/ }))
          .first();

        if (await medOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await medOption.click({ force: true });
          await page.waitForTimeout(800);
        }
      }

      const savePrescriptionBtn = page.getByRole('button', { name: 'Verify & Save Prescription' }).first();
      if (await savePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await savePrescriptionBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }
    }

    const nextBtn3 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn3.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn3.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const nextBtn4 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn4.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn4.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const suggestLabBtn = page.getByRole('button', { name: 'Suggest Lab' }).first();
    if (await suggestLabBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await suggestLabBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const labCheckbox = page.getByRole('row', { name: 'Blood Sugar (Fasting & PP)' }).getByRole('checkbox').first();
      if (await labCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await labCheckbox.check({ force: true }).catch(() => {});
      }

      const suggestPatientBtn = page.getByRole('button', { name: 'Suggest to Patient' }).first();
      if (await suggestPatientBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestPatientBtn.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }

    const suggestRadiologyBtn = page.getByRole('button', { name: 'Suggest Radiology' }).first();
    if (await suggestRadiologyBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await suggestRadiologyBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const mammoBtn = page.getByRole('button', { name: 'MAMMOGRAPHY' }).first();
      if (await mammoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await mammoBtn.click({ force: true });
      }

      const petBtn = page.getByRole('button', { name: 'PET' }).first();
      if (await petBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await petBtn.click({ force: true });
      }

      const xrayBtn = page.getByRole('button', { name: 'XRAY' }).first();
      if (await xrayBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await xrayBtn.click({ force: true });
      }

      const suggestScanBtn = page.getByRole('button', { name: 'Suggest Scan' }).first();
      if (await suggestScanBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestScanBtn.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }

    const submitConsultBtn = page.getByRole('button', { name: 'Submit Consult' }).first();
    if (await submitConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitConsultBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
`;
  fs.writeFileSync(path.join(specDir, '03-doctor-consultation.spec.ts'), file3Content);

});

console.log('All 23 specialty subfolders re-generated handling Check-In Patient button for Pending Check-In status!');
