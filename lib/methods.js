Meteor.methods({
  /**
   * Add a member to the team. Several things happen here:
   *  - The user input (function arguments) is validated
   *  - If they are valid, add the user to the database
   *  - If not, throw an error
   * @param {String} memberName Name of the member
   * @param {String} memberId Stackoverflow user id
   */
  addMember: function (memberName, memberId) {
    // validate user input
    if (memberName.search(/^.{3,25}/i))
      throw new Meteor.Error('invalid-member-name');
    else if (memberId.search(/^\d{6}$/i) < 0)
      throw new Meteor.Error('invalid-member-id');
    
    // if the validations passed, add the member to the db
    Members.insert({name: memberName, id: memberId});
    
    return true;
  },
  
  deleteMember: function (memberId) {
    Members.remove(memberId);
  }
})