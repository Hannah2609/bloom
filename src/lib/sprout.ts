/**
 * Helper functions for updating sprout status when feedback is submitted
 */

/**
 * Notify that a survey has been submitted
 * This will update the sprout status on the home page
 */
export function notifySurveySubmitted(surveyId: string) {
  window.dispatchEvent(
    new CustomEvent("feedback-submitted", {
      detail: { surveyId },
    })
  );
}

/**
 * Notify that happiness score has been submitted
 * This will update the sprout status on the home page
 */
export function notifyHappinessSubmitted() {
  window.dispatchEvent(new CustomEvent("feedback-submitted"));
}

