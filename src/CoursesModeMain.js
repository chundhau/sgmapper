import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import DefaultGolfCoursePic from './images/DefaultGolfCoursePic.jpg'

 /*************************************************************************
 * File: coursesModeMain.js
 * This file defines the CoursesModeMain React component, which implements
 * the main page (courses table) of SpeedScore's "Courses" mode
 ************************************************************************/

export default function CoursesModeMain({openDialog,courses}) {

    function viewCourseDetails(courseId) {
        alert("TODO: View/Edit Details for " + courses[courseId].name);
        return;
    }

    return (
    <>
    <h1 className="mode-page-header">Courses</h1>
    <div className="table-responsive">
    <table id="coursesTable" className="table caption-top mx-auto w-auto">
          <caption id="roundsTableCaption" aria-live="polite">{"Displaying all " + Object.keys(courses).length + " golf courses in SpeedScore's database"}</caption>
          <thead>
            <tr scope="col" aria-label="Course picture"></tr>
            <tr scope="col" aria-label="Course info"></tr>
          </thead>
          <tbody>
            {Object.keys(courses).map((c) => {
                return [
                    <tr key={c} className="d-flex">
                      <td><img src={DefaultGolfCoursePic}
                               alt={"Default golf course image"} 
                               width="300" height="165" />
                      </td>
                      <td tabIndex="0">
                        <strong>{courses[c].name.substring(0,courses[c].name.search(","))}</strong><br/>
                        {courses[c].address}<br/><br/>
                            <a href={courses[c].website} target="_blank" className="btn btn-sm info-btn"
                               aria-label={`Visit ${courses[c].name.substring(0, courses[c].name.search(","))} website`}>
                                <i className="fa fa-globe"/>
                                &nbsp;Web
                            </a>
                            <a href={courses[c].mapsUrl} target="_blank" className="btn btn-sm info-btn">
                                <i className="fas fa-map"/>
                                &nbsp;Map
                            </a>
                            <a href ={"tel:" + courses[c].phoneNumber} target="_blank" className="btn btn-sm info-btn">
                            <i className="fas fa-phone"/>
                            &nbsp;Call
                            </a>
                            <button type="button" className="btn btn-sm info-btn" onClick={() => viewCourseDetails(c)}>
                            <i className="fas fa-regular fa-eye"></i>
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
