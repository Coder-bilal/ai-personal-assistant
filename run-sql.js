const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'db/alerts.sql');
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
  currentStatement.push(line);
  
  // Check if we enter or exit a do $$ block
  if (line.includes('do $$') || line.includes('DO $$')) {
    inDollarBlock = true;
  }
  if (inDollarBlock && (line.trim().endsWith('end $$;') || line.trim().endsWith('END $$;'))) {
    inDollarBlock = false;
  }
  
  // If we are not in a dollar block, and the line ends with a semicolon, it's the end of a statement!
  if (!inDollarBlock && line.trim().endsWith(';')) {
    statements.push(currentStatement.join('\n').trim());
    currentStatement = [];
  }
}

if (currentStatement.length > 0) {
  const remaining = currentStatement.join('\n').trim();
  if (remaining) {
    statements.push(remaining);
  }
}

console.log(`Parsed ${statements.length} SQL statements to execute.`);

const isWin = process.platform === 'win32';
const cliCommand = isWin ? 'npx.cmd @insforge/cli' : 'npx @insforge/cli';

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt) continue;
  
  console.log(`\n[Statement ${i + 1}/${statements.length}] Executing (Unrestricted)...`);
  console.log(stmt.substring(0, 80) + (stmt.length > 80 ? '...' : ''));
  
  try {
    // We add the --unrestricted flag to allow executing DDL commands (like CREATE TABLE and CREATE INDEX)
    const command = `${cliCommand} db query ${JSON.stringify(stmt)} --unrestricted`;
    const output = execSync(command, { encoding: 'utf8' });
    console.log("Success.");
  } catch (err) {
    console.error(`Error executing Statement ${i + 1}:`, err.stdout || err.message);
    process.exit(1);
  }
}

console.log("\nAll SQL statements executed successfully! Database tables, indexes, and RLS policies are created.");
