 /*************************************************************************
 * File: coursesMode.js
 * This file defines the CoursesMode react component, which implements
 * SpeedScore's "Courses" mode
 ************************************************************************/
import {useState} from 'react';
import CoursesModeAdd from './CoursesModeAdd.js';
import CoursesModeMain from './CoursesModeMain.js';


export default function CoursesMode() {
    const [showDialog, setShowDialog] = useState(false);

    function addCourse(couurse) {
        //TO DO: Place course in database
    }

    /*************************************************************************
     * @function openAddCourseDialog 
     * @Desc 
     * When the user opens the "Add Course" dialog, invoke the 
     * external JavaScript function transitionFromDialog redisplay banner bar 
     * and mode tabs. Then toggle the showDialog state variable to force a 
     * re-rendering of the component.
     *************************************************************************/
    function openAddCourseDialog() {
        window.transitionToDialog(null,"Add Course",function(){});
        setShowDialog(true);
    }

    /*************************************************************************
     * @function closeAddCourseDialog 
     * @Desc 
     * When the user closes the "Add Course" dialog, add the selected course
     * (if any) to SpeedScore's database and then call the 
     * external JavaScript function transitionFromDialog redisplay banner bar 
     * and mode tabs. Finally, set the showDialog state variable to false
     * re-render the component to display the "main" page.
     *************************************************************************/
    function closeAddCourseDialog(course) {
        if (course != null) {
            addCourse(course);
        } 
        window.transitionFromDialog(null);
        setShowDialog(false);
    }

    /* JSX code to render the component */
    return(
      (showDialog) ?
         <CoursesModeAdd closeDialog={closeAddCourseDialog} /> :
         <CoursesModeMain openDialog={openAddCourseDialog} />
    );
}  