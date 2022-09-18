 /*************************************************************************
 * File: createAccount.js
 * This file contains functions that support the "Create Account" Dialog.
 ************************************************************************/

  /*************************************************************************
 * @function createAccountBtn CLICK Handler 
 * @Desc 
 * When the user clicks the "Create Account" button link on the "Log In"
 * page, transition to the "Create Account" dialog.
 * @global GlobalCreateAccountDialog: The "Create Account" dialog
 * @global GlobalLoginPage: The Log In page
 * @global GlobalAcctEmailField: The email field
 *************************************************************************/
GlobalCreateAccountBtn.addEventListener("click",function(e) {
    GlobalLoginPage.classList.add("hidden");
    GlobalCreateAccountDialog.classList.remove("hidden");
    document.title = "Create Account";
    GlobalAcctEmailField.focus();
});

/*************************************************************************
 * @function acctProfilePicField CHANGE Handler 
 * @Desc 
 * When the user finishes interacting with the File picker dialog box,
 * update the user's profile picture based on the selection from the
 * file picker. If the user cancels out of the File Picker, the input
 * element's value will be empty and we set the profile picture to the
 * default picture.
 * @global acctProfilePicField: The "Create Account" form field 
 *         containing the optional profile picture
 * @global acctProfilePicImage: The "Create Account" <img> element that
 *         displays the user's profile picture (possibly the default)
 *************************************************************************/
 GlobalAcctProfilePicField.addEventListener("change",function(e) {
    if (GlobalAcctProfilePicField.value.length !== 0) {
        const reader = new FileReader();
        reader.readAsDataURL(GlobalAcctProfilePicField.files[0]);
        reader.addEventListener("load",function() {
            GlobalAcctProfilePicImage.setAttribute("src",this.result);
        });
    } else {
        GlobalAcctProfilePicImage.setAttribute("src",GlobalDefaultProfilePic);
    }
});

/*************************************************************************
 * @function resetCreateAccountForm 
 * @Desc 
 * When the user exits the "Create Account" Dialog, reset the form to
 * show blank data in case the form is visited again.
 * @global GlobalAcctEmailField: Form's email field
 * @global GlobalAcctPasswordField: Form's password field
 * @global GlobalAcctPasswordRepeatField: Form's repeat pw field
 * @global GlobalAcctDisplayNameField: Form's display name field
 * @global GlobalAcctSecurityQuestionField: Form's security q field
 * @global GlobalAcctSecurityAnswerField: Form's security answ field
 * @global GlobalAcctErrBox: <div> containing the error messages
 * @global GlobalAcctEmailErr: Error message for email field
 * @global GlobalAcctPasswordErr: Error message for password field
 * @global GlobalAcctRepeatPasswordErr: Error message for repeat pw field
 * @global GlobalAcctDisplaynameErr: Error message for display name field
 * @global GlobalAcctSecurityQuestionErr: Error message for security q field
 * @global GlobalAcctSecurityAnswerErr: Error message for security answ field
 *************************************************************************/
 function resetCreateAccountForm() {
    GlobalAcctEmailField.value = "";
    GlobalAcctPasswordField.value = "";
    GlobalAcctPasswordRepeatField.value = "";
    GlobalAcctDisplayNameField.value = "";
    GlobalAcctProfilePicField.value = "";
    GlobalAcctProfilePicImage.setAttribute("src",GlobalDefaultProfilePic);
    GlobalAcctSecurityQuestionField.value = "";
    GlobalAcctErrBox.classList.add("hidden");
    GlobalAcctSecurityAnswerField.value = "";
    GlobalAcctEmailErr.classList.add("hidden");
    GlobalAcctPasswordErr.classList.add("hidden");
    GlobalAcctPasswordRepeatErr.classList.add("hidden");
    GlobalAcctDisplayNameErr.classList.add("hidden");
    GlobalAcctSecurityQuestionErr.classList.add("hidden");
    GlobalAcctSecurityAnswerErr.classList.add("hidden");
    GlobalFirstFocusableCreateAccountItem.set(GlobalAcctEmailField);
}

/*************************************************************************
 * @function accountCreatedClose CLICK Handler 
 * @Desc 
 * When the user clicks on the close button of the "Account Created"
 * toast notification on the "Log In" page, close it.
 * @global accountCreated: The "Account Created" toast
 *************************************************************************/
 accountCreatedClose.addEventListener("click",function() {
    accountCreated.classList.add("hidden");
});

 /*************************************************************************
 * @function createAccount 
 * @desc 
 * Given a JavaScript object containing a new account, create the account,
 * return the user to the "Log In" page, and display a toast message
 * indicating that a new account was created.
 * For now, we display the account data in an alert box. Eventually,
 * we will store the data to localStorage.
 * @global loginPage: The "Log In" page
 * @global createAccountDialog: The "Create Account" dialog
 * @global accountCreatedEmail: The field in the toast notification where
 *         we display the email of the new account.
 * @global: accountCreated: The toast notification on the "Log In" page
  *************************************************************************/
