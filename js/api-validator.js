/**
 * API Validator Module
 * Uses Wandbox Online C Compiler API for code validation
 * Wandbox: https://wandbox.org/
 */

// Wandbox API Configuration
const WANDBOX_CONFIG = {
  apiUrl: 'https://wandbox.org/api/compile.json'
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
   * Validate code using Wandbox Online Compiler
   * @param {number} levelId - The lesson level ID
   * @param {string} code - The C code to validate
   * @returns {Promise<{correct: boolean, message: string, details?: string}>}
   */
  static async validate(levelId, code) {
    try {
      // Call Wandbox API
      const result = await APIValidator.executeCode(code);
      
      console.log('Validation Result:', {
        statusCode: result.statusCode,
        compileError: result.compileError,
        output: result.output
      });

      // Check for compilation errors
      if (result.compileError) {
        console.log('Compilation Error detected');
        return {
          correct: false,
          message: 'Compilation Error',
          details: result.compileError,
          type: 'error'
        };
      }

      // Get actual and expected output
      const actualOutput = (result.output || '').trim();
      const expectedOutput = (EXPECTED_OUTPUTS[levelId] || '').trim();
      
      console.log('Output Comparison:', {
        expected: expectedOutput,
        actual: actualOutput,
        match: actualOutput === expectedOutput
      });

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
   * Execute C code using Wandbox API
   * @param {string} code - C code to execute
   * @returns {Promise<{output: string, compileError: string}>}
   */
  static async executeCode(code) {
    const payload = {
      code: code,
      language: 'c',
      compiler: 'gcc-head'
    };

    try {
      console.log('Sending code to Wandbox API...');
      const response = await fetch(WANDBOX_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Wandbox API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Full API Response:', JSON.stringify(result, null, 2));
      
      // Wandbox response format:
      // {
      //   "status": "0" (success, as STRING not number!),
      //   "signal": "",
      //   "compiler_output": "",
      //   "compiler_error": "",
      //   "compiler_message": "",
      //   "program_output": "program stdout here",
      //   "program_error": "program stderr if any"
      // }

      // Check for compilation errors (status should be '0' for success)
      const isSuccess = String(result.status) === '0';
      const compileError = result.compiler_error || result.compiler_message || '';
      
      // Output comes from program_output or stdout
      const output = result.program_output || result.stdout || '';

      console.log('Parsed Result:', {
        isSuccess,
        compileError,
        output,
        status: result.status
      });

      return {
        output: output,
        statusCode: isSuccess ? 200 : 201,
        compileError: compileError.trim(),
        rawResponse: result
      };
    } catch (error) {
      console.error('Wandbox API Call Error:', error);
      throw error;
    }
  }

  /**
   * Check if API is configured properly
   */
  static isConfigured() {
    return true; // Wandbox doesn't require authentication
  }

  /**
   * Get configuration status message
   */
  static getConfigStatusMessage() {
    return '✅ Wandbox Compiler API Ready';
  }
}
