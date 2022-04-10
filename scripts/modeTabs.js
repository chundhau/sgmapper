/*************************************************************************
 * File: modeTabs.js
 * Desc: Contains the JavaScript functions to handle interactions 
 * with the mode tabs ("Feed", "Rounds", "Courses", "Buddies"). 
 * We use the w3.org "Example of Tabs with Manual Activiation" as a 
 * specification for implementing the accessible keyboard interface:
 * https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
*************************************************************************/

/*************************************************************************
 * @function switchMode 
 * @desc 
 * Switch from the current mode to a new mode. Unhighlight previous
 * mode tab button, highlight new mode tab button, hide previous mode
 * tab panel, show new mode tab panel, and update mode variables.
 * @param newMode, an integer index (into modeTabButtons and 
 *        modeTabPanels) corresponding to the new mode
 * @global modeTabButtons (array of HTML tab button elements) 
 * @global modeTabPanels (array of HTML tab panel elements)
 * @global currentMode (index of current mode)
 * @global focusedMode (index of mode with current focus)
 *************************************************************************/
 function switchMode(newMode) {
    //Switch mode button
    GlobalModeTabButtons[GlobalCurrentMode.get()].classList.remove("modetab-selected");
    GlobalModeTabButtons[GlobalCurrentMode.get()].setAttribute("aria-selected",false);
    GlobalModeTabButtons[newMode].classList.add("modetab-selected");
    GlobalModeTabButtons[newMode].setAttribute("aria-selected",true);
    //Switch tab panel
    GlobalModeTabPanels[GlobalCurrentMode.get()].classList.add("hidden");
    GlobalModeTabPanels[newMode].classList.remove("hidden");
    GlobalCurrentMode.set(newMode); //Change mode
    GlobalFocusedMode.set(newMode); //Change focused mode
}

/*************************************************************************  
 * Bind switchMode() to each tab button's click handler.
 *************************************************************************/
for (let i = 0; i < GlobalModeTabButtons.length; ++i) {
    GlobalModeTabButtons[i].addEventListener("click",() => switchMode(i));
}