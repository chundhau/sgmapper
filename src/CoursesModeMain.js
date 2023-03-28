import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

 /*************************************************************************
 * File: coursesModeMain.js
 * This file defines the CoursesModeMain React component, which implements
 * the main page (courses table) of SpeedScore's "Courses" mode
 ************************************************************************/

export default function CoursesModeMain({openDialog}) {
    return (
    <>
    <h1 className="mode-page-header">Courses</h1>
    <p class="mode-page-content">This page is under construction.</p>
        <img className="mode-page-icon" src="sslogo_lg.png" alt="SpeedScore logo" />
    <button className="float-btn" onClick={openDialog}>
        <FontAwesomeIcon icon="map-pin" />&nbsp;Add Course
    </button>
    </>
    );
}