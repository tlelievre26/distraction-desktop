const { dialog } = require('electron');

const showErrorPopup = async (error) => {

  if(typeof error === 'string') { // If we just want to show a specific error msg, we pass in a string
    const defaultErr = {
      ...error, //Any fields explicitly defined in error overwrite the ones below
      type: 'error',
      title: 'Error',
      message: error,
      buttons: ['OK'],
      defaultId: 0 // 'OK' button
    };
        
    //If we're only passing in a string we can assume that we don't need to wait for the users input
    const response = dialog.showMessageBox(defaultErr);
    return response; //Only returning response so it doesn't cause a linter error
  }
  else { //If input is instead an object, assume we have a more specific error
    //Main use case I can think of for this is the user ending the study session before 15 mins and giving them a popup that says "Are you sure"
    
    //Await here means system waits for user to confirm before doing anything else
    const response = await dialog.showMessageBox(defaultErr);
    //May want to add custom logic based on the response

    return response; //Only returning response so it doesn't cause a linter error
  }

};

module.exports = showErrorPopup;