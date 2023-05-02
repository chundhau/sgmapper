import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import DefaultGolfCoursePic from './images/DefaultGolfCoursePic.jpg';
import {useState} from 'react';
import CoursesModeStarRating from './CoursesModeStarRating';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeEditImageModal from './CoursesModeEditImageModal';
   
 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsBasic({course, updateCourseVal}) {

    const [showEditImageModal, setShowEditImageModal] = useState(false);
    
    function handleChange(event) {
        updateCourseVal(event.target.name, event.target.value);
    }

    function updateImageFromModal(newVal) {
        updateCourseVal("imageUrl",newVal);
        setShowEditImageModal(false);
    }

    return (
    <>  
        {showEditImageModal ?
          <CoursesModeEditImageModal 
            title={"Update Course Image"}
            prompt={"Enter new URL for Course Image"}
            imageUrl={course.imageUrl}
            updateImage={updateImageFromModal}
            cancelUpdate={()=>setShowEditImageModal(false)} /> : null
        }
        <div className="img-with-button-container">
            <img className="img-course" 
                 src={course.imageUrl == "Default" ? DefaultGolfCoursePic : course.imageUrl} 
                 alt={course.shortName} />
            <button className="btn-overlaid" aria-label="Edit golf course image" onClick={()=>setShowEditImageModal(true)}>
                <FontAwesomeIcon icon="edit"/>
            </button>
        </div>
        <form className="centered">
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="contactName">Name:
                <input id="name" 
                        className="form-control centered"
                        type="text" 
                        size="50"
                        name="shortName" 
                        value={course.shortName} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="contactName">Address:
                <input id="address" 
                        className="form-control centered"
                        type="text" 
                        size="50"
                        name="address" 
                        value={course.address} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="state">State/Province:
                <input id="state" 
                        className="form-control centered"
                        type="text" 
                        size="30"
                        name="state" 
                        value={course.state} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="country">Country:
                <input id="country" 
                        className="form-control centered"
                        type="text" 
                        size="30"
                        name="country" 
                        value={course.country} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="phone">Phone Number:
                <input id="phone" 
                        className="form-control centered"
                        type="tel" 
                        size="30"
                        name="phoneNumber" 
                        value={course.phoneNumber} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="website">Website:
                <input id="website" 
                        className="form-control centered"
                        type="url" 
                        size="50"
                        name="website" 
                        value={course.website} 
                        onChange={handleChange}/>
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="maps">Google Maps Page:
                <input id="maps" 
                        className="form-control centered"
                        type="text" 
                        size="50"
                        name="mapsUrl" 
                        value={course.mapsUrl} 
                        onChange={handleChange}/>
                </label>
            </div>
            <br></br>
        </form>
     </>    
    );

 };