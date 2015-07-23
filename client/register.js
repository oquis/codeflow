/**
  Event handlers for the register template
 */
Template.register.events({
  /**
    Handles the member registration form submission by calling a Meteor method
    to process the user input and insert the member to the db.
    
    After the member has been inserted to the Members collection successfully,
    an http call is made to the stackexchange API to get the new member's
    stackoverflow user information. If the user id provided exists in
    stackoverflow, a call is made to the updateMember Meteor method to update
    the Members collection, if the user doesn't exist the member gets removed
    from the Members collection.
   */
  'submit #member-registration': function (event, template) {
    event.preventDefault();
    template.$('#member-registration .form-group').removeClass('has-error');
    
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
        HTTP.get('https://api.stackexchange.com/2.2/users/' + memberSoId,
                  {params: {order: 'desc', sort: 'reputation', site: 'stackoverflow'}},
                  function (error, response) {
                    if (error) {
                      // handle the error returned by the api
                      if (response && response.data.error_id === 400 && response.data.error_message === 'ids') {
                        Meteor.call('deleteMember', result);
                        Session.set('error-message', 'No existe el ID de stackoverflow proporcionado');
                      } else {
                        Session.set('error-message', 'Error con la llamada a stackoverflow');
                      }
                      $('#modal-error').modal('show');
                    } else {
                      // update the member's data
                      Meteor.call('updateMember', response.data.items);
                      $('#member-registration')[0].reset();
                      $memberName.focus();
                    }
                 });
      }
    });
  },
  
  /**
    Removes the has-error class from the form fields on blur
   */
  'blur #member-registration input': function (event, template) {
    $(event.target).closest('.form-group').removeClass('has-error');
  }
});