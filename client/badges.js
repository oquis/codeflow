/**
  Helper functions for the badges template
 */
Template.badges.helpers({
  /**
    Returns all the members in the db, sorted descending by reputation
   */
  members: function () {
    return Members.find({}, {sort: {reputation: -1}});
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
  'click .delete-member': function (event, template) {
    Session.set('selected-member', {id: this._id, name: this.name})
    $('#modal-confirm').modal('show');
  },
  
  /**
    When the member removal is confirmed:
      - The Meteor deleteMember method is called to remove the user from the db
      - The selected-member session variable is cleared
      - The modal window gets hidden
   */
  'click #delete-confirm': function (event, template) {
    Meteor.call('deleteMember', Session.get('selected-member').id);
    Session.set('selected-member', '');
    $('#modal-confirm').modal('hide');
  },
  
  /**
    Get all the members from the Members collection to make an HTTP call to the
    stackexchange API to get the members' stackoverflow user information. If
    the response is successful, a call is made to the updateMember Meteor
    method to update the Members collection, if the response is an error,
    display an error message.
   */
  'click #refresh-badges': function (event, template) {
    var members = Members.find().fetch(),
        membersId = [];
    
    _.each(members, function (member) {
      membersId.push(member.id);
    });
    
    HTTP.get('https://api.stackexchange.com/2.2/users/' + membersId.join(';'),
              {params: {order: 'desc', sort: 'reputation', site: 'stackoverflow'}},
              function (error, result) {
                if (error) {
                  Session.set('error-message', 'Error con la llamada a stackoverflow');
                  $('#modal-error').modal('show');
                } else {
                  Meteor.call('updateMember', result.data.items);
                }
             });
  }
})