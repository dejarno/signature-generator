/**
 * How to run (Web Server)
 * Dev (ts-node): npm run dev  → http://localhost:3000
 * Build+run: npm run build && npm start
 */

declare var require: any;
declare var module: any;
import { startServer } from './server';
import { DEFAULT_PORT } from './config';

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  startServer(DEFAULT_PORT);
}


