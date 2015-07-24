/**
  Helper functions for the navbar template
 */
Template.navbar.helpers({
  /**
    Returns all the members in the db, sorted descending by reputation
   */
  members: function () {
    return Members.find({}, {sort: {reputation: -1}});
  }
});