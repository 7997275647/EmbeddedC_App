/**
 * Event Handlers Module
 * Handles user interactions and business logic
 */

class EventHandlers {
  /**
   * Handle code submission and validation
   */
  static async submitCode(level, code) {
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn ? submitBtn.textContent : '▶ Run & Check';
    if (submitBtn) {
      submitBtn.textContent = 'Compiling...';
      submitBtn.disabled = true;
    }

    try {
      const result = await APIValidator.validate(level.id, code);
      const isCorrect = result.correct;

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

        // Show detailed error message
        let errorMessage = result.message;
        if (result.details) {
          errorMessage += `\n\n${result.details}`;
        }
        if (result.type === 'output_mismatch') {
          errorMessage += `\n\nExpected output:\n${result.expected}\n\nYour output:\n${result.actual}`;
        }

        UIRenderer.showErrorFeedback(errorMessage, level.expected);
      }
    } catch (error) {
      console.error('Submission error:', error);
      stateManager.resetStreak();
      UIRenderer.updateHeader(
        stateManager.getCompletionCount(),
        LEVELS.length,
        stateManager.state.streak
      );
      UIRenderer.showErrorFeedback(
        `Failed to validate code: ${error.message}`,
        level.expected
      );
    } finally {
      // Restore button state
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
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
      editor.value = UIRenderer.getTemplate(level);
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
