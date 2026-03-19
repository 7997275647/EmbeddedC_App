/**
 * Main Application Module
 * Orchestrates all functionality and manages app lifecycle
 */

class EmbeddedCApp {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;

    // Update header with initial state
    this.updateHeader();

    // Render sidebar
    this.renderSidebar();

    // Render current level
    this.renderCurrentLevel();

    // Setup editor listeners
    this.setupEditorListeners();

    this.initialized = true;
  }

  /**
   * Update header display
   */
  updateHeader() {
    UIRenderer.updateHeader(
      stateManager.getCompletionCount(),
      LEVELS.length,
      stateManager.state.streak
    );
  }

  /**
   * Render sidebar
   */
  renderSidebar() {
    UIRenderer.renderSidebar(
      LEVELS,
      stateManager.state.currentLevel,
      stateManager.state.completed
    );
  }

  /**
   * Render current level
   */
  renderCurrentLevel() {
    const levelIndex = stateManager.state.currentLevel;
    const level = LEVELS[levelIndex];
    const savedCode = stateManager.getCode(level.id, null);
    
    // Use saved code if exists, otherwise use template
    const currentCode = savedCode !== null ? savedCode : UIRenderer.getTemplate(level);

    UIRenderer.renderLevel(
      level,
      currentCode,
      stateManager.isAllCompleted(LEVELS.length)
    );

    UIRenderer.hideHintBox();
    this.setupEditorListeners();
  }

  /**
   * Setup editor event listeners
   */
  setupEditorListeners() {
    const editor = document.getElementById('code-editor');
    if (!editor) return;

    const level = LEVELS[stateManager.state.currentLevel];

    // Remove previous listeners by cloning
    const newEditor = editor.cloneNode(true);
    editor.parentNode.replaceChild(newEditor, editor);

    // Add tab key support
    newEditor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = newEditor.selectionStart;
        const end = newEditor.selectionEnd;
        newEditor.value = newEditor.value.substring(0, s) + '  ' + newEditor.value.substring(end);
        newEditor.selectionStart = newEditor.selectionEnd = s + 2;
      }
      if (e.ctrlKey && e.key === 'Enter') {
        this.submitCode();
      }
    });

    // Auto-save code on input
    newEditor.addEventListener('input', (e) => {
      stateManager.saveCode(level.id, e.target.value);
    });
  }

  /**
   * Select a level
   */
  selectLevel(levelIndex) {
    stateManager.setCurrentLevel(levelIndex);
    this.renderSidebar();
    this.renderCurrentLevel();
    UIRenderer.scrollToTop();
  }

  /**
   * Toggle hint display
   */
  toggleHint() {
    EventHandlers.toggleHint();
  }

  /**
   * Reset code for current level
   */
  resetCode() {
    const level = LEVELS[stateManager.state.currentLevel];
    EventHandlers.resetCode(level);
  }

  /**
   * Submit code for validation
   */
  submitCode() {
    const level = LEVELS[stateManager.state.currentLevel];
    const code = document.getElementById('code-editor').value;
    EventHandlers.submitCode(level, code);
  }
}

// Create global app instance
const app = new EmbeddedCApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
