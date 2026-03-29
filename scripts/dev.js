#!/usr/bin/env node

const { rmSync, existsSync } = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');

const lockPath = join(process.cwd(), '.next', 'dev', 'lock');

try {
  if (existsSync(lockPath)) {
    rmSync(lockPath);
    console.log('Removed stale Next.js dev lock:', lockPath);
  }
} catch (err) {
  console.warn('Could not remove Next.js dev lock:', err.message);
}

const args = ['dev', ...process.argv.slice(2)];

const proc = spawn('next', args, { stdio: 'inherit', shell: true });

proc.on('exit', (code) => process.exit(code));
