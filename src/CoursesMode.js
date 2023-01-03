 /*************************************************************************
 * File: coursesMode.js
 * This file defines the CoursesMode react component, which implements
 * SpeedScore's "Courses" mode
 ************************************************************************/
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CoursesMode() {
    const [showDialog, setShowDialog] = useState(false);
    const dialog = useRef();
    const addBtn = useRef();
    const cancelBtn = useRef();

    /*************************************************************************
     * @function handleClick 
     * @Desc 
     * When the user clicks any button, invoke the external JavaScript function
     *  transitionFromDialog (if showDialog is true) or transitionToDialog 
     * (if showDialog is false) to hide/display banner bar and mode tabs. Then
     * toggle the showDialog state variable to force a re-rendering of the 
     * component.
     *************************************************************************/
    function handleClick() {
        if (showDialog)
            window.transitionFromDialog(null);
        else
            window.transitionToDialog(null,"Add Course",function(){});
        setShowDialog(!showDialog);
    }

    /*************************************************************************
     * @function handleKeyPress 
     * @Desc 
     * When the user presses a key, check if it is the tab, enter, or escape
     * key (the three keys we care about). If so, determine which element had
     * the focus and act accordingly: If tab or shift-tab, then shift the focus
     * to next or previous element. If Enter, then call upon handleClick().
     *************************************************************************/
    function handleKeyPress(event) {   
        event.preventDefault();
        if (event.code === "Escape") {
            handleClick();
            return;
        } 
        if (event.code === "Enter" && (document.activeElement === addBtn.current || document.activeElement === cancelBtn.current)) {
            handleClick();
            return;
        }
        if (document.activeElement === dialog.current && event.code === "Tab" && event.shiftKey) {
                cancelBtn.current.focus();
                return;
        }
        if (document.activeElement === dialog.current && event.code === "Tab") {
            addBtn.current.focus();
            return;
        }
        if (document.activeElement === addBtn.current && event.code === "Tab" && event.shiftKey) {
            dialog.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === addBtn.current && event.code === "Tab") {
            cancelBtn.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === cancelBtn.current && event.code === "Tab" &&  event.shiftKey) {
            addBtn.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === cancelBtn.current && event.code === "Tab") {
            dialog.current.focus();
            event.stopPropagation();
            return;
        }
    }

    /* JSX code to render the component */
    if (!showDialog) {
        return (
            <>
            <h1 className="mode-page-header">Courses</h1>
            <p className="mode-page-content">This page is under construction"</p>
            <img className="mode-page-icon" src="sslogo_lg.png" alt="SpeedScore logo"/>
            <button className="float-btn" onClick={handleClick}>
                <FontAwesomeIcon icon="map-pin" />&nbsp;New Course</button>
            </>
        );
    } else {
      return (
        <div id="coursesModeDialog" ref={dialog} tabIndex="0"
            className="mode-page action-dialog" role="dialog" 
            aria-modal="true" aria-labelledby="newCourseHeader" 
            onKeyDown={handleKeyPress}>
            <h1 id="addCourseHeader" className="mode-page-header">Add Course</h1>
            <p className="mode-page-content">
            This modal dialog is under construction.
            </p>
            <img className="mode-page-icon" src="sslogo_lg.png" 
                alt="SpeedScore logo" />
            <div className="mode-page-btn-container">
            <button id="coursesModeAddBtn" ref ={addBtn} tabIndex="0"
                    className="mode-page-btn action-dialog action-button" 
                    type="button"onClick={handleClick} 
                    onKeyDown={handleKeyPress}>Add Course</button>
            <button id="coursesModeCancelBtn" ref={cancelBtn} tabIndex="0"
                    className="mode-page-btn action-dialog cancel-button"
                    type="button" onClick={handleClick}
                    onKeyDown={handleKeyPress}>Cancel</button>
            </div>
        </div> 
      );
    }
}

export default CoursesMode;