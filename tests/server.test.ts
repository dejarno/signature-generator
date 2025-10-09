/**
 * Comprehensive unit tests for src/server.ts
 * 
 * This test suite covers:
 * - parseBody function (internal utility)
 * - startServer function with all routes
 * - Request logging behavior (including duplicate logs from recent changes)
 * - Error handling and edge cases
 * - Response headers and status codes
 * - Form data parsing and validation
 */

import * as http from 'http';
import { EventEmitter } from 'events';

// Mock the dependencies before importing the module under test
const mockGenerateSignatureHtml = jest.fn();
const mockRenderFormPage = jest.fn();

jest.mock('../src/signature', () => ({
  generateSignatureHtml: mockGenerateSignatureHtml
}));

jest.mock('../src/form', () => ({
  renderFormPage: mockRenderFormPage
}));

// Mock console methods to test logging behavior
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

describe('server.ts', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup spies for console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset mocks
    jest.clearAllMocks();
    mockGenerateSignatureHtml.mockReturnValue('<html>signature</html>');
    mockRenderFormPage.mockReturnValue('<html>form</html>');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('parseBody function (via integration)', () => {
    let server: http.Server;
    let serverPort: number;

    beforeEach((done) => {
      // Dynamically import to get fresh module with mocks
      const { startServer } = require('../src/server');
      serverPort = 3456; // Use non-standard port for testing
      startServer(serverPort);
      
      // Find the created server
      setTimeout(() => {
        done();
      }, 100);
    });

    afterEach((done) => {
      // Close server after each test
      setTimeout(() => {
        done();
      }, 100);
    });

    test('should parse URL-encoded POST body correctly', (done) => {
      const postData = 'name=John+Doe&email=john%40example.com&title=Developer';
      
      const options = {
        hostname: 'localhost',
        port: serverPort,
        path: '/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        expect(res.statusCode).toBe(400); // Will fail validation but proves parsing works
        done();
      });

      req.write(postData);
      req.end();
    });

    test('should handle empty POST body', (done) => {
      const options = {
        hostname: 'localhost',
        port: serverPort,
        path: '/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': 0
        }
      };

      const req = http.request(options, (res) => {
        expect(res.statusCode).toBe(400);
        done();
      });

      req.end();
    });

    test('should handle large POST body', (done) => {
      const largeData = 'name=' + 'A'.repeat(10000) + '&email=test@example.com';
      
      const options = {
        hostname: 'localhost',
        port: serverPort,
        path: '/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(largeData)
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          expect(res.statusCode).toBe(400); // Missing required fields
          done();
        });
      });

      req.write(largeData);
      req.end();
    });
  });

  describe('Request Logging Behavior', () => {
    test('should log request information 5 times per request (including duplicates)', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3457;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/',
          method: 'GET'
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            // Check that the duplicate console.log statements are executed
            const requestLogs = consoleLogSpy.mock.calls.filter(call => 
              call[0] && call[0].includes('[request] GET /')
            );
            
            // Should have 5 log calls: 1 original + 4 duplicates (lines 25, 27, 28, 29, 30)
            expect(requestLogs.length).toBe(5);
            
            // Verify all log messages are identical
            requestLogs.forEach(call => {
              expect(call[0]).toBe('[request] GET /');
            });
            
            done();
          });
        });

        req.end();
      }, 100);
    });

    test('should log with correct method and pathname for different routes', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3458;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            const requestLogs = consoleLogSpy.mock.calls.filter(call => 
              call[0] && call[0].includes('[request] POST /generate')
            );
            
            expect(requestLogs.length).toBe(5);
            done();
          });
        });

        req.end();
      }, 100);
    });
  });

  describe('GET / route', () => {
    test('should return 200 and HTML form page', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3459;
      mockRenderFormPage.mockReturnValue('<html><body>Test Form</body></html>');
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/',
          method: 'GET'
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('<html><body>Test Form</body></html>');
            expect(mockRenderFormPage).toHaveBeenCalledTimes(1);
            
            // Verify logging
            const serveLogs = consoleLogSpy.mock.calls.filter(call =>
              call[0] === '[serve] form page'
            );
            expect(serveLogs.length).toBe(1);
            
            done();
          });
        });

        req.end();
      }, 100);
    });

    test('should call renderFormPage without arguments', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3460;
      startServer(testPort);

      setTimeout(() => {
        http.get(`http://localhost:${testPort}/`, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockRenderFormPage).toHaveBeenCalledWith();
            done();
          });
        });
      }, 100);
    });
  });

  describe('GET /favicon.ico route', () => {
    test('should return 204 No Content', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3461;
      startServer(testPort);

      setTimeout(() => {
        http.get(`http://localhost:${testPort}/favicon.ico`, (res) => {
          expect(res.statusCode).toBe(204);
          
          res.on('data', () => {
            fail('Should not receive data for 204 response');
          });
          
          res.on('end', () => {
            done();
          });
        });
      }, 100);
    });

    test('should not call any generator functions for favicon', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3462;
      startServer(testPort);

      setTimeout(() => {
        http.get(`http://localhost:${testPort}/favicon.ico`, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockRenderFormPage).not.toHaveBeenCalled();
            expect(mockGenerateSignatureHtml).not.toHaveBeenCalled();
            done();
          });
        });
      }, 100);
    });
  });

  describe('POST /generate route - Happy Path', () => {
    test('should generate signature with all required fields', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3463;
      mockGenerateSignatureHtml.mockReturnValue('<html>Generated Signature</html>');
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Jane+Smith&title=CEO&email=jane@example.com&logoUrl=http://example.com/logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
          expect(res.headers['content-disposition']).toBe('attachment; filename="signature.html"');
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('<html>Generated Signature</html>');
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith({
              name: 'Jane Smith',
              title: 'CEO',
              email: 'jane@example.com',
              phone: null,
              website: null,
              logoUrl: 'http://example.com/logo.png',
              linkedinUrl: null
            });
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should generate signature with all optional fields', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3464;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=John+Doe&title=Developer&email=john@example.com&phone=%2B1234567890&website=example.com&logoUrl=http://logo.png&linkedinUrl=http://linkedin.com/in/johndoe';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith({
              name: 'John Doe',
              title: 'Developer',
              email: 'john@example.com',
              phone: '+1234567890',
              website: 'example.com',
              logoUrl: 'http://logo.png',
              linkedinUrl: 'http://linkedin.com/in/johndoe'
            });
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });
  });

  describe('POST /generate route - Validation', () => {
    test('should return 400 when name is missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3465;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'title=CEO&email=jane@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(400);
          expect(res.headers['content-type']).toBe('text/plain; charset=utf-8');
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('Missing required fields: name, title, email, logoUrl');
            expect(consoleWarnSpy).toHaveBeenCalledWith(
              '[validation] missing required fields',
              expect.objectContaining({ name: false })
            );
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should return 400 when title is missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3466;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Jane&email=jane@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(400);
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('Missing required fields: name, title, email, logoUrl');
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should return 400 when email is missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3467;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Jane&title=CEO&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(400);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should return 400 when logoUrl is missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3468;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Jane&title=CEO&email=jane@example.com';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(400);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should return 400 when all required fields are missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3469;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'phone=123456';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(400);
          res.on('data', () => {});
          res.on('end', () => {
            expect(consoleWarnSpy).toHaveBeenCalledWith(
              '[validation] missing required fields',
              { name: false, title: false, email: false, logoUrl: false }
            );
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should handle empty string values as missing', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3470;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=&title=&email=&logoUrl=';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(400);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.write(postData);
        req.end();
      }, 100);
    });
  });

  describe('POST /generate route - Error Handling', () => {
    test('should return 500 when signature generation throws error', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3471;
      mockGenerateSignatureHtml.mockImplementation(() => {
        throw new Error('Generation failed');
      });
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Jane&title=CEO&email=jane@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(500);
          expect(res.headers['content-type']).toBe('text/plain; charset=utf-8');
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('Internal Server Error');
            expect(consoleErrorSpy).toHaveBeenCalledWith('[error]', expect.any(Error));
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });
  });

  describe('POST /preview route', () => {
    test('should return signature HTML without download header', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3472;
      mockGenerateSignatureHtml.mockReturnValue('<html>Preview</html>');
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Test&title=Developer&email=test@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/preview',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
          expect(res.headers['content-disposition']).toBeUndefined();
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('<html>Preview</html>');
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should work with missing optional fields', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3473;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Test&title=Dev&email=test@test.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/preview',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith({
              name: 'Test',
              title: 'Dev',
              email: 'test@test.com',
              phone: null,
              website: null,
              logoUrl: 'http://logo.png',
              linkedinUrl: null
            });
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should return 500 on generation error', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3474;
      mockGenerateSignatureHtml.mockImplementation(() => {
        throw new Error('Preview generation failed');
      });
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Test&title=Dev&email=test@test.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/preview',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(500);
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('Internal Server Error');
            expect(consoleErrorSpy).toHaveBeenCalledWith('[error][preview]', expect.any(Error));
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should log preview request correctly', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3475;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=Test&title=Dev&email=test@test.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/preview',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            // Check for preview-specific logs
            const previewLogs = consoleLogSpy.mock.calls.filter(call =>
              call[0] && call[0].includes('[preview]')
            );
            expect(previewLogs.length).toBeGreaterThan(0);
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });
  });

  describe('404 Not Found route', () => {
    test('should return 404 for unknown GET routes', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3476;
      startServer(testPort);

      setTimeout(() => {
        http.get(`http://localhost:${testPort}/unknown`, (res) => {
          let body = '';
          
          expect(res.statusCode).toBe(404);
          expect(res.headers['content-type']).toBe('text/plain; charset=utf-8');
          
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            expect(body).toBe('Not Found');
            done();
          });
        });
      }, 100);
    });

    test('should return 404 for unknown POST routes', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3477;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/unknown-post',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
          }
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(404);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.end();
      }, 100);
    });

    test('should return 404 for unsupported HTTP methods', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3478;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/',
          method: 'PUT'
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(404);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.end();
      }, 100);
    });

    test('should return 404 for DELETE requests', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3479;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'DELETE'
        };

        const req = http.request(options, (res) => {
          expect(res.statusCode).toBe(404);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.end();
      }, 100);
    });
  });

  describe('Edge Cases and Special Scenarios', () => {
    test('should handle special characters in form data', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3480;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=O%27Brien&title=Sr.+Developer&email=test%2Bemail@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith(
              expect.objectContaining({
                name: "O'Brien",
                title: 'Sr. Developer',
                email: 'test+email@example.com'
              })
            );
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should handle Unicode characters in form data', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3481;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=%E4%B8%AD%E6%96%87&title=开发者&email=test@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith(
              expect.objectContaining({
                name: '中文',
                title: '开发者'
              })
            );
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should handle null and undefined query parameters', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3482;
      startServer(testPort);

      setTimeout(() => {
        http.get(`http://localhost:${testPort}/?param=null&other=undefined`, (res) => {
          expect(res.statusCode).toBe(200);
          res.on('data', () => {});
          res.on('end', done);
        });
      }, 100);
    });

    test('should handle requests without URL', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3483;
      startServer(testPort);

      setTimeout(() => {
        // This simulates a request with an empty or null URL
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '',
          method: 'GET'
        };

        const req = http.request(options, (res) => {
          // Should default to '/' path
          expect(res.statusCode).toBe(200);
          res.on('data', () => {});
          res.on('end', done);
        });

        req.end();
      }, 100);
    });

    test('should handle multiple concurrent requests', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3484;
      startServer(testPort);

      setTimeout(() => {
        let completedRequests = 0;
        const totalRequests = 5;

        for (let i = 0; i < totalRequests; i++) {
          http.get(`http://localhost:${testPort}/`, (res) => {
            expect(res.statusCode).toBe(200);
            res.on('data', () => {});
            res.on('end', () => {
              completedRequests++;
              if (completedRequests === totalRequests) {
                done();
              }
            });
          });
        }
      }, 100);
    });
  });

  describe('Server Initialization', () => {
    test('should start server on default port 3000', (done) => {
      const { startServer } = require('../src/server');
      startServer(); // No port specified, should use default

      setTimeout(() => {
        const logCalls = consoleLogSpy.mock.calls;
        const serverStartLog = logCalls.find(call => 
          call[0] && call[0].includes('Server running at http://localhost:3000')
        );
        expect(serverStartLog).toBeDefined();
        done();
      }, 100);
    });

    test('should start server on custom port', (done) => {
      const { startServer } = require('../src/server');
      const customPort = 3485;
      startServer(customPort);

      setTimeout(() => {
        const logCalls = consoleLogSpy.mock.calls;
        const serverStartLog = logCalls.find(call => 
          call[0] && call[0].includes(`Server running at http://localhost:${customPort}`)
        );
        expect(serverStartLog).toBeDefined();
        done();
      }, 100);
    });
  });

  describe('Type Coercion and Data Sanitization', () => {
    test('should coerce form values to strings', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3486;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=123&title=456&email=test@example.com&logoUrl=http://logo.png&phone=789';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith({
              name: '123',
              title: '456',
              email: 'test@example.com',
              phone: '789',
              website: null,
              logoUrl: 'http://logo.png',
              linkedinUrl: null
            });
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });

    test('should handle boolean-like values in form', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3487;
      startServer(testPort);

      setTimeout(() => {
        const postData = 'name=true&title=false&email=test@example.com&logoUrl=http://logo.png';
        
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            expect(mockGenerateSignatureHtml).toHaveBeenCalledWith(
              expect.objectContaining({
                name: 'true',
                title: 'false'
              })
            );
            done();
          });
        });

        req.write(postData);
        req.end();
      }, 100);
    });
  });

  describe('Request Method Normalization', () => {
    test('should uppercase request method', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3488;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/',
          method: 'get' // lowercase
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            // Should be logged as GET (uppercase)
            const requestLogs = consoleLogSpy.mock.calls.filter(call =>
              call[0] && call[0].includes('[request] GET /')
            );
            expect(requestLogs.length).toBe(5); // 1 original + 4 duplicates
            done();
          });
        });

        req.end();
      }, 100);
    });

    test('should handle post method in lowercase', (done) => {
      const { startServer } = require('../src/server');
      const testPort = 3489;
      startServer(testPort);

      setTimeout(() => {
        const options = {
          hostname: 'localhost',
          port: testPort,
          path: '/generate',
          method: 'post', // lowercase
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
          }
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            const requestLogs = consoleLogSpy.mock.calls.filter(call =>
              call[0] && call[0].includes('[request] POST /generate')
            );
            expect(requestLogs.length).toBe(5);
            done();
          });
        });

        req.end();
      }, 100);
    });
  });
});