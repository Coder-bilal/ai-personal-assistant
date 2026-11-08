const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'db/briefings.sql');
if (!fs.existsSync(sqlPath)) {
  console.error("SQL file not found at:", sqlPath);
  process.exit(1);
}

const rawSql = fs.readFileSync(sqlPath, 'utf8');

// Parse statements smartly
const lines = rawSql.split(/\r?\n/);
const statements = [];
let currentStatement = [];
let inDollarBlock = false;

for (let line of lines) {
  // Strip SQL comments
  const cleanLine = line.replace(/--.*$/, '').trim();
  if (!cleanLine) continue;

  currentStatement.push(cleanLine);
  
  // Check if we enter or exit a do $$ block
  if (cleanLine.includes('do $$') || cleanLine.includes('DO $$')) {
    inDollarBlock = true;
  }
  if (inDollarBlock && (cleanLine.endsWith('end $$;') || cleanLine.endsWith('END $$;'))) {
    inDollarBlock = false;
  }
  
  // If we are not in a dollar block, and the line ends with a semicolon, it's the end of a statement!
  if (!inDollarBlock && cleanLine.endsWith(';')) {
    statements.push(currentStatement.join(' ').trim());
    currentStatement = [];
  }
}

if (currentStatement.length > 0) {
  const remaining = currentStatement.join(' ').trim();
  if (remaining) {
    statements.push(remaining);
  }
}

console.log(`Parsed ${statements.length} SQL statements to execute.`);

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt) continue;
  
  console.log(`\n[Statement ${i + 1}/${statements.length}] Executing...`);
  console.log(stmt.substring(0, 80) + (stmt.length > 80 ? '...' : ''));
  
  const args = ['@insforge/cli', 'db', 'query', stmt, '--unrestricted'];
  const res = spawnSync(cmd, args, { encoding: 'utf8' });
  
  if (res.status === 0) {
    console.log("Success.");
    if (res.stdout) {
      console.log(res.stdout.trim());
    }
  } else {
    console.error(`Error executing Statement ${i + 1}:`);
    console.error(res.stderr || res.stdout || 'Unknown error');
    process.exit(1);
  }
}

console.log("\nAll SQL statements executed successfully! Database tables, indexes, and RLS policies are created.");
