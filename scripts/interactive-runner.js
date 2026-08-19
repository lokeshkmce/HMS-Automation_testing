/**
 * ============================================================
 *  INTERACTIVE CLI RUNNER
 *  ============================================================
 *  This is a Node.js "Wrapper" script. It does NOT touch any
 *  Playwright test files. It simply asks the user what they
 *  want to do, then launches Playwright as a child process.
 *
 *  HOW TO RUN:
 *    npm run test:interactive
 * ============================================================
 */

const readline = require('readline');
const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

// ── Terminal color helpers ──────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  dim:    '\x1b[2m',
};

// ── Root directory of the project ──────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Available spec files the user can target ───────────────
const SPEC_FILES = {
  '1': { label: 'Login Tests',                file: 'tests/e2e/login.spec.ts' },
  '2': { label: 'Add Enquiry Tests',          file: 'tests/e2e/addEnquiry.spec.ts' },
  '3': { label: 'Counsellor Portal Tests',    file: 'tests/e2e/counsellorPortal.spec.ts' },
  '4': { label: 'Validations Tests',          file: 'tests/e2e/validations.spec.ts' },
  '5': { label: 'Advanced Tests',             file: 'tests/e2e/advancedTests.spec.ts' },
  '6': { label: 'Comprehensive Test Plan',    file: 'tests/e2e/comprehensiveTestPlan.spec.ts' },
  '7': { label: 'Parent Info Tests',          file: 'tests/e2e/parentInfo.spec.ts' },
  '8': { label: 'All Tests (Entire Suite)',   file: null },
};

// ── readline interface ──────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

// ── Helper: run a shell command in project root ────────────
function runPlaywright(command, env = {}) {
  try {
    execSync(command, { stdio: 'inherit', cwd: PROJECT_ROOT, env: { ...process.env, ...env } });
    return true;
  } catch {
    return false;
  }
}