function createAccount(newAcct) {
    resetCreateAccountForm();
    alert("New account created: " + JSON.stringify(newAcct));
    document.title = "Log In to SpeedScore";
    GlobalCreateAccountDialog.classList.add("hidden");
    GlobalLoginPage.classList.remove("hidden");
    GlobalAccountCreatedEmail.textContent = newAcct.email;
    GlobalAccountCreated.classList.remove("hidden");
}

 /*************************************************************************
 * @function createAccountForm SUBMIT Handler 
 * @Desc 
 * When the user clicks on the "Create Account" button, we first check the
 * validity of the fields, presenting accessible
 * error notifications if errors exist. If no errors exist, we
 * call the createAccount() function, passing in the account data
 * @global GlobalCreateAccountForm: the <form> element whose 
 *         SUBMIT handler is triggered
 * @global GlobalAcctEmailField: Form's email field
 * @global GlobalAcctPasswordField: Form's password field
 * @global GlobalAcctPasswordRepeatField: Form's repeat pw field
 * @global GlobalAcctDisplayNameField: Form's display name field
 * @global GlobalAcctSecurityQuestionField: Form's security q field
 * @global GlobalAcctSecurityAnswerField: Form's security answ field
 * @global GlobalAcctErrBox: <div> containing the error messages
 * @global GlobalAcctEmailErr: Error message for email field
 * @global GlobalAcctPasswordErr: Error message for password field
 * @global GlobalAcctRepeatPasswordErr: Error message for repeat pw field
 * @global GlobalAcctDisplaynameErr: Error message for display name field
 * @global GlobalAcctSecurityQuestionErr: Error message for security q field
 * @global GlobalAcctSecurityAnswerErr: Error message for security answ field
 *************************************************************************/
  createAccountForm.addEventListener("submit",function(e) {
    e.preventDefault(); //Prevent default submit behavior
    //Is the email field valid?
    let emailValid = !GlobalAcctEmailField.validity.typeMismatch && 
                     !GlobalAcctEmailField.validity.valueMissing;
    //Is the password field valid?
    let passwordValid = !GlobalAcctPasswordField.validity.patternMismatch && 
                        !GlobalAcctPasswordField.validity.valueMissing;
    let repeatPasswordValid = (GlobalAcctPasswordField.value === 
                               GlobalAcctPasswordRepeatField.value);
    let displayNameValid = !GlobalAcctDisplayNameField.validity.tooShort &&
                           !GlobalAcctDisplayNameField.validity.valueMissing;
    let securityQuestionValid = !GlobalAcctSecurityQuestionField.validity.tooShort &&
                                !GlobalAcctSecurityQuestionField.validity.valueMissing;
    let securityAnswerValid = !GlobalAcctSecurityAnswerField.validity.tooShort &&
                              !GlobalAcctSecurityAnswerField.validity.valueMissing;
    if (emailValid && passwordValid && repeatPasswordValid &&
        displayNameValid && securityQuestionValid & securityAnswerValid) { 
        //All is well -- Call createAccount()
       createAccount({email: GlobalAcctEmailField.value, 
                      password: GlobalAcctPasswordField.value,
                      displayName: GlobalAcctDisplayNameField.value,
                      profilePic: GlobalAcctProfilePicImage.getAttribute("src"),
                      securityQuestion: GlobalAcctSecurityQuestionField.value,
                      securityAnswer: GlobalAcctSecurityAnswerField.value
                    });
       return;
    }
    //If here, at least one field is invalid: Display the errors
    //and allow user to fix them.
    GlobalAcctErrBox.classList.remove("hidden");
    document.title = "Error: Create Account";
    if (!securityAnswerValid) { //Display name field is invalid
        GlobalAcctSecurityAnswerErr.classList.remove("hidden");
        GlobalAcctSecurityAnswerErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctSecurityAnswerErr);
    } else {
        GlobalAcctSecurityAnswerErr.classList.add("hidden");
    }
    if (!securityQuestionValid) { //Display name field is invalid
        GlobalAcctSecurityQuestionErr.classList.remove("hidden");
        GlobalAcctSecurityQuestionErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctSecurityQuestionErr);
    } else {
        GlobalAcctSecurityQuestionErr.classList.add("hidden");
    } 
    if (!displayNameValid) { //Display name field is invalid
        GlobalAcctDisplayNameErr.classList.remove("hidden");
        GlobalAcctDisplayNameErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctDisplayName);
    } else {
        GlobalAcctDisplayNameErr.classList.add("hidden");
    } 
    if (!repeatPasswordValid) { //Password repeat field is invalid
        GlobalAcctPasswordRepeatErr.classList.remove("hidden");
        GlobalAcctPasswordRepeatErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctPasswordRepeatErr);
    } else {
        GlobalAcctPasswordRepeatErr.classList.add("hidden");
    } 
    if (!passwordValid) { //Password field is invalid
        GlobalAcctPasswordErr.classList.remove("hidden");
        GlobalAcctPasswordErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctPasswordErr);
    } else {
        GlobalAcctPasswordErr.classList.add("hidden");
    } 
    if (!emailValid) { //Email field is invalid
        GlobalAcctEmailErr.classList.remove("hidden");
        GlobalAcctEmailErr.focus();
        GlobalFirstFocusableCreateAccountItem.set(GlobalAcctEmailErr);
    } else {
        GlobalAcctEmailErr.classList.add("hidden");
    }
 });