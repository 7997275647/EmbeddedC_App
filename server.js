/**
 * Embedded C Learning Platform - Backend Server
 * Handles code compilation, execution, and validation
 */

const express = require('express');
const cors = require('cors');
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Safe temp directory for compilation
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Expected outputs for each level
const EXPECTED_OUTPUTS = {
  1: "Hello, Embedded World!\n",
  2: "8\n",
  3: "223\n",
  4: "8\n",
  5: "Bit is SET\n",
  6: "42\n",
  7: "10\n",
  8: "100\n",
  9: "-5\n",
  10: "3\n",
  11: "120\n",
  12: "0x1C\n",
  13: "0xAC\n",
  14: "Hello! x=10, y=20\n",
  15: "42\n"
};

/**
 * Compile and run C code
 * Returns: { success: boolean, output: string, error: string, compileError: string }
 */
function compileAndRun(code, levelId) {
  try {
    const sessionId = uuidv4().slice(0, 8);
    const sourceFile = path.join(TEMP_DIR, `level_${levelId}_${sessionId}.c`);
    const outputFile = path.join(TEMP_DIR, `level_${levelId}_${sessionId}`);
    const executableFile = `${outputFile}.exe`; // Windows specific

    // Write code to temp file
    fs.writeFileSync(sourceFile, code, 'utf8');

    // Compile with GCC
    const compileCmd = `gcc "${sourceFile}" -o "${outputFile}" 2>&1`;
    const compileResult = spawnSync('gcc', [sourceFile, '-o', outputFile], {
      encoding: 'utf8',
      timeout: 5000,
      maxBuffer: 1024 * 1024,
      shell: true
    });

    // Check for compilation errors
    if (compileResult.error || compileResult.status !== 0) {
      const errorOutput = compileResult.stderr || compileResult.error?.message || 'Unknown compilation error';
      return {
        success: false,
        output: '',
        error: '',
        compileError: errorOutput
      };
    }

    // Run the executable
    const executablePath = process.platform === 'win32' ? executableFile : outputFile;
    const runResult = spawnSync(executablePath, [], {
      encoding: 'utf8',
      timeout: 5000,
      maxBuffer: 1024 * 1024,
      shell: process.platform === 'win32'
    });

    let output = runResult.stdout || '';
    const runtimeError = runResult.stderr || '';

    // Check for runtime errors
    if (runResult.error) {
      return {
        success: false,
        output: output,
        error: runResult.error.message,
        compileError: ''
      };
    }

    // Cleanup
    try {
      fs.unlinkSync(sourceFile);
      fs.unlinkSync(outputFile);
      if (fs.existsSync(executableFile)) {
        fs.unlinkSync(executableFile);
      }
    } catch (e) {
      // Ignore cleanup errors
    }

    return {
      success: true,
      output: output,
      error: runtimeError,
      compileError: ''
    };

  } catch (err) {
    return {
      success: false,
      output: '',
      error: err.message,
      compileError: err.message
    };
  }
}

/**
 * Validate compiled output against expected output
 */
function validateOutput(actualOutput, expectedOutput) {
  // Trim both and compare
  const actual = (actualOutput || '').trim();
  const expected = (expectedOutput || '').trim();
  
  return actual === expected;
}

/**
 * API Endpoint: Compile and validate code
 */
app.post('/api/validate', (req, res) => {
  const { code, levelId } = req.body;

  if (!code || !levelId) {
    return res.status(400).json({
      success: false,
      message: 'Missing code or levelId'
    });
  }

  if (!EXPECTED_OUTPUTS[levelId]) {
    return res.status(400).json({
      success: false,
      message: `Invalid level ID: ${levelId}`
    });
  }

  // Compile and run
  const result = compileAndRun(code, levelId);

  // Check for compilation errors
  if (result.compileError) {
    return res.json({
      success: false,
      correct: false,
      message: 'Compilation Error',
      details: result.compileError,
      output: null
    });
  }

  // Check for runtime errors
  if (result.error) {
    return res.json({
      success: false,
      correct: false,
      message: 'Runtime Error',
      details: result.error,
      output: result.output
    });
  }

  // Validate output
  const expectedOutput = EXPECTED_OUTPUTS[levelId];
  const isCorrect = validateOutput(result.output, expectedOutput);

  res.json({
    success: true,
    correct: isCorrect,
    message: isCorrect ? 'Output matches!' : 'Output does not match',
    expected: expectedOutput,
    actual: result.output,
    output: result.output
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔧 Embedded C Compiler Server running on http://localhost:${PORT}`);
  console.log(`📝 POST /api/validate - Compile and validate code`);
  console.log(`❤️  GET /api/health - Health check`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  // Cleanup temp directory
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
  process.exit(0);
});
