/*************************************************************************
 * File: main.js
 * Definitions of variables to maintain app state and provide
 * convenient access to frequently used DOM elements.
 *************************************************************************/

/* MENU VARIABLES */
const GlobalMenuBtn =  document.getElementById("menuBtn"); 
const GlobalMenuItems = document.querySelectorAll("li[role='menuitem']");

//Note: Per Josh Wulf's blog post, we implement all immutable global variables using
//immediately invoked function expressions
const GlobalFocusedMenuItem = (() => {
    let _focusedMenuItem = 0
    const Store = {
        get: () => _focusedMenuItem,
        set: val => (_focusedMenuItem = val)
    }
    return Object.freeze(Store)
})()

/* MODE TAB VARIABLES */
//The current mode (0, 1, 2, or 3)
const GlobalCurrentMode = (() => {
    let _currentMode= 0
    const Store = {
        get: () => _currentMode,
        set: val => (_currentMode = val)
    }
    return Object.freeze(Store)
})()

const GlobalFocusedMode = (() => {
    let _focusedMode= 0
    const Store = {
        get: () => _focusedMode,
        set: val => (_focusedMode = val)
    }
    return Object.freeze(Store)
})()

//Array of mode tab button elements:
const GlobalModeTabButtons = 
  document.querySelectorAll("button[role='tab']");
//Array of mode tab panel elements:
const GlobalModeTabPanels = 
  document.querySelectorAll("div[role='tabpanel']");

