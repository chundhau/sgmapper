/*************************************************************************
 * File: login.js
 * This file contains functions that support the log in page.
*************************************************************************/

/*************************************************************************
 * @function resetLoginForm
 * @desc 
 * After a user successfully logs in, this function should be called to
 * reset the form to its default state. 
 * @global GlobalErrorBox: The <div> containing the list of error messages
 * @global GlobalEmailField: The form's email field
 * @global GlobalPasswordField: The form's password field
 * @global GlobalEmailError: The error message for the email field
 *************************************************************************/
 function resetLoginForm() {
    document.title = "Log in to SpeedScore";
    GlobalErrorBox.classList.add("hidden");
    GlobalEmailError.classList.add("hidden");
    GlobalPasswordError.classList.add("hidden");
    GlobalEmailField.value = "";
    GlobalPasswordField.value = "";
}

/*************************************************************************
 * @function login
 * @desc 
 * When a user is successfully authenticated, this function resets the 
 * login form and configure the app's initial state and appearance. 
 * The login page is hidden and the default app mode ("Feed") is displayed. 
 * @global GlobalLoginPage: The login page <div>
 * @global GlobalModeTabsContainer: The <div> containing the mode tabs
 * @global GlobalModeTabPanels: Array of tab panels associated with each mode
 * @global GlobalCurrentMode: Integer index indicating current mode 
 * @global GlobalSearchBtn: The search button in the top banner bar
 * @global GlobalProfileBtn: The profile picture button in the top banner bar
 *************************************************************************/
 function login(userId) {
    //1. Reset the login form in case user logs in again
    resetLoginForm();
    //2. Reset state of app with user logged in.
    GlobalLoginPage.classList.add("hidden");
    GlobalModeTabsContainer.classList.remove("hidden");
    GlobalModeTabPanels[GlobalCurrentMode.get()].classList.remove("hidden");
    GlobalMenuBtn.classList.remove("hidden");
    GlobalMenu.classList.remove("hidden");
    GlobalSearchBtn.classList.remove("hidden");
    GlobalProfileBtn.classList.remove("hidden");
    document.title = "SpeedScore: Activity Feed";
}

/*************************************************************************
 * @function Login Form SUBMIT Handler 
 * @Desc 
 * When the user clicks on the "Log In" button, we first check the
 * validity of the email and password fields, presenting accessible
 * error notifications if errors exist. If no errors exist, we
 * call the login() function, passing in the username of the user
 * @global GlobalLoginForm: the <form> element whose 
 *         SUBMIT handler is triggered
 * @global GlobalEmailField: The form's email field
 * @global GlobalPasswordField: The form's password field
 * @global GlobalErrorBox: The <div> containing the error messages
 * @global GlobalEmailError: The error message for the email field
 * @global GlobalPasswordError: The error message for the password field
 *************************************************************************/
 loginForm.addEventListener("submit",function(e) {
    e.preventDefault(); //Prevent default submti behavior
    //Is the email field valid?
    let emailValid = !GlobalEmailField.validity.typeMismatch && 
                     !GlobalEmailField.validity.valueMissing;
    //Is the password field valid?
    let passwordValid = !GlobalPasswordField.validity.patternMismatch && 
                        !GlobalPasswordField.validity.valueMissing;
    if (emailValid && passwordValid) { //All is well -- Exit
       login(GlobalEmailField.value);
       return;
    }
    //If here, at least one field is invalid
    GlobalErrorBox.classList.remove("hidden");
    if (!emailValid) { //Email field is invalid
        document.title = "Error: Log in to SpeedScore";
        GlobalEmailError.classList.remove("hidden");
        GlobalEmailError.focus();
    } else {
        GlobalEmailError.classList.add("hidden");
    }
    if (!passwordValid) { //Password field is invalid
        GlobalPasswordError.classList.remove("hidden");
        if (emailValid) {
             document.title = "Error: Log in to SpeedScore";
             GlobalPasswordError.focus();
        }
    } else {
        GlobalPasswordError.classList.add("hidden");
    } 
 });