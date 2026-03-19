# Backend Setup & Installation

This project now uses a backend Node.js server to compile and execute C code for validation. Follow these steps to get it running.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **GCC Compiler** - Required to compile C code
   - **Windows**: Install MinGW or use [TDM-GCC](https://jmeubank.github.io/tdm-gcc/) or WSL
   - **macOS**: Install via Homebrew: `brew install gcc`
   - **Linux**: Usually pre-installed, or install via `sudo apt install gcc`

### Verify Installations

```bash
node --version
npm --version
gcc --version
```

## Installation Steps

1. **Install Dependencies**

From the project root directory:

```bash
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing support
- `uuid` - For generating unique IDs
- `nodemon` - Optional: Auto-restart server during development

2. **Start the Backend Server**

```bash
npm start
```

You should see:
```
🔧 Embedded C Compiler Server running on http://localhost:3001
📝 POST /api/validate - Compile and validate code
❤️  GET /api/health - Health check
```

3. **Open the Frontend**

Open `index.html` in a web browser (runs on any port, doesn't need Python server)

## How It Works

### Compilation & Execution Flow

1. User writes C code in the editor
2. User clicks "Submit" button
3. Frontend sends code to `http://localhost:3001/api/validate` via POST
4. Backend:
   - Receives the code
   - Compiles with GCC
   - Executes the compiled program
   - Captures output
   - Compares with expected output
5. Frontend displays:
   - ✅ Success if output matches
   - ❌ Compilation error if code won't compile
   - ❌ Runtime error if program crashes
   - ❌ Output mismatch if output differs

### API Endpoints

##### `POST /api/validate`

**Request:**
```json
{
  "code": "#include <stdio.h>\nint main() {...}",
  "levelId": 1
}
```

**Response (Success):**
```json
{
  "success": true,
  "correct": true,
  "message": "Output matches! ✓",
  "type": "success"
}
```

**Response (Mismatch):**
```json
{
  "success": true,
  "correct": false,
  "message": "Output does not match",
  "expected": "Hello, Embedded World!\n",
  "actual": "hello\n",
  "type": "output_mismatch"
}
```

**Response (Compilation Error):**
```json
{
  "success": false,
  "correct": false,
  "message": "Compilation Error",
  "details": "error: expected ';' before '}' token",
  "type": "compile_error"
}
```

##### `GET /api/health`

Simple health check endpoint.

## Expected Outputs by Level

The server knows the expected output for each of the 15 levels:

| Level | Task | Expected Output |
|-------|------|-----------------|
| 1 | Hello, Embedded World | `Hello, Embedded World!\n` |
| 2 | Set bit 3 | `8\n` |
| 3 | Clear bit 5 | `223\n` |
| 4 | Toggle bit 1 | `8\n` |
| 5 | Check bit 2 | `Bit is SET\n` |
| 6 | Variables | `42\n` |
| 7 | Loops | `10\n` |
| 8 | Arrays | `100\n` |
| 9 | Signed integers | `-5\n` |
| 10 | Modulo operator | `3\n` |
| 11 | Factorial | `120\n` |
| 12 | Hex output | `0x1C\n` |
| 13 | Volatile registers | `0xAC\n` |
| 14 | Formatted output | `Hello! x=10, y=20\n` |
| 15 | Pointer dereferencing | `42\n` |

## Development

### Running with Auto-Reload

For development, use nodemon:

```bash
npm run dev
```

The server will automatically restart when you make changes to `server.js`.

### Troubleshooting

**"Command not found: gcc"**
- Ensure GCC is installed and in your PATH
- Windows: Use MinGW or WSL

**"Cannot find module 'express'"**
- Run `npm install` again
- Verify Node.js version with `node --version`

**"Port 3001 already in use"**
- Either close the other process using the port
- Or change the PORT in `server.js` and update `API_BASE_URL` in `js/api-validator.js`

**Code compiles locally but fails on server**
- Check that GCC version matches your expectations
- Ensure code doesn't use platform-specific features

## Safety & Security

- Code is compiled in an isolated temp directory
- Temp files are automatically deleted after execution
- 5-second timeout on compilation and execution
- Server validates input before processing

## Deployment

For production deployment:

1. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

2. Consider:
   - Running behind a reverse proxy (Nginx/Apache)
   - Rate limiting to prevent abuse
   - Code sandboxing for untrusted submissions
   - Proper error handling and logging

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm start` to start the server
3. Open `index.html` in your browser
4. Try submitting code - it will now compile and execute on the backend!
