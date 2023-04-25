import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CoursesModeSearchFilter from './CoursesModeSearchFilter';
import CoursesModeTable from './CoursesModeTable';
import CoursesModeDetails from './CoursesModeDetails';
import {useState} from 'react';

 /*************************************************************************
 * File: coursesModeMain.js
 * This file defines the CoursesModeMain React component, which implements
 * the main page (courses table) of SpeedScore's "Courses" mode
 ************************************************************************/

export default function CoursesModeMain({courses,updateCourse, openAddCourseDialog}) {  
  const [displayedCourses, setDisplayedCourses] = useState(courses);
  const [showCourseDetails, setShowCourseDetails] = useState(null);

    function refreshCourses(searchString, searchScope) {
      const coursesList = {};
      Object.keys(courses).forEach((c) => {
        if (searchScope==="Name" && courses[c].shortName.toUpperCase().includes(searchString.toUpperCase())) {
          coursesList[c] = courses[c];
        } else if (searchScope==="State" && courses[c].state.toUpperCase().includes(searchString.toUpperCase())) {
          coursesList[c] = courses[c]; 
        } else if (searchScope==="Country" && courses[c].country.toUpperCase().includes(searchString.toUpperCase())) {
          coursesList[c] = courses[c];
        }
        setDisplayedCourses(coursesList);
      });
    }

    function updateAndCloseCourseDetailsDialog(c) {
      updateCourse(c);
      const updatedCourses = {...courses};
      updatedCourses[showCourseDetails.id] = c;
      setDisplayedCourses(updatedCourses);
      window.transitionFromDialog(null);
      setShowCourseDetails(null);
    }

    function openCourseDetailsDialog(c) {
      window.transitionToDialog(null,"View/Edit Course Details",function(){});
      setShowCourseDetails(c);
    }

    function closeCourseDetailsDialog() {
      window.transitionFromDialog(null);
      setShowCourseDetails(null);
    }

    return(
    (showCourseDetails === null) ? 
     <>
     <h1 className="mode-page-header">Courses</h1>
     <CoursesModeSearchFilter updateSearchFilterVal={refreshCourses} />
     <CoursesModeTable courses={displayedCourses} 
                       numCourses={Object.keys(displayedCourses).length}
                       showCourseDetails={openCourseDetailsDialog} />
      <button className="float-btn" onClick={openAddCourseDialog}>
        <FontAwesomeIcon icon="map-pin" />&nbsp;Add Course
      </button>
    </> :
     <CoursesModeDetails course={showCourseDetails}
                         updateCourseDetails={updateAndCloseCourseDetailsDialog}
                         closeCourseDetails={closeCourseDetailsDialog}/>

    );
  }