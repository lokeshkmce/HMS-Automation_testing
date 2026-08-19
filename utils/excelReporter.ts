import fs from 'fs';
import path from 'path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export default class ExcelReporter implements Reporter {
  private results: Array<{ cleanName: string; status: string; duration: number }> = [];

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status;
    const duration = result.duration;
    const testName = test.titlePath().join(' > ');
    
    // Clean strings to prevent CSV breaking
    const cleanName = testName.replace(/"/g, '""');
    this.results.push({ cleanName, status, duration });
  }

  onEnd() {
    let csvContent = 'Test Scenario,Execution Status,Duration (ms)\\n';
    
    this.results.forEach(run => {
      csvContent += `"${run.cleanName}","${run.status}",${run.duration}\\n`;
    });

    const reportPath = path.join(process.cwd(), 'playwright-report', 'Playwright_Execution_Report.csv');
    
    // Ensure the folder exists
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    
    // Write CSV to disk
    fs.writeFileSync(reportPath, csvContent);
    console.log(`\\n📊 Excel (CSV) Report successfully generated at: ${reportPath}`);
  }
}
