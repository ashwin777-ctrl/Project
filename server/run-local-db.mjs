import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  console.log("[Setup] Starting temporary in-memory MongoDB server to bypass network block...");
  
  // This downloads the mongodb binary mapping to current OS & spins it up
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`[Setup] In-memory MongoDB successfully started at: ${uri}`);

  // Override external DB string with the local memory string
  process.env.MONGO_URI = uri;

  console.log("[Setup] Starting backend server...");
  const serverProcess = spawn('npx', ['nodemon', 'src/server.js'], {
    stdio: 'inherit',
    env: process.env,
    shell: true
  });

  serverProcess.on('close', async (code) => {
    console.log(`[Setup] Backend process exited with code ${code}`);
    await mongod.stop();
    process.exit(code);
  });

  process.on('SIGINT', async () => {
    console.log("Stopping MongoDB server...");
    await mongod.stop();
    serverProcess.kill();
    process.exit(0);
  });
}

start().catch(err => {
  console.error("Failed to start mockup server:", err);
  process.exit(1);
});
