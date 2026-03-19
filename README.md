# EmbeddedC Learning Platform

An interactive, browser-based learning platform for mastering Embedded C programming concepts. Write real C code that gets compiled and executed by JDoodle's online compiler, with immediate feedback on correctness.

## 🎯 Features

- **15 Progressive Lessons**: From hello world to advanced pointer manipulation
- **Real Code Compilation**: Code is compiled with GCC via JDoodle online compiler
- **Instant Feedback**: See compilation errors, runtime errors, and output mismatches
- **Progress Tracking**: Complete levels, earn badges, and build your streak
- **Persistent State**: Your progress and saved code are stored locally
- **Zero Setup**: Fully deployable to GitHub Pages with no backend needed

## 🚀 Quick Start (Local Development)

### 1. Clone or Download

```bash
git clone https://github.com/YOUR_USERNAME/EmbeddedC_App.git
cd EmbeddedC_App
```

### 2. Configure JDoodle API

Get free credentials from [JDoodle](https://www.jdoodle.com/compiler-api/), then edit `js/api-validator.js`:

```javascript
const JDOODLE_CONFIG = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  apiUrl: 'https://api.jdoodle.com/v1/execute'
};
```

### 3. Open in Browser

Double-click `index.html` or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000`

## 📋 Prerequisites (Removed!)

✅ **No backend server needed!**
✅ **No Node.js installation required!**
✅ **No GCC compiler needed!**

All you need:
- **Modern Browser** - Chrome, Firefox, Safari, or Edge
- **JDoodle Account** - Free from [jdoodle.com](https://www.jdoodle.com/compiler-api/)

## 🚀 Deploy to GitHub Pages

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for complete deployment guide.

Quick version:
1. Get JDoodle credentials (free)
2. Update `js/api-validator.js` with your credentials
3. Push to GitHub
4. Enable GitHub Pages in repository settings
5. Your app is live at `https://YOUR_USERNAME.github.io/EmbeddedC_App/`

## 🏗️ Architecture

### Frontend Only (`/js/`)
- **app.js** - Main orchestrator
- **ui.js** - UI rendering (header, sidebar, level content)
- **handlers.js** - Event handling (submit, reset, hint)
- **state.js** - State management with localStorage
- **api-validator.js** - JDoodle API wrapper
- **data.js** - 15 lesson definitions
- **data-templates.js** - Starter code templates

### Compiler
- **JDoodle Online Compiler** - Free tier, GCC C compiler
- No backend server needed!
- Compiled & executed in cloud

### Styling (`/css/`)
- **styles.css** - Responsive design with CSS variables

## 📚 Lesson Progression

| Level | Topic | Concepts |
|-------|-------|----------|
| 1 | Hello World | stdio.h, printf, main |
| 2-5 | Bit Manipulation | OR, AND, XOR, bit checking |
| 6 | Variables | Data types, assignment |
| 7 | Loops | for loops, iteration |
| 8 | Arrays | Array indexing, iteration |
| 9 | Signed Integers | Negative numbers, 2's complement |
| 10 | Modulo | Remainder operations |
| 11 | Functions | Factorial, recursion |
| 12 | Hex Output | printf %x formatting |
| 13 | Volatile Registers | Hardware registers, volatile keyword |
| 14 | String Formatting | printf with multiple formats |
| 15 | Pointers | Pointer dereferencing, addressing |

## 🔄 How Validation Works

```
User writes code & submits
        ↓
Browser sends to JDoodle API (https://api.jdoodle.com/)
        ↓
JDoodle compiles with GCC
        ↓
Compiled program executes
        ↓
Output returned to browser
        ↓
Compared with expected result
        ↓
Feedback shown to user (success or error)
```

### JDoodle API Advantages

✅ **No backend required** - Works on GitHub Pages
✅ **Free tier available** - Up to N requests per day
✅ **Real GCC compiler** - Same as local compilation
✅ **Global infrastructure** - Servers worldwide
✅ **Instant feedback** - 200ms typical response

### When You Submit Correct Code
- ✅ Success message with badge
- Auto-advance to next level (optional)
- Streak counter increments
- Progress bar updates

### When You Submit Incorrect Code

Show detailed feedback:
- **Compilation Error**: `error: expected ';' before '}'`
- **Runtime Error**: `segmentation fault`
- **Output Mismatch**: Expected vs Your output shown side-by-side

## 📁 Project Structure

```
EmbeddedC_App/
├── index.html                      # Main HTML file
├── .nojekyll                       # GitHub Pages config
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy on push
├── README.md                       # This file
├── GITHUB_PAGES_SETUP.md          # Deployment guide
├── MODULAR_ARCHITECTURE.md        # Code structure
├── css/
│   └── styles.css                 # All styling
└── js/
    ├── app.js                     # Main app
    ├── ui.js                      # UI rendering
    ├── handlers.js                # Event handlers
    ├── state.js                   # State management
    ├── api-validator.js           # JDoodle API ⭐ UPDATE THIS
    ├── data.js                    # 15 lessons
    └── data-templates.js          # Starter code
```

## 🛠️ Development

### Add a New Level

Edit `js/data.js`:
```javascript
{
  id: 16,
  title: "Your Level Title",
  task: "What students should do",
  hint: "Help text",
  expected: `#include <stdio.h>\nint main() {...}`,
  validate: (code) => CodeValidator.validate(16, code),
  badge: { emoji: "🏆", title: "Badge", sub: "Description" }
}
```

Add template in `js/data-templates.js`:
```javascript
LEVEL_TEMPLATES[16] = `#include <stdio.h>
int main() {
    // Write your code here
    return 0;
}`;
```

Update expected output in `js/api-validator.js`:
```javascript
const EXPECTED_OUTPUTS = {
  // ... existing levels ...
  16: "Your expected output"
};
```

### Customize Appearance

Edit `css/styles.css` to change colors, fonts, layout:
```css
:root {
  --primary: #007bff;
  --success: #28a745;
  --error: #dc3545;
  /* ... more colors ... */
}
```

## 🐛 Troubleshooting

### Q: "Validation Error: JDoodle API not configured"
**A:** You didn't update the credentials in `js/api-validator.js`. Get yours from [jdoodle.com](https://www.jdoodle.com/compiler-api/)

### Q: Code compiles locally but fails online
**A:** JDoodle might use different GCC version. Check error details in browser console

### Q: "Rate limit exceeded"
**A:** JDoodle free tier has daily limits. Wait for reset or upgrade to pro

### Q: App won't display on GitHub Pages
**A:** Check Settings → Pages is enabled and branch is correct

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for more troubleshooting.

## 📖 Architecture Documentation

- [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) - Deploy to GitHub Pages
- [MODULAR_ARCHITECTURE.md](MODULAR_ARCHITECTURE.md) - Code structure details

## 🔐 Security & Privacy

- All code executed on **JDoodle's servers** (not stored)
- JDoodle credentials are **public** (acceptable for free tier)
- For production, use a **backend proxy** to hide credentials
- Data stored **locally** in browser (localStorage)

## 📄 License

MIT License - Feel free to use and modify!

## 🎓 Learning Path

**Beginners**: Start at Level 1, progress sequentially
**Review**: Skip to specific topics of interest  
**Challenge**: Modify lesson code for deeper understanding

Each lesson includes:
- Clear task description
- Concept explanation
- Helpful hint
- Starter code template
- Immediate validation feedback

## 🚀 Next Steps

1. Update `js/api-validator.js` with JDoodle credentials
2. Open `index.html` in browser
3. Test submitting code
4. Deploy to GitHub Pages (see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md))
5. Share your deployed link!

Happy coding! 🎉
