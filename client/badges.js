/**
  Helper functions for the badges template
 */
Template.badges.helpers({
  /**
    Returns all the members in the db
   */
  members: function () {
    return Members.find().fetch();
  },
  
  /**
    Returns the selected member for removal stored in a session variable
   */
  selectedMember: function () {
    return Session.get('selected-member');
  }
});

/**
  Event handlers for the badges template
 */
Template.badges.events({
  /**
    Two things happen when the delete member button is clicked:
      - The selected member name and id get stored in a session variable
        for future reference
      - A modal window is shown to confirm the removal of the member
   */
  'click #delete-member': function (event, template) {
    Session.set('selected-member', {id: this._id, name: this.name})
    $('#modal-confirm').modal('show');
  },
  
  /**
    When the member removal is confirmed:
      - The Meteor deleteMember method is called to remove the user fromt he db
      - The selected-member session variable is cleared
      - The modal window gets hidden
   */
  'click #delete-confirm': function (event, template) {
    Meteor.call('deleteMember', Session.get('selected-member').id);
    Session.set('selected-member', '');
    $('#modal-confirm').modal('hide');
  }
})