/**
  When the subscription is ready, trigger the refresh questions button click
  event to update the questions
 */
Meteor.subscribe('members', {
  onReady: function () {
    $('#refresh-questions').click();
  }
});
