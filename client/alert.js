/**
  Helper functions for the alert template
 */
Template.alert.helpers({
  /**
    Returns the error message stored in a session variable
   */
  errorMessage: function () {
    return Session.get('error-message');
  }
})