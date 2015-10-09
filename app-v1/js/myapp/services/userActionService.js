/**
 * Created by georgia.chr on 07-Oct-15.
 */


myApp
  .service('useractionservice', [function() {

    return {


      admin: false,
      mainAction: null,
      mainActiveAction: null,
      currentAction: null,
      secondaryActiveAction: null,

      setUserAdmin: function setUserAdmin() {
        this.admin = true;
        console.log('service: set user admin');
      },

      /**
       * Administrator: Add, Show list, Show Statistics
       * @param action
       */
      setUserAction: function setUserAction(action) {
        console.log("set user action = " + action);
        this.currentAction = action;
      },

      resetUserActions: function resetUserStatus() {
        this.admin = false;
        this.currentAction = null;
      },

      /**
       * Administrator: Users, Statistics
       * Nurse:
       * Doctor:
       *
       * @param action
       */
      setUserSelectedMainAction: function setUserSelectedMainAction(action) {
        this.mainActiveAction = action;
      },

      setUserSelectedSecondaryAction: function setUserSelectedSecondaryAction(action) {
        this.secondaryActiveAction = action;
      },

      resetSecondaryAction: function resetSecondaryAction() {
        this.secondaryActiveAction = null;
      },

      getMainAction: function getMainAction(){
        return this.mainActiveAction;
      },

      getSecondaryAction: function getSecondaryAction(){
        return this.secondaryActiveAction;
      }


    }

  }]);
