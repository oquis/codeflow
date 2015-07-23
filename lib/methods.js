Meteor.methods({
  /**
   * Add a member to the team. Several things happen here:
   *  - The user input (function arguments) is validated
   *  - If they are valid, add the user to the database
   *  - If not, throw an error
   * @param {String} memberName Name of the member
   * @param {String} memberId Stackoverflow user id
   * @returns Mongo DB's member _id
   */
  addMember: function (memberName, memberId) {
    // validate user input
    if (memberName.search(/^.{3,25}/i))
      throw new Meteor.Error('invalid-member-name');
    else if (memberId.search(/^[0-9]+$/i) < 0)
      throw new Meteor.Error('invalid-member-id');
    
    // no errors, add the member to the db
    var id = Members.insert({name: memberName, id: memberId});
    
    return id;
  },
  
 /**
  * Delete a member from the team.
  * @param {String} memberId Mongo DB's member _id
  */
  deleteMember: function (memberId) {
    Members.remove(memberId);
  },
  
  /**
   * Updates the members collection with the info from a stackexchange API call
   * @param {Array} soData Array of objects containing a member's stackoverflow
   *                       user information
   */
  updateMember: function (soData) {
    _.each(soData, function (member) {
      Members.update({id: member.user_id.toString()}, {$set: member});
    });
  }
});