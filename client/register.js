// Template.register.helpers({
//   errorMessage: function () {
//     return Session.get('errorMessage');
//   }
// });

Template.register.events({
  'submit #member-registration': function (event, template) {
    event.preventDefault();
    template.$('#member-registration .form-group').removeClass('has-error')
    
    // get and trim the input fields values
    var memberName = $.trim(template.$('#member-name').val()),
        memberSoId = $.trim(template.$('#member-stackoverflowID').val());
    
    // call the addMember method with the member's name and id so the code
    // runs on the client and server
    Meteor.call('addMember', memberName, memberSoId, function (error, result) {
      var $memberName = template.$('#member-name'),
          $memberId = template.$('#member-stackoverflowID');
      
      // if there is an error in a field, add the has-error class
      // to the form group according to the error type
      if (error) {
        if (error.error === 'invalid-member-name') {
          $memberName.closest('.form-group').addClass('has-error');
          $memberName.focus().select();
        } else if (error.error === 'invalid-member-id') {
          $memberId.closest('.form-group').addClass('has-error');
          $memberId.focus().select();
        }
      }
      
      // if there were no error on the fields, the user has been added to the
      // db, so we only need to reset the form and set focus on the member name
      if (result) {
        $('#member-registration')[0].reset();
        $memberName.focus();
      }
    });
  },
  
  'blur #member-registration input': function (event, template) {
    console.log(event);
    $(event.target).closest('.form-group').removeClass('has-error');
  }
});