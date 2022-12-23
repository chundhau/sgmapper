
import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CoursesMode() {
    const [showDialog, setShowDialog] = useState(false);

    function handleClick() {
        setShowDialog(!showDialog);
 
    }
   
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
        <div id="coursesModeDialog" tabIndex="0"
            className="mode-page action-dialog" role="dialog" 
            aria-modal="true" aria-labelledby="newCourseHeader">
            <h1 id="addCourseHeader" className="mode-page-header">Add Course</h1>
            <p className="mode-page-content">
            This modal dialog is under construction.
            </p>
            <img className="mode-page-icon" src="sslogo_lg.png" 
                alt="SpeedScore logo" />
            <div className="mode-page-btn-container">
            <button id="coursesModeAddBtn" tabIndex="0"
                    className="mode-page-btn action-dialog action-button" 
                    type="button"onClick={handleClick}>Add Course</button>
            <button id="coursesModeCancelBtn" tabIndex="0"
                    className="mode-page-btn action-dialog cancel-button"
                    type="button" onClick={handleClick}>Cancel</button>
            </div>
        </div> 
      );
    }
}

export default CoursesMode;