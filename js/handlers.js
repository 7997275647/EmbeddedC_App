/**
 * Event Handlers Module
 * Handles user interactions and business logic
 */

class EventHandlers {
  /**
   * Handle code submission and validation
   */
  static submitCode(level, code) {
    const isCorrect = level.validate(code);

    if (isCorrect) {
      const wasNew = stateManager.completeLevel(level.id);
      UIRenderer.updateHeader(
        stateManager.getCompletionCount(),
        LEVELS.length,
        stateManager.state.streak
      );
      UIRenderer.renderSidebar(
        LEVELS,
        stateManager.state.currentLevel,
        stateManager.state.completed
      );
      UIRenderer.showSuccessFeedback(level.explanation);

      if (wasNew) {
        UIRenderer.showBadge(level.badge);
        // Auto-advance after 2.2s
        setTimeout(() => {
          if (stateManager.state.currentLevel < LEVELS.length - 1) {
            app.selectLevel(stateManager.state.currentLevel + 1);
          } else {
            // Re-render to show completion screen
            app.renderCurrentLevel();
          }
        }, 2200);
      }
    } else {
      stateManager.resetStreak();
      UIRenderer.updateHeader(
        stateManager.getCompletionCount(),
        LEVELS.length,
        stateManager.state.streak
      );
      UIRenderer.showErrorFeedback(level.explanation, level.expected);
    }
  }

  /**
   * Handle reset code action
   */
  static resetCode(level) {
    delete stateManager.state.codes[level.id];
    stateManager.saveState();

    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.value = level.expected;
    }

    const feedbackBox = document.getElementById('feedback-box');
    if (feedbackBox) {
      feedbackBox.classList.remove('visible');
    }
  }

  /**
   * Handle hint toggle
   */
  static toggleHint() {
    const isVisible = stateManager.toggleHint();
    UIRenderer.toggleHintBox();
  }
}
