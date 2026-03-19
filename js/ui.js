/**
 * UI Rendering Module
 * Handles all DOM rendering and UI updates
 */

class UIRenderer {
  /**
   * Update header progress bar and streak
   */
  static updateHeader(completionCount, totalLevels, streak) {
    const label = document.getElementById('progress-label');
    const fill = document.getElementById('progress-fill');
    const streakCount = document.getElementById('streak-count');

    if (label) label.textContent = `${completionCount} / ${totalLevels}`;
    if (fill) fill.style.width = `${(completionCount / totalLevels) * 100}%`;
    if (streakCount) streakCount.textContent = streak;
  }

  /**
   * Render sidebar level buttons
   */
  static renderSidebar(levels, currentLevel, completedLevels) {
    const list = document.getElementById('level-list');
    if (!list) return;

    list.innerHTML = levels.map((lv, i) => {
      const done = completedLevels.has(lv.id);
      const active = i === currentLevel;
      const locked = i > 0 && !completedLevels.has(levels[i - 1].id) && i > currentLevel && !done;

      let cls = 'level-btn';
      if (done) cls += ' completed';
      if (active) cls += ' active';
      if (locked) cls += ' locked';

      return `<button class="${cls}" onclick="app.selectLevel(${i})" ${locked ? 'disabled' : ''}>
        <div class="level-num">${lv.id}</div>
        <div class="level-name">${lv.title}</div>
        <div class="level-check">${done ? '✓' : ''}</div>
      </button>`;
    }).join('');
  }

  /**
   * Escape HTML entities
   */
  static escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Render completion screen
   */
  static renderCompletion(streak) {
    return `<div id="completion-screen" class="visible">
      <div class="completion-emoji">🏆</div>
      <div class="completion-h">You've Mastered Embedded C!</div>
      <div class="completion-sub">All 15 levels completed. You're ready for real firmware development.</div>
      <div class="completion-stats">
        <div class="stat-card"><div class="stat-val">15</div><div class="stat-label">Levels Done</div></div>
        <div class="stat-card"><div class="stat-val">${streak}</div><div class="stat-label">Best Streak</div></div>
        <div class="stat-card"><div class="stat-val">100%</div><div class="stat-label">Complete</div></div>
      </div>
    </div>`;
  }

  /**
   * Render main level content
   */
  static renderLevel(level, currentCode, isAllCompleted) {
    const html = `
      <div class="level-header">
        <div class="level-tag"><div class="level-tag-dot"></div>Level ${level.id} — ${level.tag}</div>
        <div class="level-h1">${level.title}</div>
        <div class="level-desc">${level.desc}</div>
      </div>
      <div class="concept-box">
        <div class="concept-label">📖 Concept</div>
        <div class="concept-text">${level.concept}</div>
      </div>
      <div class="task-box">
        <div class="task-label">🎯 Your Task</div>
        <div class="task-text">${level.task}</div>
      </div>
      <div class="editor-wrap">
        <div class="editor-bar">
          <div class="editor-dot" style="background:#ef4444"></div>
          <div class="editor-dot" style="background:#f59e0b"></div>
          <div class="editor-dot" style="background:#22c55e"></div>
          <div class="editor-filename">main.c</div>
          <div class="editor-actions">
            <button class="btn-hint" onclick="app.toggleHint()">💡 Hint</button>
            <button class="btn-reset" onclick="app.resetCode()">↺ Reset</button>
          </div>
        </div>
        <textarea id="code-editor" spellcheck="false" autocorrect="off" autocapitalize="off">${this.escapeHtml(currentCode)}</textarea>
        <div class="editor-footer">
          <div class="editor-footer-hint">Tab = 2 spaces · Ctrl+Enter = Submit</div>
          <button class="btn-submit" onclick="app.submitCode()">▶ Run & Check</button>
        </div>
      </div>
      <div class="hint-box" id="hint-box">${level.hint}</div>
      <div class="feedback-box" id="feedback-box"></div>
    `;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    if (isAllCompleted) {
      mainContent.innerHTML = this.renderCompletion(stateManager.state.streak) + html;
    } else {
      mainContent.innerHTML = html;
    }
  }

  /**
   * Toggle hint visibility
   */
  static toggleHintBox() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) {
      hintBox.classList.toggle('visible');
    }
  }

  /**
   * Hide hint box
   */
  static hideHintBox() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) {
      hintBox.classList.remove('visible');
    }
  }

  /**
   * Show success feedback
   */
  static showSuccessFeedback(explanation) {
    const fb = document.getElementById('feedback-box');
    if (!fb) return;

    fb.className = 'feedback-box success visible';
    fb.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-icon">✅</div>
        <div class="feedback-title">Correct! Well done.</div>
      </div>
      <div class="feedback-body">${explanation}</div>
    `;
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Show error feedback
   */
  static showErrorFeedback(explanation, expectedCode) {
    const fb = document.getElementById('feedback-box');
    if (!fb) return;

    fb.className = 'feedback-box error visible';
    fb.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-icon">❌</div>
        <div class="feedback-title">Not quite — keep going!</div>
      </div>
      <div class="feedback-body">${explanation}
        <div class="expected-block">
          <div class="expected-label">EXPECTED SOLUTION</div>
          <div class="expected-code">${this.escapeHtml(expectedCode)}</div>
        </div>
      </div>
    `;
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Show badge popup
   */
  static showBadge(badge) {
    const popup = document.getElementById('badge-popup');
    if (!popup) return;

    document.getElementById('badge-emoji').textContent = badge.emoji;
    document.getElementById('badge-title').textContent = badge.title;
    document.getElementById('badge-sub').textContent = badge.sub;
    popup.classList.add('visible');

    setTimeout(() => {
      popup.classList.remove('visible');
    }, 3000);
  }

  /**
   * Setup editor event listeners
   */
  static setupEditorListeners(onCodeChange) {
    const editor = document.getElementById('code-editor');
    if (!editor) return;

    // Tab key support
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, s) + '  ' + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = s + 2;
      }
      if (e.ctrlKey && e.key === 'Enter') {
        app.submitCode();
      }
    });

    // Auto-save code
    editor.addEventListener('input', () => {
      const code = e.target.value;
      onCodeChange(code);
    });
  }

  /**
   * Scroll to top smoothly
   */
  static scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
