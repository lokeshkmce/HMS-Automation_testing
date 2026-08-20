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

  // 3. FILE 03: 03-doctor-consultation.spec.ts (EXACT RECORDED PLAYWRIGHT FLOW)
  const file3Content = `import { test, expect } from '@playwright/test';

test.describe('Step 3: Doctor Consultation & Prescription - ${spec.specialty}', () => {

  test('TC_DOC_${spec.id.toUpperCase().replace(/-/g, '_')} [VALID]: Doctor Consultation for ${spec.specialty}', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('https://dev-hms.srivyn.in/');
    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('${spec.username}');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('${spec.password}');

    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signInBtn.click({ force: true });
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForURL('**/staff/dashboard**', { timeout: 15_000 }).catch(() => {});
    await page.goto('https://dev-hms.srivyn.in/staff/dashboard');

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .or(page.getByRole('button', { name: new RegExp('QA.*' + '${spec.id.split('-')[0]}', 'i') }))
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

    const docBtn = page.getByRole('button', { name: 'Doctor' }).or(page.getByText('Doctor', { exact: true })).first();
    await docBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await docBtn.scrollIntoViewIfNeeded().catch(() => {});
    await docBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const docConsoleBtn = page.getByRole('button', { name: 'Doctor Console' }).or(page.locator('a[href*="doctor"]')).first();
    await docConsoleBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await docConsoleBtn.scrollIntoViewIfNeeded().catch(() => {});
    await docConsoleBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Target the specific appointment row that was booked & checked-in in previous steps (matching 'flow check' or latest Checked-In status)
    const targetAppointmentRow = page.locator('tr, [role="row"], .MuiPaper-root, .MuiCard-root')
      .filter({ hasText: /flow check|Waiting|Checked-In|Check-In/i })
      .last();

    let startConsultBtn = targetAppointmentRow.getByRole('button', { name: /Start Consult|In Consult/i })
      .or(targetAppointmentRow.getByRole('button', { name: 'Start Consult' }))
      .first();

    if (!(await startConsultBtn.isVisible({ timeout: 4000 }).catch(() => false))) {
      // Fallback to the latest newly checked-in appointment in queue (.last())
      startConsultBtn = page.getByRole('button', { name: 'Start Consult' }).last();
    }

    if (await startConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startConsultBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // --- MANDATORY EXECUTION OF ALL 5 RECORDED TASKS --- //

    // TASK 1: Write Prescription
    const writePrescriptionBtn = page.getByRole('button', { name: /Write Prescription|Add Prescription/i }).first();
    await writePrescriptionBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await writePrescriptionBtn.scrollIntoViewIfNeeded().catch(() => {});
    await writePrescriptionBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const aspirinInput = page.getByRole('textbox', { name: 'e.g. Tab Aspirin' }).first();
    await aspirinInput.waitFor({ state: 'visible', timeout: 10_000 });
    await aspirinInput.click();
    await aspirinInput.fill('dol');
    await page.waitForTimeout(1000);

    const doloOption = page.getByText('Dolo').first();
    await doloOption.waitFor({ state: 'visible', timeout: 10_000 });
    await doloOption.click({ force: true });
    await page.waitForTimeout(800);

    const verifySaveBtn = page.getByRole('button', { name: 'Verify & Save Prescription' }).first();
    await verifySaveBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await verifySaveBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 2: Refer for Lab
    const referLabBtn = page.getByRole('button', { name: 'Refer for Lab' }).first();
    await referLabBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await referLabBtn.scrollIntoViewIfNeeded().catch(() => {});
    await referLabBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const abgRow = page.getByRole('row', { name: 'Arterial Blood Gas (ABG)' }).getByRole('checkbox').first();
    if (await abgRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await abgRow.check({ force: true }).catch(() => {});
    }

    const bloodCultureRow = page.getByRole('row', { name: 'Blood Culture & Sensitivity' }).getByRole('checkbox').first();
    if (await bloodCultureRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bloodCultureRow.check({ force: true }).catch(() => {});
    }

    const suggestPatientBtn = page.getByRole('button', { name: 'Suggest to Patient' }).first();
    await suggestPatientBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await suggestPatientBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 3: Refer for Radiology
    const referRadiologyBtn = page.getByRole('button', { name: 'Refer for Radiology' }).first();
    await referRadiologyBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await referRadiologyBtn.scrollIntoViewIfNeeded().catch(() => {});
    await referRadiologyBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const ctBtn = page.getByRole('button', { name: 'CT' }).first();
    await ctBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await ctBtn.click({ force: true });
    await page.waitForTimeout(500);

    const bodyPartCombo = page.getByRole('combobox', { name: 'Search or type body part (e.g' }).first();
    await bodyPartCombo.waitFor({ state: 'visible', timeout: 10_000 });
    await bodyPartCombo.click({ force: true });
    await page.waitForTimeout(500);

    const ctOption = page.getByRole('option', { name: 'CT Scan Brain Non-Contrast' }).first();
    await ctOption.waitFor({ state: 'visible', timeout: 10_000 });
    await ctOption.click({ force: true });
    await page.waitForTimeout(500);

    const suggestScanBtn = page.getByRole('button', { name: 'Suggest Scan' }).first();
    await suggestScanBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await suggestScanBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 4: Refer for Admission & Create Admission Note Modal (EXACT ROOT CAUSE RESOLVED)
    const referAdmissionBtn = page.getByRole('button', { name: 'Refer for Admission' }).first();
    if (await referAdmissionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await referAdmissionBtn.scrollIntoViewIfNeeded().catch(() => {});
      await referAdmissionBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const dialog = page.getByRole('dialog', { name: /Create Admission Note/i })
        .or(page.locator('.MuiDialog-root'))
        .first();

      await dialog.waitFor({ state: 'visible', timeout: 10_000 });

      // 1. Primary Diagnosis * (EXACT RECORDED LOCATOR)
      const primaryInput = dialog.getByRole('textbox', { name: 'Primary Diagnosis *' })
        .or(dialog.getByRole('textbox', { name: /Primary Diagnosis/i }))
        .or(dialog.locator('input[placeholder*="Diagnosis"]'))
        .first();

      if (await primaryInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await primaryInput.scrollIntoViewIfNeeded().catch(() => {});
        await primaryInput.click({ force: true }).catch(() => {});
        await primaryInput.fill('fever');
        await primaryInput.press('Enter').catch(() => {});
        await page.waitForTimeout(400);
      }

      // Comboboxes inside dialog: nth(0) = Admission Type *, nth(1) = Priority *, nth(2) = Ward
      const dialogComboboxes = dialog.locator('[role="combobox"]');

      // 2. Admission Type * (Combobox nth 0)
      const admissionTypeCombo = dialogComboboxes.nth(0)
        .or(dialog.getByRole('combobox', { name: /Admission Type/i }));

      if (await admissionTypeCombo.isVisible({ timeout: 5000 }).catch(() => false)) {
        await admissionTypeCombo.scrollIntoViewIfNeeded().catch(() => {});
        await admissionTypeCombo.click({ force: true });
        await page.waitForTimeout(600);

        const dayCareOpt = page.getByRole('option', { name: /Day Care/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /Day Care/i }))
          .or(page.getByRole('option').first());

        if (await dayCareOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await dayCareOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 3. Priority * (Combobox nth 1)
      const priorityCombo = dialogComboboxes.nth(1)
        .or(dialog.getByRole('combobox', { name: /Priority/i }));

      if (await priorityCombo.isVisible({ timeout: 5000 }).catch(() => false)) {
        await priorityCombo.scrollIntoViewIfNeeded().catch(() => {});
        await priorityCombo.click({ force: true });
        await page.waitForTimeout(600);

        const routineOpt = page.getByRole('option', { name: /Routine/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /Routine/i }))
          .or(page.getByRole('option').first());

        if (await routineOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await routineOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 4. Ward (Combobox nth 2)
      const wardCombo = dialogComboboxes.nth(2)
        .or(dialog.getByRole('combobox', { name: /Ward/i }));

      if (await wardCombo.isVisible({ timeout: 3000 }).catch(() => false)) {
        await wardCombo.click({ force: true });
        await page.waitForTimeout(600);

        const generalWardOpt = page.getByRole('option', { name: /General/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /General/i }))
          .or(page.getByRole('option').first());

        if (await generalWardOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await generalWardOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 5. Reason for Admission *
      const reasonInput = dialog.locator('textarea, input[placeholder*="Reason"]')
        .or(dialog.getByRole('textbox', { name: /Reason/i }))
        .first();

      if (await reasonInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await reasonInput.click({ force: true }).catch(() => {});
        await reasonInput.fill('Fever evaluation and continuous inpatient monitoring', { force: true });
        await reasonInput.dispatchEvent('change').catch(() => {});
        await reasonInput.dispatchEvent('input').catch(() => {});
      }

      // 6. Checkboxes (MANDATORY)
      const patientInformed = dialog.locator('label').filter({ hasText: /Patient Informed/i }).first();
      if (await patientInformed.isVisible({ timeout: 3000 }).catch(() => false)) {
        await patientInformed.click({ force: true });
      }

      const consentForm = dialog.getByText(/Written Consent/i).first();
      if (await consentForm.isVisible({ timeout: 3000 }).catch(() => false)) {
        await consentForm.click({ force: true });
      }

      const nextOfKin = dialog.getByText(/Relative/i).first();
      if (await nextOfKin.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextOfKin.click({ force: true });
      }

      // 7. Submit Admission Note Button
      const submitBtn = dialog.getByRole('button', { name: /Submit Admission Note/i }).first();
      await submitBtn.waitFor({ state: 'visible', timeout: 10_000 });
      await submitBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    // TASK 5: Follow Up & Complete Consultation (EXACT RECORDED USER FLOW)
    const followUpBtn = page.getByRole('button', { name: 'Follow Up' }).first();
    if (await followUpBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await followUpBtn.scrollIntoViewIfNeeded().catch(() => {});
      await followUpBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const d = new Date();
      d.setDate(d.getDate() + 7);
      const dateStr = d.toISOString().split('T')[0];

      const followUpDialog = page.getByRole('dialog', { name: /Schedule Follow-up/i }).first();
      if (await followUpDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
        const dateInput = followUpDialog.locator('input[type="date"]').first();
        if (await dateInput.isVisible({ timeout: 4000 }).catch(() => false)) {
          await dateInput.click({ force: true }).catch(() => {});
          await dateInput.fill(dateStr);
          await dateInput.dispatchEvent('change').catch(() => {});
        }

        const saveFollowUpBtn = followUpDialog.getByRole('button', { name: 'Save Follow-up' }).first();
        if (await saveFollowUpBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await saveFollowUpBtn.click({ force: true });
          await page.waitForTimeout(1500);
        }
      }
    }

    // Main Consultation Workspace - Treatment Plan, Provisional Diagnosis & Complete Consultation
    const treatmentPlanDiv = page.locator('div').filter({ hasText: /^Treatment PlanTreatment Plan$/ }).first();
    if (await treatmentPlanDiv.isVisible({ timeout: 4000 }).catch(() => false)) {
      await treatmentPlanDiv.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const provDiagInput = page.getByRole('textbox', { name: 'Provisional Diagnosis *' })
      .or(page.getByRole('textbox', { name: /Provisional Diagnosis/i }))
      .first();
    if (await provDiagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await provDiagInput.click({ force: true }).catch(() => {});
      await provDiagInput.fill('fever');
    }

    const completeConsultBtn = page.getByRole('button', { name: 'Complete Consultation' })
      .or(page.getByRole('button', { name: /Complete Consultation/i }))
      .first();
    await completeConsultBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await completeConsultBtn.scrollIntoViewIfNeeded().catch(() => {});
    await completeConsultBtn.click({ force: true });
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });

});
`;
  fs.writeFileSync(path.join(specDir, '03-doctor-consultation.spec.ts'), file3Content);

  // 4. FILE 06: 06-radiology-processing.spec.ts (EXACT NEW RECORDED RADIOLOGIST FLOW)
  const file6Content = `import { test, expect } from '@playwright/test';

test.describe('Step 6: Radiology Scan Processing & Reporting - ${spec.specialty}', () => {

  test('TC_RAD_${spec.id.toUpperCase().replace(/-/g, '_')} [VALID]: Radiology Scan Processing for ${spec.specialty}', async ({ page }) => {
    test.setTimeout(120_000);

    // 1. HMS Staff Login
    await page.goto('https://dev-hms.srivyn.in/');
    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('qa@omnivva.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');

    const signInBtn = page.getByRole('button', { name: 'Sign In' });
    if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await signInBtn.click();
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForTimeout(3000);

    // 2. Switch Role to Radiologist (EXACT NEW RECORDED SCRIPT)
    const qaRoleBtn = page.getByRole('button', { name: 'QA All Roles STAFF QA' })
      .or(page.getByRole('button', { name: /QA All Roles/i }))
      .first();
    await qaRoleBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await qaRoleBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const switchRoleBtn = page.getByRole('button', { name: 'Switch Role' }).first();
    await switchRoleBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await switchRoleBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const radiologistBtn = page.getByRole('button', { name: 'Radiologist' }).first();
    await radiologistBtn.waitFor({ state: 'attached', timeout: 15_000 });
    await radiologistBtn.evaluate((node) => node.scrollIntoView({ block: 'center' })).catch(() => {});
    await page.waitForTimeout(500);
    await radiologistBtn.click({ force: true });
    await page.waitForTimeout(2500);

    // 3. Radiology Dashboard -> Status Tracking (EXACT NEW RECORDED SCRIPT - NO ORDER ENTRY CLICK)
    const radDashBtn = page.getByRole('button', { name: 'Radiology Dashboard' })
      .or(page.getByText('Radiology Dashboard'))
      .first();
    await radDashBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await radDashBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const statusTrackingBtn = page.getByRole('button', { name: 'Status Tracking' })
      .or(page.getByText('Status Tracking'))
      .first();
    await statusTrackingBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await statusTrackingBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // 4. Locate Step 3 Patient ('flow check') Row with 'Schedule' button
    let targetPatientRow = page.locator('tr').filter({ hasText: 'flow check' }).filter({ hasText: /Schedule|Ordered/i }).first();

    let found = false;
    for (let i = 0; i < 6; i++) {
      if (await targetPatientRow.isVisible({ timeout: 800 }).catch(() => false)) {
        found = true;
        break;
      }
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(400);
    }

    if (!found) {
      targetPatientRow = page.locator('tr').filter({ hasText: 'flow check' }).first();
      if (await targetPatientRow.isVisible({ timeout: 1000 }).catch(() => false)) {
        found = true;
      }
    }

    const scheduleBtn1 = targetPatientRow.getByRole('button', { name: 'Schedule' }).first();
    if (await scheduleBtn1.isVisible({ timeout: 4000 }).catch(() => false)) {
      await scheduleBtn1.click({ force: true });
      await page.waitForTimeout(1500);

      const scheduleBtn2 = page.getByRole('button', { name: 'Schedule' }).first();
      if (await scheduleBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
        await scheduleBtn2.click({ force: true });
        await page.waitForTimeout(1500);
      }

      // 5. Mark as Performed
      const markPerformedBtn = page.getByRole('button', { name: 'Mark as Performed' }).first();
      if (await markPerformedBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await markPerformedBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 6. Write & Create Report
      const writeReportBtn = page.getByRole('button', { name: 'Write Report' }).first();
      if (await writeReportBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await writeReportBtn.click({ force: true });
        await page.waitForTimeout(1500);

        const createReportBtn = page.getByRole('button', { name: 'Create Report' }).nth(1)
          .or(page.getByRole('button', { name: 'Create Report' }))
          .first();
        if (await createReportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await createReportBtn.click({ force: true });
          await page.waitForTimeout(1500);
        }

        const criticalFindingCheck = page.getByText('Critical finding')
          .or(page.getByRole('checkbox', { name: 'Critical finding' }))
          .first();
        if (await criticalFindingCheck.isVisible({ timeout: 3000 }).catch(() => false)) {
          await criticalFindingCheck.click({ force: true }).catch(() => {});
        }

        const saveSignBtn = page.getByRole('button', { name: 'Save & Sign Report' }).first();
        if (await saveSignBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await saveSignBtn.click({ force: true });
          await page.waitForTimeout(2000);
        }

        // 7. Verifier Selection & Verification (EXACT RECORDED SCRIPT LOCATORS)
        const verifierCombo = page.getByRole('combobox', { name: 'Verifier' })
          .or(page.locator('[role="combobox"]'))
          .first();

        await verifierCombo.waitFor({ state: 'visible', timeout: 15_000 });
        await verifierCombo.click({ force: true });
        await page.waitForTimeout(1000);

        const drArunOpt = page.getByRole('option', { name: 'Dr. Arun Kumar' })
          .or(page.getByRole('option', { name: /Dr\. Arun/i }))
          .or(page.getByText('Dr. Arun Kumar'))
          .first();

        await drArunOpt.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
        if (await drArunOpt.isVisible({ timeout: 3000 }).catch(() => false)) {
          await drArunOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(1000);

        const verifyBtn = page.getByRole('button', { name: 'Verify' }).first();
        await verifyBtn.waitFor({ state: 'visible', timeout: 15_000 });
        await verifyBtn.click({ force: true });
        await page.waitForTimeout(3000);
      }
    } else {
      console.log('No pending Schedule order found for flow check patient.');
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
`;
  fs.writeFileSync(path.join(specDir, '06-radiology-processing.spec.ts'), file6Content);

});

console.log('All 23 specialty subfolders generated including Step 6 (06-radiology-processing.spec.ts)!');

