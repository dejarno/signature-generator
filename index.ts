/**
 * How to run (Web Server)
 * Dev (ts-node): npm run dev  → http://localhost:3000
 * Build+run: npm run build && npm start
 */

declare var require: any;
declare var module: any;
import { startServer } from './server';

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  startServer(3000);
}


