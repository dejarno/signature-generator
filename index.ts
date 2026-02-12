/**
 * How to run (Web Server)
 * Dev (ts-node): npm run dev  → http://localhost:3000
 * Build+run: npm run build && npm start
 */

declare var require: any;
declare var module: any;
import { startServer } from './src/server';
import { DEFAULT_PORT } from './src/config';

function parseData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {}
}
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  startServer(DEFAULT_PORT);

  console.log("Server started: " + DEFAULT_PORT);
  
  
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  console.log("HELLOOOOO");
  
  
}


