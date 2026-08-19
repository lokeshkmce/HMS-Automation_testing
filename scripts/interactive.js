const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\n=======================================');
  console.log('   UNIFIED AUTOMATION TEST SUITE');
  console.log('=======================================');
  console.log('1) Test Counsellor Portal');
  console.log('2) Test Parent Portal');
  console.log('3) Exit');
  console.log('=======================================');
  
  rl.question('\nEnter your choice (1, 2, or 3): ', (answer) => {
    switch(answer.trim()) {
      case '1':
        console.log('\n▶️ Running Counsellor Portal Tests...\n');
        try {
          // Uses --grep to only run tests under the Counsellor Portal describe block
          execSync('npm run clean:allure && npx playwright test tests/e2e/excelUnified.spec.ts --grep "Counsellor Portal" --headed', { stdio: 'inherit' });
        } catch (e) {
          console.log('\n❌ Test run completed with some failures (or was interrupted).');
        }
        showMenu(); // Show menu again after finishing
        break;

      case '2':
        console.log('\n▶️ Running Parent Portal Tests...\n');
        try {
          // 1. Run the interactive OTP script FIRST
          execSync('node scripts/perform-otp-login.js', { stdio: 'inherit' });
          
          // 2. Run the tests, they will use the saved state
          execSync('npm run clean:allure && npx playwright test tests/e2e/excelUnified.spec.ts --grep "Parent Portal" --headed', { stdio: 'inherit' });
        } catch (e) {
          console.log('\n❌ Test run completed with some failures (or was interrupted).');
        }
        showMenu(); // Show menu again after finishing
        break;

      case '3':
        console.log('\nExiting application. Goodbye!\n');
        rl.close();
        process.exit(0);
        break;

      default:
        console.log('\n⚠️ Invalid choice. Please enter 1, 2, or 3.');
        showMenu();
        break;
    }
  });
}

// Clear the console and start the menu
console.clear();
showMenu();
