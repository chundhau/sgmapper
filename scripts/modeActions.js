/*************************************************************************
 * File: modeActions.js
 * Desc: Contains the JavaScript functions to respond to interactions 
 * with the UI elements in each mode.
*************************************************************************/

/*************************************************************************
 * @function Mode Floating Action Button CLICK handler 
 * @Desc 
 * When the user clicks on the action button in the current mode, we 
 * present the corresponding action dialog box; disable the 
 * navigation bar buttons; and hide the mode tabs. We use currentMode
 * to determine which action dialog box to display.
 * @global currentMode: index of current mode
 * @global modeTabsContainer: the <div> containing the mode tab buttons
 * @global modeTabPanels: array of tab panels for each mode
 * @global modeActionDialogs: array of dialog boxes for each mode
 * @global dialogActionButtons: array of default ("OK") buttons for
 * each mode's dialog box
 *************************************************************************/
 for (let i = 0; i < GlobalModeActionButtons.length; ++i) {
    GlobalModeActionButtons[i].addEventListener("click",function(e) {
    //Hide tab panel
    GlobalModeTabPanels[GlobalCurrentMode.get()].classList.add("hidden");
    //Hide and disable all UI elements
    GlobalMenuBtn.classList.add("disabled");
    GlobalSearchBtn.classList.add("disabled");
    GlobalProfileBtn.classList.add("disabled");
    GlobalSkipLink.classList.add("hidden"); 
    GlobalModeTabsContainer.classList.add("disabled");
    //Show dialog box
    GlobalModeActionDialogs[GlobalCurrentMode.get()].classList.remove("hidden");
    //Set focus to dialog box's action button
    GlobalDialogActionButtons[GlobalCurrentMode.get()].focus();
    });
}

/*************************************************************************
 * @function Dialog Box Action Button CLICK handler 
 * @Desc 
 * When the user clicks on the primary action button in a dialog box, we
 * perform the corresponding action, close the dialog box; restore 
 * the navigation bar buttons; show the mode tabs; restore the 
 * current mode's main page; and set the focus to the current mode's 
 * action button. We use currentMode to determine which mode we're in.
 * @global currentMode: index of current mode
 * @global modeTabsContainer: the <div> containing the mode tab buttons
 * @global modeTabPanels: array of tab panels for each mode
 * @global modeActionDialogs: array of dialog boxes for each mode
 * @global dialogActionButtons: array of default ("OK") buttons for
 * each mode's dialog box
 *************************************************************************/
 for (let i = 0; i < GlobalDialogActionButtons.length; ++i) {
    GlobalDialogActionButtons[i].addEventListener("click",function(e) {
        //Hide dialog box
        GlobalModeActionDialogs[GlobalCurrentMode.get()].classList.add("hidden");
        //Show tab panel
        GlobalModeTabPanels[GlobalCurrentMode.get()].classList.remove("hidden");
        //Show and enable other UI elements
        GlobalMenuBtn.classList.remove("disabled");       
        GlobalSearchBtn.classList.remove("disabled"); 
        GlobalProfileBtn.classList.remove("disabled");                                 
        GlobalSkipLink.classList.remove("hidden"); 
        GlobalModeTabsContainer.classList.remove("disabled"); 
        //Set focus to floating action button
        GlobalModeActionButtons[GlobalCurrentMode.get()].focus();
        //TO DO: Implement mode-specific functionality
    });
}

/*************************************************************************
 * @function Dialog Box Cancel Button CLICK handler 
 * @Desc 
 * When the user clicks on the cancel button in a dialog box, we
 * close the dialog box; restore the navigation bar buttons; 
 *  show the mode tabs; restore the current mode's main page; and set the 
 * focus to the current mode's action button. We use currentMode to 
 * determine which mode we're in.
 * @global currentMode: index of current mode
 * @global modeTabsContainer: the <div> containing the mode tab buttons
 * @global modeTabPanels: array of tab panels for each mode
 * @global modeActionDialogs: array of dialog boxes for each mode
 * @global dialogActionButtons: array of default ("OK") buttons for
 * each mode's dialog box
 *************************************************************************/
/* Dialog Cancel Button Click Handler */
for (let i = 0; i < GlobalDialogCancelButtons.length; ++i) {
    GlobalDialogCancelButtons[i].addEventListener("click",function(e) {
        //Hide dialog box
        GlobalModeActionDialogs[GlobalCurrentMode.get()].classList.add("hidden");
        //Show tab panel
        GlobalModeTabPanels[GlobalCurrentMode.get()].classList.remove("hidden");
        //Show and enable other UI elements
        GlobalMenuBtn.classList.remove("disabled");       
        GlobalSearchBtn.classList.remove("disabled"); 
        GlobalProfileBtn.classList.remove("disabled");                                 
        GlobalSkipLink.classList.remove("hidden"); 
        GlobalModeTabsContainer.classList.remove("disabled"); 
        //Set focus to floating action button
        GlobalModeActionButtons[GlobalCurrentMode.get()].focus();
    });
}