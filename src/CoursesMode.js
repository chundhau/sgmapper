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
    const coursesDB = JSON.parse(localStorage.getItem("courses"));
    const [courses, setCourses] = useState(coursesDB == null ? {} : coursesDB);
    

    /*************************************************************************
     * @function addCourse
     * @param course, an object containing course info merged the Google 
     * 'getPlacePredictions() and getDetails() functions.  
     * @Desc 
     * Add the object to the courses database in local storage, and update
     * courses set state.
     *************************************************************************/
    function addCourse(course) {
        const newCourses = {...courses,[course.id]: course}; //build new object
        localStorage.setItem("courses",JSON.stringify(newCourses));
        setCourses(newCourses);
    }
    
    
    /*************************************************************************
     * @function openAddCourseDialog 
     * @Desc 
     * When the user opens the "Add Course" dialog, call the 
     * external JavaScript function transitionToDialog hide banner bar 
     * and mode tabs. Finally, set the showDialog state variable to true to
     * re-render the component to display the "Add Course" dialog.
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
         <CoursesModeMain openDialog={openAddCourseDialog} courses={courses} />
    );
}  