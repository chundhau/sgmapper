import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import DefaultGolfCoursePic from './images/DefaultGolfCoursePic.jpg';
import CoursesModeSearchFilter from './CoursesModeSearchFilter';
import {useState} from 'react';

 /*************************************************************************
 * File: coursesModeMain.js
 * This file defines the CoursesModeMain React component, which implements
 * the main page (courses table) of SpeedScore's "Courses" mode
 ************************************************************************/

export default function CoursesModeMain({openDialog,courses}) {  
  const [filteredCourses, setFilteredCourses] = useState(courses);

    function viewCourseDetails(courseId) {
        alert("TODO: View/Edit Details for " + courses[courseId].name);
        return;
    }

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
        setFilteredCourses(coursesList);
      });
    }

    return (
    <>
    <h1 className="mode-page-header">Courses</h1>
    <CoursesModeSearchFilter updateSearchFilterVal={refreshCourses} />
    <div className="table-responsive">
    <table id="coursesTable" className="table caption-top mx-auto w-auto">
          <caption id="roundsTableCaption" aria-live="polite" className="caption-center">
            {Object.keys(courses).length === Object.keys(filteredCourses).length ? 
              "Displaying all " + Object.keys(courses).length + " golf courses in SpeedScore's database" :
              "Displaying " + Object.keys(filteredCourses).length + 
              " golf courses that meet search/filter criteria"}
          </caption>
          <thead>
            <tr scope="col" aria-label="Course picture"></tr>
            <tr scope="col" aria-label="Course info"></tr>
          </thead>
          <tbody>
            {Object.keys(filteredCourses).map((c) => {
                return [
                    <tr key={c} className="d-flex">
                      <td><img src={DefaultGolfCoursePic}
                               alt={"Default golf course image"} 
                               className="img-fluid" />
                      </td>
                      <td tabIndex="0">
                        <strong>{filteredCourses[c].shortName}</strong><br/>
                        {filteredCourses[c].address}<br/><br/>
                            <a href={filteredCourses[c].website} target="_blank" className="btn btn-sm info-btn">
                                <FontAwesomeIcon icon="globe" />
                                &nbsp;Web
                            </a>
                            <a href={filteredCourses[c].mapsUrl} target="_blank" className="btn btn-sm info-btn">
                                <FontAwesomeIcon icon="map"/>
                                &nbsp;Map
                            </a>
                            <a href ={"tel:" + filteredCourses[c].phoneNumber} target="_blank" className="btn btn-sm info-btn">
                            <FontAwesomeIcon icon="phone"/>
                            &nbsp;Call
                            </a>
                            <button type="button" className="btn btn-sm info-btn" onClick={() => viewCourseDetails(c)}>
                            <FontAwesomeIcon icon="eye"/>
                            &nbsp;Details
                            </button>
                      </td>
                    </tr> 
                ]
            }) }
          </tbody>
    </table>    
    </div>
    <button className="float-btn" onClick={openDialog}>
        <FontAwesomeIcon icon="map-pin" />&nbsp;Add Course</button>
    </>
    );
}