/*************************************************************************
 * File: editProfile.js
 * This file contains functions that support the "Account and Profile
 * Settings" Dialog.
 ************************************************************************/

/*************************************************************************
 * @function populateProfileSettingsForm 
 * @Desc 
 * Populates the "Account and Profile Settings" dialog form with the 
 * current user's data. 
 * The following global vars are used to access fields in the form
 *  @global GlobalProfileEmailField
 *  @global GlobalProfilePasswordField
 *  @global GlobalProfileSecurityQuestionField
 *  @global GlobalProfileSecurityAnswerField
 *  @global GlobalProfileDisplayNameField
 *  @global GlobalProfilePicImage
 *  @global GlobalProfileBioField    
 *  @global GlobalProfileBestStrokesField
 *  @global GlobalProfileBestMinutesField
 *  @global GlobalProfileBestSecondsField
 *  @global GlobalProfileBestCourseField
 *************************************************************************/
 function populateProfileSettingsForm() {
    GlobalProfileEmailField.value = GlobalUserData.accountInfo.email;
    GlobalProfilePasswordField.value = GlobalUserData.accountInfo.password;
    GlobalProfileSecurityQuestionField.value = GlobalUserData.accountInfo.securityQuestion;
    GlobalProfileSecurityAnswerField.value = GlobalUserData.accountInfo.securityAnswer;
    GlobalProfileDisplayNameField.value = GlobalUserData.identityInfo.displayName;
    GlobalProfilePicImage.setAttribute("src",GlobalUserData.identityInfo.profilePic);
    GlobalProfileBioField.value = GlobalUserData.speedgolfInfo.bio;
    GlobalProfileHomeCourseField.value = GlobalUserData.speedgolfInfo.homeCourse;
    GlobalProfileFirstRoundField.value = GlobalUserData.speedgolfInfo.firstRound;
    GlobalProfileBestStrokesField.value = GlobalUserData.speedgolfInfo.personalBest.strokes;
    GlobalProfileBestMinutesField.value = GlobalUserData.speedgolfInfo.personalBest.minutes;
    GlobalProfileBestSecondsField.value = GlobalUserData.speedgolfInfo.personalBest.seconds;
    GlobalProfileBestCourseField.value = GlobalUserData.speedgolfInfo.personalBest.course;   
    //Check checkboxes...
    for (const prop in GlobalUserData.speedgolfInfo.clubs) {
        document.getElementById("sg" + prop).checked = true;
    }
    GlobalProfileClubCommentsField.value = GlobalUserData.speedgolfInfo.clubComments;
    GlobalProfileEmailField.focus(); //Set focus to first field.
}

/*************************************************************************
 * @function profileBtn CLICK Handler 
 * @Desc 
 * When the user clicks their profile picture, hide the menu button, tabs,
 * and current tab panel, and show the "Account and Profile Settings" Dialog
 * @global GlobalMenuBtn: The menu button
 * @global GlobalModeTabsContainer: The mode tabs
 * @global GlobalModeTabPanels: array of tab panels 
 * @global GlobalCurrentMode, index of current mode.
 * @global GlobalProfileSettingsDialog: The "Account and Profile Settings" 
 *         dialog
 *************************************************************************/
 GlobalProfileBtn.addEventListener("click", function(e) {
    transitionToDialog(GlobalProfileSettingsDialog, "Edit Account and Profile");
    populateProfileSettingsForm();
    GlobalProfileEmailField.focus();
});