Template.badges.helpers({
  members: function () {
    return Members.find().fetch();
  },
  selectedMember: function () {
    return Session.get('selected-member');
  }
});

Template.badges.events({
  'click #delete-member': function (event, template) {
    console.log(this);
    Session.set('selected-member', {id: this._id, name: this.name})
    $('#modal-confirm').modal('show');
  },
  
  'click #delete-confirm': function (event, template) {
    Meteor.call('deleteMember', Session.get('selected-member').id, function (error, result) {
      
    });
    Session.set('selected-member', '');
    $('#modal-confirm').modal('hide');
  }
})