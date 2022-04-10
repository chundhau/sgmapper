/*************************************************************************
 * File: main.js
 * Definitions of variables to maintain app state and provide
 * convenient access to frequently used DOM elements.
 *************************************************************************/

/* MENU VARIABLES */
const GlobalMenuBtn =  document.getElementById("menuBtn"); 
const GlobalMenuItems = document.querySelectorAll("li[role='menuitem']");

//Since GlobalFocusedMenuItem is mutable, we implement it as an
//immediately invoked function expression, so that it can only
//be updated through its own set function.
const GlobalFocusedMenuItem = (() => {
    let _focusedMenuItem = 0
    const Store = {
        get: () => _focusedMenuItem,
        set: val => (_focusedMenuItem = val)
    }
    return Object.freeze(Store)
})()

