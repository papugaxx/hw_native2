const { spawn } = require('child_process');
const path = require('path');

const serverDir = __dirname;
const jsonServerBin = process.platform === 'win32'
  ? path.join(serverDir, 'node_modules', '.bin', 'json-server.cmd')
  : path.join(serverDir, 'node_modules', '.bin', 'json-server');

const processes = [
  {
    name: 'SHOP',
    file: 'shop.json',
    port: '3000',
  },
  {
    name: 'CATEGORIES',
    file: 'db.json',
    port: '3001',
  },
];

const children = processes.map(({ name, file, port }) => {
  const child = spawn(
    jsonServerBin,
    ['--watch', path.join(serverDir, file), '--host', '0.0.0.0', '--port', port],
    { cwd: serverDir, stdio: ['inherit', 'pipe', 'pipe'] },
  );

  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));
  child.on('exit', (code, signal) => {
    console.log(`[${name}] stopped (code=${code}, signal=${signal})`);
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
