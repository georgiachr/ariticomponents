/**
 * Created by georgia.chr on 26-Aug-15.
 */
myApp
  .service('myProfileService', [function() {
    return {
      myName: "Panikos",
      myGender: "Male",
      modified: 0,
      setGender: function setGender(gender){
        this.myGender = gender;
        this.modified++;
      },
      setName: function setName(name){
        this.myName = name;
        this.modified++;
      },
      getGender: function getGender(){
        return this.myGender;
      },
      getName: function getGender(){
        return this.myName;
      },
      getChanges: function getChanges(){
        return this.modified;
      }
    }
  }]);
