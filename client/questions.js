/**
  Helper functions for the questions template
 */
Template.questions.helpers({
  /**
    Returns all the questions received from the stackexchange API
    that are stored in a session variable, not in the db
   */
  questions: function () {
    return Session.get('team-questions');
  }
});

/**
  Event handlers for the questions template
 */
Template.questions.events({
  /**
    Get all the members from the Members collection to make an HTTP call to the
    stackexchange API to get the members' stackoverflow questions. If
    the response is successful, the questions are stored in a session variable
    to display them, if the response is an error, display an error message.
   */
  'click #refresh-questions': function (event, template) {
    var members = Members.find().fetch(),
        membersId = [];
    
    // delete the questions shown and don't refresh the questions if
    // there are no registered members
    if (!members.length) {
      Session.set('team-questions', []);
      return;
    }
    
    _.each(members, function (member) {
      membersId.push(member.id);
    });

    HTTP.get('https://api.stackexchange.com/2.2/users/' + membersId.join(';') + '/questions',
              {params: {order: 'desc', sort: 'creation', site: 'stackoverflow'}},
              function (error, result) {
                if (error) {
                  Session.set('error-message', 'Error con la llamada a stackoverflow');
                  $('#modal-error').modal('show');
                } else {
                  _.each(result.data.items, function (question) {
                    question.creation_date = moment(question.creation_date, 'X').format('DD/MM/YYYY');
                    question.last_activity_date = moment(question.last_activity_date, 'X').format('DD/MM/YYYY');
                  });
                  Session.set('team-questions', result.data.items);
                }
             });
    return;
  }
});