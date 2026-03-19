/**
 * API Validator Module
 * Uses JDoodle Online C Compiler API for code validation
 * Free tier: https://www.jdoodle.com/compiler-api/
 */

// JDoodle API Configuration
// Free tier credentials - feel free to use your own from https://www.jdoodle.com/compiler-api/
const JDOODLE_CONFIG = {
  clientId: '250d5e55ee4532c63a4886acf8be259e',     // Get free from jdoodle.com
  clientSecret: '5202ccfba90657cd208b7ec0451cccc9d9ba5326481a9c746fcfb3421ea6971a',  // Get free from jdoodle.com
  apiUrl: 'https://api.jdoodle.com/v1/execute'
};

// Expected outputs for each level (for validation)
const EXPECTED_OUTPUTS = {
  1: "Hello, Embedded World!",
  2: "8",
  3: "223",
  4: "8",
  5: "Bit is SET",
  6: "42",
  7: "10",
  8: "100",
  9: "-5",
  10: "3",
  11: "120",
  12: "0x1C",
  13: "0xAC",
  14: "Hello! x=10, y=20",
  15: "42"
};

class APIValidator {
  /**
   * Validate code using JDoodle Online Compiler
   * @param {number} levelId - The lesson level ID
   * @param {string} code - The C code to validate
   * @returns {Promise<{correct: boolean, message: string, details?: string}>}
   */
  static async validate(levelId, code) {
    try {
      // Call JDoodle API
      const result = await APIValidator.executeCode(code);

      // Check for compilation/runtime errors
      if (result.error) {
        return {
          correct: false,
          message: 'Compilation/Runtime Error',
          details: result.error,
          type: 'error'
        };
      }

      if (result.statusCode !== 200) {
        return {
          correct: false,
          message: 'Execution Error',
          details: result.output || 'Code did not execute successfully',
          type: 'execution_error'
        };
      }

      // Get actual and expected output
      const actualOutput = (result.output || '').trim();
      const expectedOutput = (EXPECTED_OUTPUTS[levelId] || '').trim();

      // Compare outputs
      if (actualOutput === expectedOutput) {
        return {
          correct: true,
          message: 'Output matches! ✓',
          type: 'success'
        };
      }

      // Output doesn't match
      return {
        correct: false,
        message: 'Output does not match',
        expected: expectedOutput,
        actual: actualOutput,
        type: 'output_mismatch'
      };

    } catch (error) {
      console.error('Validation error:', error);
      return {
        correct: false,
        message: 'Validation Error',
        details: `Failed to compile/run code: ${error.message}. Make sure code is syntactically correct.`,
        type: 'network_error'
      };
    }
  }

  /**
   * Execute C code using JDoodle API
   * @param {string} code - C code to execute
   * @returns {Promise<{output: string, statusCode: number, error?: string}>}
   */
  static async executeCode(code) {
    const payload = {
      clientId: JDOODLE_CONFIG.clientId,
      clientSecret: JDOODLE_CONFIG.clientSecret,
      script: code,
      language: 'c',
      versionIndex: '0',
      stdin: ''
    };

    const response = await fetch(JDOODLE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`JDoodle API error: ${response.status}`);
    }

    const result = await response.json();
    
    // JDoodle response format:
    // {
    //   "statusCode": 200,
    //   "output": "program output here",
    //   "cpuTime": 0.15,
    //   "memory": 1024
    // }
    // Or error:
    // {
    //   "statusCode": 201,
    //   "error": "compilation error details"
    // }

    return {
      output: result.output || '',
      statusCode: result.statusCode || 200,
      error: result.error || (result.statusCode !== 200 ? result.output : null),
      cpuTime: result.cpuTime,
      memory: result.memory
    };
  }

  /**
   * Check if API is configured properly
   */
  static isConfigured() {
    return JDOODLE_CONFIG.clientId !== 'YOUR_CLIENT_ID_HERE' &&
           JDOODLE_CONFIG.clientSecret !== 'YOUR_CLIENT_SECRET_HERE';
  }

  /**
   * Get configuration status message
   */
  static getConfigStatusMessage() {
    if (!APIValidator.isConfigured()) {
      return `⚠️ JDoodle API not configured. Get free credentials from https://www.jdoodle.com/compiler-api/ and update JDOODLE_CONFIG in js/api-validator.js`;
    }
    return '✅ JDoodle API configured';
  }
}

        details: error.message,
        type: 'network_error'
      };
    }
  }

  /**
   * Check if server is running
   */
  static async checkServer() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Server check failed:', error);
      return false;
    }
  }
}
