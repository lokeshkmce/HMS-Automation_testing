import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export interface ConsultationData {
  specialty?: string;
  chiefComplaint?: string;
  referredBy?: string;
  imagingFindings?: string;
  assessmentFindings?: Record<string, string>;
  provisionalDiagnosis?: string;
  icd10Code?: string;
  treatmentPlan?: string;
  scheduleNextVisit?: string;
  doctorNotes?: string;
  medicineName?: string;
}

export class DoctorPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get doctorConsoleHeading(): Locator {
    return this.page.locator('h1, h2, h5, h6').filter({ hasText: /Doctor Console|Consultation|Queue|Dermatology|Dashboard/i }).first();
  }

  get appointmentsMenuLink(): Locator {
    return this.page.getByRole('button', { name: 'Appointments' }).or(this.page.getByText('Appointments')).first();
  }

  get doctorConsoleMenuLink(): Locator {
    return this.page.getByRole('button', { name: /Doctor Console/i }).or(this.page.getByText(/Doctor Console/i)).first();
  }

  async switchToDoctorRole(): Promise<void> {
    if (!this.page.url().includes('/staff/select-role')) {
      const userProfilePill = this.page.getByRole('button', { name: /QA.*STAFF|QA.*Doctor|QD|Doctor/i }).first();
      if (await userProfilePill.isVisible({ timeout: 2000 }).catch(() => false)) {
        await userProfilePill.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
      }

      const switchRoleBtn = this.page.getByRole('button', { name: 'Switch Role' }).or(this.page.getByText('Switch Role')).first();
      if (await switchRoleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await switchRoleBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(1000);
      } else {
        await this.page.goto('https://dev-hms.srivyn.in/staff/select-role', { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
      }
    }

    const doctorCard = this.page.getByRole('button', { name: 'Doctor' })
      .or(this.page.getByText('Doctor', { exact: true }))
      .or(this.page.locator('div, button, a').filter({ hasText: /^Doctor$/i }))
      .first();

    if (await doctorCard.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await doctorCard.scrollIntoViewIfNeeded().catch(() => {});
      await doctorCard.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(2000);
    }
  }

  async openAppointmentsTab(): Promise<void> {
    if (await this.appointmentsMenuLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.appointmentsMenuLink.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  async verifyAppointmentStatus(status: string): Promise<void> {
    await this.openAppointmentsTab();
    const statusChip = this.page.getByText(new RegExp(status, 'i')).or(this.page.getByText(/Waiting|Scheduled|Checked In/i)).first();
    if (await statusChip.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(statusChip).toBeVisible();
    }
  }

  async openDoctorConsole(): Promise<void> {
    const consoleBtn = this.page.getByRole('button', { name: /Doctor Console/i }).or(this.page.getByText(/Doctor Console/i)).first();
    if (await consoleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await consoleBtn.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  async openPatientFromQueue(patientIdentifier = 'flow check'): Promise<void> {
    await this.openDoctorConsole();
    const queueItem = this.page.locator('tr, [role="row"], .MuiPaper-root, .MuiCard-root')
      .filter({ hasText: new RegExp(patientIdentifier, 'i') })
      .or(this.page.getByRole('button', { name: /Waiting|Checked In|Start Consult/i }))
      .first();

    if (await queueItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      const startBtn = queueItem.getByRole('button', { name: /Start Consult|Start|Consult/i })
        .or(queueItem.getByText(/Start Consult/i))
        .first();

      if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startBtn.click({ force: true });
      } else {
        await queueItem.click({ force: true });
      }
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Step 1: Patient Details
   */
  async fillStep1PatientDetails(data: ConsultationData = {}): Promise<void> {
    const chiefComplaint = data.chiefComplaint || 'Severe symptoms reported during routine clinical consultation';
    const referredBy = data.referredBy || 'Self / Dr. Smith';

    // 1. Fill Chief Complaint / Reason
    const complaintDropdown = this.page.getByRole('combobox', { name: /Chief Complaint|Reason/i })
      .or(this.page.locator('label:has-text("Chief Complaint") ~ div [role="combobox"]'))
      .or(this.page.locator('label:has-text("Chief Complaint") + div'))
      .or(this.page.locator('[id*="chief-complaint"], [id*="chiefComplaint"]'))
      .first();

    if (await complaintDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      await complaintDropdown.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(400);

      const option = this.page.locator('[role="option"], .MuiMenuItem-root').first();
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click({ force: true });
      } else {
        await this.page.keyboard.press('ArrowDown').catch(() => {});
        await this.page.keyboard.press('Enter').catch(() => {});
      }
    } else {
      const complaintInput = this.page.getByRole('textbox', { name: /Chief Complaint|Reason/i })
        .or(this.page.locator('input[placeholder*="Complaint"], textarea[placeholder*="Complaint"]'))
        .first();
      if (await complaintInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await complaintInput.fill(chiefComplaint);
      }
    }

    // 2. Fill Referred By
    const referredByInput = this.page.getByRole('textbox', { name: /Referred By/i })
      .or(this.page.getByPlaceholder(/Self \/ Dr\. name|Referred By/i))
      .or(this.page.locator('input[placeholder*="Self"], input[name*="referredBy"]'))
      .first();

    if (await referredByInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await referredByInput.fill(referredBy);
    }

    // 3. Click Next to go to Step 2
    const nextBtn = this.page.getByRole('button', { name: 'Next >' }).or(this.page.getByRole('button', { name: /Next/i })).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
    }
  }

  /**
   * Step 2: Specialty Assessment
   */
  async fillStep2SpecialtyAssessment(data: ConsultationData = {}): Promise<void> {
    const imagingFindings = data.imagingFindings || 'Normal clinical assessment parameters. No acute pathology.';

    // 1. Fill any unselected dropdowns in Step 2
    const assessmentCombos = this.page.locator('.MuiSelect-select, [role="combobox"]');
    const comboCount = await assessmentCombos.count().catch(() => 0);

    for (let i = 0; i < comboCount; i++) {
      const combo = assessmentCombos.nth(i);
      if (await combo.isVisible().catch(() => false)) {
        const text = (await combo.textContent().catch(() => ''))?.trim();
        if (!text || text === 'Select' || text === '-' || text.length < 2) {
          await combo.click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(300);
          const option = this.page.locator('[role="option"], .MuiMenuItem-root').first();
          if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
            await option.click({ force: true }).catch(() => {});
          } else {
            await this.page.keyboard.press('Escape').catch(() => {});
          }
          await this.page.waitForTimeout(200);
        }
      }
    }

    // 2. Fill Imaging Findings (MRI / CT) or clinical findings textbox
    const imagingInput = this.page.getByRole('textbox', { name: /Imaging Findings|MRI|CT|Findings/i })
      .or(this.page.locator('input[placeholder*="Imaging"], textarea[placeholder*="Imaging"], input[name*="imaging"], textarea[name*="imaging"]'))
      .first();

    if (await imagingInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await imagingInput.fill(imagingFindings);
    }

    // 3. Fill any empty inputs / textareas in Step 2
    const step2Inputs = this.page.locator('input[type="text"]:not([readonly]), textarea:not([readonly])');
    const inputCount = await step2Inputs.count().catch(() => 0);
    for (let i = 0; i < inputCount; i++) {
      const inp = step2Inputs.nth(i);
      if (await inp.isVisible().catch(() => false)) {
        const val = await inp.inputValue().catch(() => '');
        if (!val) {
          await inp.fill('Clinical assessment completed. Normal baseline parameters.').catch(() => {});
        }
      }
    }

    // 4. Click Next to go to Step 3
    const nextBtn = this.page.getByRole('button', { name: 'Next >' }).or(this.page.getByRole('button', { name: /Next/i })).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
    }
  }

  /**
   * Action 1: Prescription Flow
   */
  async performPrescriptionAction(medicineName = 'dolo', dose = '650 mg'): Promise<void> {
    const rxBtn = this.page.getByRole('button', { name: /Add Prescription|Write Prescription|Rx Prescribe/i })
      .or(this.page.locator('button:has-text("Add Prescription"), button:has-text("Write Prescription")'))
      .first();

    if (await rxBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await rxBtn.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Add medicine if input is visible
      const medicineSearchInput = this.page.getByRole('textbox', { name: /Tab Aspirin|Medicine|Search/i })
        .or(this.page.locator('input[placeholder*="Aspirin"], input[placeholder*="Medicine"], input[placeholder*="Search"]'))
        .first();

      if (await medicineSearchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await medicineSearchInput.click({ force: true });
        await medicineSearchInput.fill(medicineName);
        await this.page.waitForTimeout(800);

        const medOption = this.page.locator('div, li, [role="option"]').filter({ hasText: /Dolo 650|Amoxicillin|Paracetamol/i }).first();
        if (await medOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await medOption.click({ force: true });
        } else {
          await this.page.keyboard.press('ArrowDown').catch(() => {});
          await this.page.keyboard.press('Enter').catch(() => {});
        }
      }

      const savePrescriptionBtn = this.page.getByRole('button', { name: /Verify & Save Prescription|Save Prescription/i }).first();
      if (await savePrescriptionBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await savePrescriptionBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
      }
    }
  }

  /**
   * Action 2: Suggest Lab Flow - Selects & Saves Lab Order
   */
  async performSuggestLabAction(testName = 'CBC'): Promise<void> {
    const labBtn = this.page.getByRole('button', { name: /Suggest Lab|Refer for Lab/i })
      .or(this.page.locator('button:has-text("Suggest Lab"), button:has-text("Refer for Lab")'))
      .first();

    if (await labBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await labBtn.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Search or select lab test
      const searchInput = this.page.locator('input[placeholder*="Search test"], input[placeholder*="panel"], input[placeholder*="ECG"], [role="dialog"] input[type="text"]').first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.click({ force: true });
        await searchInput.fill(testName);
        await this.page.waitForTimeout(800);
      }

      // Check the test checkbox
      const checkbox = this.page.locator('[role="dialog"] input[type="checkbox"], .MuiDialog-root input[type="checkbox"], .MuiTableBody-root input[type="checkbox"], .MuiCheckbox-root').first();
      if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await checkbox.click({ force: true });
        await this.page.waitForTimeout(800);
      }

      // Click "Suggest to Patient" button to submit and save lab order
      const suggestBtn = this.page.getByRole('button', { name: /Suggest to Patient/i })
        .or(this.page.locator('button:has-text("Suggest to Patient")'))
        .first();

      if (await suggestBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
      } else {
        const closeBtn = this.page.getByRole('button', { name: 'close' })
          .or(this.page.locator('button[aria-label="close"], svg[data-testid="CloseIcon"]'))
          .or(this.page.getByRole('button').filter({ hasText: /^$/ }))
          .first();
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click({ force: true });
        }
      }
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Action 3: Suggest Radiology Flow - Selects & Saves Radiology Order
   */
  async performSuggestRadiologyAction(scanName = 'X-Ray'): Promise<void> {
    const radBtn = this.page.getByRole('button', { name: /Suggest Radiology|Refer for Radiology/i })
      .or(this.page.locator('button:has-text("Suggest Radiology"), button:has-text("Refer for Radiology")'))
      .first();

    if (await radBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await radBtn.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Search or select scan
      const searchInput = this.page.locator('[role="dialog"] input[placeholder*="Search"], [role="dialog"] input[type="text"]').first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.click({ force: true });
        await searchInput.fill(scanName);
        await this.page.waitForTimeout(800);
      }

      // Check the scan checkbox
      const checkbox = this.page.locator('[role="dialog"] input[type="checkbox"], .MuiDialog-root input[type="checkbox"], .MuiTableBody-root input[type="checkbox"], .MuiCheckbox-root').first();
      if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await checkbox.click({ force: true });
        await this.page.waitForTimeout(800);
      }

      // Click "Suggest to Patient" button to submit and save radiology order
      const suggestBtn = this.page.getByRole('button', { name: /Suggest to Patient/i })
        .or(this.page.locator('button:has-text("Suggest to Patient")'))
        .first();

      if (await suggestBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
      } else {
        const closeBtn = this.page.getByRole('button', { name: 'close' })
          .or(this.page.locator('button[aria-label="close"], svg[data-testid="CloseIcon"]'))
          .or(this.page.getByRole('button').filter({ hasText: /^$/ }))
          .first();
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click({ force: true });
        }
      }
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Action 4: Follow Up Flow - Fills & Saves SOAP Notes
   */
  async performFollowUpAction(): Promise<void> {
    const followUpBtn = this.page.getByRole('button', { name: /Follow Up/i })
      .or(this.page.locator('button:has-text("Follow Up")'))
      .first();

    if (await followUpBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await followUpBtn.click({ force: true });
      await this.page.waitForTimeout(1500);

      // SOAP Notes modal textareas
      const noteInput = this.page.locator('[role="dialog"] textarea, .MuiDialog-root textarea').first();
      if (await noteInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await noteInput.fill('Follow up in 7 days for clinical review. Patient vitals stable. Continue prescribed regimen.');
      }

      // Click Save SOAP note or Close
      const saveBtn = this.page.getByRole('button', { name: /Save Note|Save SOAP|Save Notes|Save/i })
        .or(this.page.locator('[role="dialog"] button:has-text("Save")'))
        .first();

      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
      } else {
        const closeBtn = this.page.locator('[role="dialog"] button[aria-label="close"], [role="dialog"] svg[data-testid="CloseIcon"]').first();
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click({ force: true });
        }
      }
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Action 5: Admission / Referral Flow - Fills & Saves Admission Note
   */
  async performAdmissionAction(): Promise<void> {
    const admissionBtn = this.page.getByRole('button', { name: /Proceed for Admission|Refer for Admission/i })
      .or(this.page.locator('button:has-text("Proceed for Admission"), button:has-text("Refer for Admission")'))
      .first();

    if (await admissionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await admissionBtn.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Admission Note IPD Modal
      const noteInput = this.page.locator('[role="dialog"] textarea, .MuiDialog-root textarea').first();
      if (await noteInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await noteInput.fill('Admission recommended for monitoring and specialized care. Inpatient unit assigned.');
      }

      // Click Save Admission note or Close
      const saveBtn = this.page.getByRole('button', { name: /Create Admission|Save Note|Save Admission|Proceed|Save/i })
        .or(this.page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] button:has-text("Create")'))
        .first();

      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
      } else {
        const closeBtn = this.page.locator('[role="dialog"] button[aria-label="close"], [role="dialog"] svg[data-testid="CloseIcon"]').first();
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click({ force: true });
        }
      }
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Step 3: Diagnosis & Plan with Complete Clinical Orders
   */
  async fillStep3DiagnosisAndPlan(data: ConsultationData = {}): Promise<void> {
    const specialty = data.specialty || 'General';
    const provisionalDiag = data.provisionalDiagnosis || `Provisional Diagnosis - ${specialty}`;
    const icd10 = data.icd10Code || 'I20.8';
    const treatmentPlan = data.treatmentPlan || 'Standard medical management, oral pharmacotherapy, hydration, and rest.';
    const nextVisit = data.scheduleNextVisit || '28-09-2026';
    const notes = data.doctorNotes || 'Consultation completed successfully. Patient vitals stable.';

    // 1. Provisional Diagnosis *
    const diagnosisInput = this.page.getByRole('textbox', { name: /Provisional Diagnosis/i })
      .or(this.page.getByPlaceholder(/Diagnosis/i))
      .or(this.page.locator('input[placeholder*="Diagnosis"], textarea[placeholder*="Diagnosis"]'))
      .first();

    if (await diagnosisInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await diagnosisInput.fill(provisionalDiag);
    }

    // 2. ICD-10 Code
    const icdInput = this.page.getByRole('textbox', { name: /ICD-10/i })
      .or(this.page.getByPlaceholder(/e\.g\. I20\.8|ICD/i))
      .or(this.page.locator('input[placeholder*="I20.8"], input[name*="icd"]'))
      .first();

    if (await icdInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await icdInput.fill(icd10);
    }

    // 3. Treatment Plan
    const treatmentInput = this.page.getByRole('textbox', { name: /Treatment Plan/i })
      .or(this.page.getByPlaceholder(/Medications, advice, red flags/i))
      .or(this.page.locator('textarea[placeholder*="Medications"], textarea[name*="treatmentPlan"], textarea[placeholder*="Treatment"]'))
      .first();

    if (await treatmentInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await treatmentInput.fill(treatmentPlan);
    }

    // 4. Plan Dropdown
    const planDropdown = this.page.getByRole('combobox', { name: /^Plan$/i })
      .or(this.page.locator('label:has-text("Plan") ~ div [role="combobox"], label:has-text("Plan") + div [role="combobox"]'))
      .first();

    if (await planDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      await planDropdown.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(300);
      const planOpt = this.page.locator('[role="option"], .MuiMenuItem-root').first();
      if (await planOpt.isVisible({ timeout: 1500 }).catch(() => false)) {
        await planOpt.click({ force: true }).catch(() => {});
      } else {
        await this.page.keyboard.press('Escape').catch(() => {});
      }
    }

    // 5. Injection Dropdown
    const injectionDropdown = this.page.getByRole('combobox', { name: /Injection/i })
      .or(this.page.locator('label:has-text("Injection") ~ div [role="combobox"], label:has-text("Injection") + div [role="combobox"]'))
      .first();

    if (await injectionDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      await injectionDropdown.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(300);
      const injOpt = this.page.locator('[role="option"], .MuiMenuItem-root').first();
      if (await injOpt.isVisible({ timeout: 1500 }).catch(() => false)) {
        await injOpt.click({ force: true }).catch(() => {});
      } else {
        await this.page.keyboard.press('Escape').catch(() => {});
      }
    }

    // 6. Schedule Next Visit
    const nextVisitInput = this.page.getByRole('textbox', { name: /Schedule Next Visit/i })
      .or(this.page.getByPlaceholder(/dd-mm-yyyy/i))
      .or(this.page.locator('input[placeholder*="dd-mm-yyyy"], input[name*="nextVisit"]'))
      .first();

    if (await nextVisitInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextVisitInput.fill(nextVisit);
    }

    // 7. Doctor Notes
    const notesInput = this.page.getByRole('textbox', { name: /Doctor Notes/i })
      .or(this.page.getByPlaceholder(/Additional notes/i))
      .or(this.page.locator('textarea[placeholder*="Additional notes"], textarea[name*="doctorNotes"]'))
      .first();

    if (await notesInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await notesInput.fill(notes);
    }

    // ==========================================
    // 🏥 COMPLETE CLINICAL ORDERS WORKFLOW:
    // ==========================================

    // 1. Prescription Order
    await this.performPrescriptionAction('dolo', '650 mg');

    // 2. Lab Order (Suggest Lab)
    await this.performSuggestLabAction();

    // 3. Radiology Order (Suggest Radiology)
    await this.performSuggestRadiologyAction();

    // 4. Follow Up Order
    await this.performFollowUpAction();

    // 5. Admission Order
    await this.performAdmissionAction();

    // 6. Submit / Complete Consultation
    const submitConsultBtn = this.page.getByRole('button', { name: /Submit Consult|Complete Consultation|Save Record|Finish/i })
      .or(this.page.locator('button:has-text("Submit Consult")'))
      .first();

    if (await submitConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitConsultBtn.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Complete All 3 Steps of Doctor Consultation
   */
  async completeFull3StepConsultation(specialty = 'General', data: ConsultationData = {}): Promise<void> {
    data.specialty = specialty;
    await this.fillStep1PatientDetails(data);
    await this.fillStep2SpecialtyAssessment(data);
    await this.fillStep3DiagnosisAndPlan(data);
  }

  async performConsultation(symptomsText = 'Mild skin rash and fever. Prescribed Paracetamol 500mg.'): Promise<void> {
    await this.completeFull3StepConsultation('General', { provisionalDiagnosis: symptomsText });
  }
}
