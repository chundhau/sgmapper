import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';
import CoursesModeDetailsBasic from './CoursesModeDetailsBasic';
import CoursesModeDetailsSG from './CoursesModeDetailsSG'
import CoursesModeDetailsTees from './CoursesModeDetailsTees';
   
 /*************************************************************************
 * File: coursesModeDetails.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit a course's 'basic' and 'tees' data in 
 * different tabs. 
 ************************************************************************/

export default function CoursesModeDetails({course, updateCourseDetails, closeCourseDetails}) {


    const [updatedCourse, setUpdatedCourse] = useState(course);  
    const sgRatingFactors = ["sgMembership", "sgRoundDiscount", "sgStandingTeeTimes", "sgPlay"];
    
    function updateCourseVal(prop, val) {
        const newUpdatedCourse = {...updatedCourse};
        newUpdatedCourse[prop] = val;
        if (newUpdatedCourse.sgPlay === "sgNotAllowed") {
            newUpdatedCourse.sgMembership = false;
            newUpdatedCourse.sgRoundDiscount = false;
            newUpdatedCourse.sgStandingTeeTimes = false;
        }
        if (sgRatingFactors.includes(prop)) {
            let rating = 0;
            switch (newUpdatedCourse.sgPlay) {
                case "sgAnytime":
                    rating = 3;
                break;
                case "sgRegularTeeTimesOnly":
                    rating = 2;
                break;
                case "sgSpecialArrangementOnly":
                    rating = 1;
                break;
            }
            if (rating > 0) {
                if (newUpdatedCourse.sgStandingTeeTimes)
                    rating++;
                if (newUpdatedCourse.sgMembership || newUpdatedCourse.sgRoundDiscount)
                    rating++;
            }
            newUpdatedCourse.sgFriendlinessRating = rating;
        }
        setUpdatedCourse(newUpdatedCourse);
    }

    function updateTees(tees) {
        updateCourseVal("tees",tees);
    }

    return (
     <section>
       <h1 className="centered">{updatedCourse.shortName}</h1>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" 
                        id="basic-info-tab" data-bs-toggle="tab" data-bs-target="#basic-info" 
                        type="button" role="tab" aria-controls="basic-info" 
                        aria-selected="true">
                    Basic Info
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="speedgolf-tab" 
                        data-bs-toggle="tab" data-bs-target="#speedgolf-info" 
                        type="button" role="tab" aria-controls="speedgolf-info" 
                        aria-selected="false">
                    Speedgolf Info
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="tees-holes-tab" 
                        data-bs-toggle="tab" data-bs-target="#tees-holes-info" 
                        type="button" role="tab" aria-controls="tees-holes-info" 
                        aria-selected="false">
                    Tees & Holes Info
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="reviews-tab" 
                        data-bs-toggle="tab" data-bs-target="#reviews" 
                        type="button" role="tab" aria-controls="reviews" 
                        aria-selected="false">
                    Reviews
                </button>
            </li>
        </ul>
        <div className="tab-content" id="detailsTabContent">
            <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="home-tab">
                <CoursesModeDetailsBasic course={updatedCourse} updateCourseVal={updateCourseVal}/>
            </div>
            <div className="tab-pane fade" id="speedgolf-info" role="tabpanel" aria-labelledby="speedgolf-tab">
                <CoursesModeDetailsSG course={updatedCourse} updateCourseVal={updateCourseVal}/> 
            </div>
            <div className="tab-pane fade" id="tees-holes-info" role="tabpanel" aria-labelledby="tees-holes-tab">
                <CoursesModeDetailsTees course={updatedCourse} updateCourseVal={updateCourseVal}/>
            </div>
            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                <h2 className="centered">Under construction</h2>
            </div>
        </div>
        <div className="mode-page-btn-container">
            <button className="dialog-primary-btn"
                type="button" onClick={()=>updateCourseDetails(updatedCourse)}>
                <FontAwesomeIcon icon="save"/>&nbsp;Save Changes 
            </button>
            <button className="dialog-cancel-btn"
                type="button" onClick={closeCourseDetails}>
                <FontAwesomeIcon icon="xmark"/>&nbsp;Cancel</button>
            </div>
     </section>    
    );
 };