// ── Helper: wipe allure-results so each run is isolated ───
function cleanAllureResults() {
  const resultsDir = path.join(PROJECT_ROOT, 'reports', 'allure-results');
  if (fs.existsSync(resultsDir)) {
    fs.rmSync(resultsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(resultsDir, { recursive: true });
  console.log(`${c.dim}🗑  Cleared previous allure-results for a clean report.${c.reset}`);
}

// ── Helper: generate + open Allure report ─────────────────
function generateAllureReport() {
  console.log(`\n${c.cyan}${c.bold}📊 Generating Allure Report...${c.reset}`);

  try {
    // Step 1: Generate the HTML report from raw allure-results
    execSync(
      'npx allure generate reports/allure-results -o reports/allure-report --clean',
      { stdio: 'inherit', cwd: PROJECT_ROOT }
    );
    console.log(`\n${c.green}✅ Allure report generated at: reports/allure-report/index.html${c.reset}`);

    // Step 2: Open the report in the default browser
    console.log(`\n${c.cyan}🌐 Opening Allure Report in browser...${c.reset}`);
    execSync(
      'npx allure open reports/allure-report',
      { stdio: 'inherit', cwd: PROJECT_ROOT }
    );
  } catch (err) {
    console.log(`\n${c.red}❌ Failed to generate Allure report. Make sure allure-playwright reporter is configured.${c.reset}`);
    console.log(`${c.dim}   Run manually: npm run report:allure:generate && npm run report:allure:open${c.reset}`);
  }
}

// ── Print the main banner ──────────────────────────────────
function printBanner() {
  console.log(`\n${c.cyan}${c.bold}`);
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🤖  PLAYWRIGHT INTERACTIVE CLI RUNNER  🤖   ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`${c.reset}`);
}

// ── Print the main menu ────────────────────────────────────
function printMenu() {
  console.log(`${c.bold}What would you like to do?${c.reset}`);
  console.log(`  ${c.cyan}[1]${c.reset} 🚀  Run Full Automation Suite`);
  console.log(`  ${c.cyan}[2]${c.reset} 🔍  Run Single Field Manual Check`);
  console.log(`  ${c.cyan}[3]${c.reset} 🎯  Run by Test Case ID`);
  console.log(`  ${c.cyan}[4]${c.reset} 🚪  Exit`);
}

// ── OPTION 1: Full Automation ──────────────────────────────
async function runFullAutomation() {
  console.log(`\n${c.bold}Select which tests to run:${c.reset}`);
  for (const [key, val] of Object.entries(SPEC_FILES)) {
    console.log(`  ${c.cyan}[${key}]${c.reset} ${val.label}`);
  }

  const pick = (await ask(`\nEnter choice (1-${Object.keys(SPEC_FILES).length}): `)).trim();
  const selected = SPEC_FILES[pick];

  if (!selected) {
    console.log(`\n${c.yellow}⚠️  Invalid choice. Returning to menu.${c.reset}`);
    return;
  }

  // 🗑  Wipe previous results so this report only shows the selected test
  cleanAllureResults();

  // NOTE: Do NOT pass --reporter here. playwright.config.ts already configures
  // allure-playwright with resultsDir: 'reports/allure-results'. Overriding via
  // CLI would reset resultsDir to the default root folder and break the report.
  const target = selected.file
    ? `npx playwright test ${selected.file} --headed --project=chromium`
    : `npx playwright test --headed --project=chromium`;

  console.log(`\n${c.green}🚀 Starting: ${selected.label}...${c.reset}\n`);
  const success = runPlaywright(target);

  if (success) {
    console.log(`\n${c.green}✅ ${selected.label} completed successfully!${c.reset}`);
  } else {
    console.log(`\n${c.red}❌ Some tests failed. Check the output above for details.${c.reset}`);
  }

  // Auto-generate Allure report after every run
  generateAllureReport();
}

// ── OPTION 2: Single Field Manual Check ───────────────────
async function runSingleFieldCheck() {
  console.log(`\n${c.bold}── Single Field Manual Check ──${c.reset}`);
  console.log(`${c.dim}This will launch Playwright and inject your field & value into the test via environment variables.${c.reset}\n`);

  const fieldName  = (await ask(`Which field do you want to test? ${c.dim}(e.g. email, password, mobileNumber)${c.reset}: `)).trim();
  if (!fieldName) {
    console.log(`\n${c.yellow}⚠️  Field name cannot be empty. Returning to menu.${c.reset}`);
    return;
  }

  const fieldValue = (await ask(`What value do you want to input for "${c.cyan}${fieldName}${c.reset}"?: `)).trim();

  console.log(`\n${c.bold}Select which spec file to run the check against:${c.reset}`);
  for (const [key, val] of Object.entries(SPEC_FILES)) {
    console.log(`  ${c.cyan}[${key}]${c.reset} ${val.label}`);
  }

  const pick     = (await ask(`\nEnter choice (1-${Object.keys(SPEC_FILES).length}): `)).trim();
  const selected = SPEC_FILES[pick];

  if (!selected) {
    console.log(`\n${c.yellow}⚠️  Invalid choice. Returning to menu.${c.reset}`);
    return;
  }

  // 🗑  Wipe previous results so this report only shows the selected test
  cleanAllureResults();

  // NOTE: Do NOT pass --reporter here. playwright.config.ts already configures
  // allure-playwright with resultsDir: 'reports/allure-results'. Overriding via
  // CLI would reset resultsDir to the default root folder and break the report.
  const specTarget = selected.file
    ? `npx playwright test ${selected.file} --headed --project=chromium`
    : `npx playwright test --headed --project=chromium`;

  console.log(`\n${c.green}🚀 Launching check for field "${fieldName}" = "${fieldValue}" in ${selected.label}...${c.reset}\n`);

  // Inject the two env vars so any .spec.ts file can read process.env.TARGET_FIELD / TARGET_VALUE
  process.env.TARGET_FIELD = fieldName;
  process.env.TARGET_VALUE = fieldValue;

  const success = runPlaywright(specTarget);

  // Clean up env vars so they don't bleed into the next run
  delete process.env.TARGET_FIELD;
  delete process.env.TARGET_VALUE;

  if (success) {
    console.log(`\n${c.green}✅ Single field check for "${fieldName}" completed!${c.reset}`);
  } else {
    console.log(`\n${c.red}❌ Check finished with failures. Review the output above.${c.reset}`);
  }

  // Auto-generate Allure report after every run
  generateAllureReport();
}

// ── OPTION 3: Run by Test Case ID ─────────────────────────
async function runByTestCaseId() {
  console.log(`\n${c.bold}🎯 Run by Test Case ID${c.reset}`);
  console.log(`${c.dim}Uses Playwright --grep to run ONLY the test matching the ID you enter.`);
  console.log(`Examples: TC_PI_001  |  TC_CD_015  |  TC_EL_001${c.reset}\n`);

  const tcId = (await ask(`Enter Test Case ID: `)).trim();

  if (!tcId) {
    console.log(`\n${c.yellow}⚠️  Test Case ID cannot be empty. Returning to menu.${c.reset}`);
    return;
  }

  // 🗑  Wipe previous results so the report shows ONLY this test case
  cleanAllureResults();

  // --grep matches the full test title — TC ID must be present in the test name
  const command = `npx playwright test --headed --project=chromium --grep "${tcId}"`;

  console.log(`\n${c.green}🚀 Running test case: ${c.bold}${tcId}${c.reset}${c.green}...${c.reset}\n`);
  const success = runPlaywright(command);

  if (success) {
    console.log(`\n${c.green}✅ Test case ${tcId} passed!${c.reset}`);
  } else {
    console.log(`\n${c.red}❌ Test case ${tcId} failed or not found.${c.reset}`);
    console.log(`${c.dim}   Tip: The ID must match a word in the test title in your .spec.ts file.${c.reset}`);
  }

  // Auto-generate Allure report showing ONLY this test case
  generateAllureReport();
}

// ── Main Loop ─────────────────────────────────────────────
async function main() {
  printBanner();

  while (true) {
    printMenu();
    const choice = (await ask(`\nEnter your choice (1-4): `)).trim();

    if (choice === '1') {
      await runFullAutomation();

    } else if (choice === '2') {
      await runSingleFieldCheck();

    } else if (choice === '3') {
      await runByTestCaseId();

    } else if (choice === '4') {
      console.log(`\n${c.cyan}Goodbye! 👋${c.reset}\n`);
      rl.close();
      break;

    } else if (choice === '' ) {
      // User just pressed Enter — ignore silently
      continue;

    } else {
      console.log(`\n${c.yellow}⚠️  Invalid input. Please enter 1, 2, 3, or 4.${c.reset}`);
    }

    console.log(`\n${c.dim}─────────────────────────────────────────────${c.reset}\n`);
  }
}

// Graceful Ctrl+C exit
rl.on('SIGINT', () => {
  console.log(`\n\n${c.cyan}Goodbye! 👋${c.reset}\n`);
  process.exit(0);
});

main();
