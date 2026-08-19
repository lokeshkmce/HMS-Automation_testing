# HMS Automation Testing Suite 🏥

Comprehensive Playwright End-to-End (E2E) Test Automation Suite covering **23 Doctor Specialties** (69 E2E Spec Files) for the Srivyn Hospital Management System (HMS).

## 🚀 Suite Overview

This testing framework validates complete 3-step clinical workflows across all 23 medical specialties:
1. **Step 1: Patient Appointment Booking** (`01-patient-booking.spec.ts`)
2. **Step 2: Receptionist Check-In & Nurse Triage** (`02-receptionist-triage.spec.ts`)
3. **Step 3: Doctor Consultation & e-Prescription** (`03-doctor-consultation.spec.ts`)

---

## 🩺 Supported Doctor Specialties (23 Subfolders)

- Psychiatry
- Pulmonology
- Rheumatology
- PMR & Rehab
- Urology
- Neurosurgery
- Oncology
- Ophthalmology
- Orthopedics
- Plastic Surgery
- Infectious Disease
- Internal Medicine
- Maternity
- Nephrology
- Neurology
- Cardio Surgery
- Dental
- ENT
- Family Medicine
- Gastroenterology
- Dermatology
- Emergency & Endocrinology
- General Surgery

---

## 🛠️ Setup & Execution

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run Tests in Playwright UI Mode
```bash
npx playwright test tests/e2e/flow-check-specialties/dental --ui
```

### Run All 23 Specialty Tests (Headless)
```bash
npx playwright test tests/e2e/flow-check-specialties/
```
