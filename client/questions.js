Template.questions.helpers({
  questions: function () {
    return Session.get('team-questions');
  }
});

Template.questions.events({
  'click #refresh-questions': function (event, template) {
    var members = Members.find().fetch(),
        membersId = [];
    
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
  }
});