/**
 * How to run (Web Server)
 * Dev (ts-node): npm run dev  → http://localhost:3000
 * Build+run: npm run build && npm start
 */

declare var require: any;
declare var module: any;
import { startServer } from './src/server';
import { DEFAULT_PORT } from './src/config';

/**
 * Safely parses a JSON string into a specific object type.
 * Returns null if parsing fails and logs the error to the console.
 * * @param jsonString - The raw string to be parsed.
 * @returns The parsed object or null if the input is invalid.
 */
function parseConfigurationString(jsonString: string): Record<string, any> | null {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    // Address feedback: Handle or log the error instead of leaving it empty
    console.error("Failed to parse JSON string:", error instanceof Error ? error.message : error);
    
    // Explicitly return null so the caller knows the operation failed
    return null;
  }
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


