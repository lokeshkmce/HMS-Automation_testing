/**
 * scripts/convert-excel-to-json.js
 *
 * Converts both portal Excel test-case sheets into structured JSON files
 * consumed by the unified test suite.
 *
 * Usage:  node scripts/convert-excel-to-json.js
 * Output: test-data/counsellorTestCases.json
 *         test-data/parentTestCases.json
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const DATA_DIR  = path.join(ROOT, 'test-data');

// Ensure output dir exists
fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Helper: rows → objects using a header row ────────────────────────────────
function sheetToObjects(rows, headerRow) {
  const headers = rows[headerRow];
  return rows
    .slice(headerRow + 1)
    .filter(r => r[0] && typeof r[0] === 'string' && r[0].trim() !== '' && r[0] !== 'TC ID')
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { if (h) obj[String(h).trim()] = r[i] ?? null; });
      return obj;
    });
}

// ─── 1. Counsellor Portal Excel ───────────────────────────────────────────────
console.log('📂 Reading Counsellor Portal Excel...');
const counsellorExcel = path.join(ROOT, 'counsellor Portal - Test case.xlsx');
const wb1 = XLSX.readFile(counsellorExcel);
const raw1 = XLSX.utils.sheet_to_json(wb1.Sheets['Sheet1'], { header: 1 });

// Find all header rows (there are two sections: TC_CD_* and AE_*)
const headerIndexes = raw1
  .map((r, i) => ({ i, isHeader: r[0] === 'TC ID' }))
  .filter(x => x.isHeader)
  .map(x => x.i);

let counsellorTCs = [];
for (let idx = 0; idx < headerIndexes.length; idx++) {
  const from = headerIndexes[idx];
  const to   = headerIndexes[idx + 1] ?? raw1.length;
  const section = raw1.slice(from, to);
  counsellorTCs = counsellorTCs.concat(sheetToObjects(section, 0));
}

console.log(`  ✅ ${counsellorTCs.length} counsellor test cases extracted`);
fs.writeFileSync(
  path.join(DATA_DIR, 'counsellorTestCases.json'),
  JSON.stringify(counsellorTCs, null, 2)
);

// ─── 2. Parent Portal Excel ───────────────────────────────────────────────────
console.log('📂 Reading Parent Portal Excel...');
const parentExcel = path.join(ROOT, 'Parent  Portal Test case.xlsx');
const wb2 = XLSX.readFile(parentExcel);
const raw2 = XLSX.utils.sheet_to_json(wb2.Sheets['Sheet1'], { header: 1 });
const parentTCs = sheetToObjects(raw2, 0);

console.log(`  ✅ ${parentTCs.length} parent test cases extracted`);
fs.writeFileSync(
  path.join(DATA_DIR, 'parentTestCases.json'),
  JSON.stringify(parentTCs, null, 2)
);

console.log('\n🎉 Excel → JSON conversion complete!');
console.log(`   → test-data/counsellorTestCases.json`);
console.log(`   → test-data/parentTestCases.json`);
