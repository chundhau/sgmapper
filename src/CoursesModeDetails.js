import DefaultGolfCoursePic from './images/DefaultGolfCoursePic.jpg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState, useRef} from 'react';
 
 /*************************************************************************
 * File: coursesModeDetails.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit course details.
 ************************************************************************/

export default function CoursesModeDetails({course, updateCourseDetails, closeCourseDetails}) {

    const [courseImage, setCourseImage] = useState(Object.hasOwn(course,'imageUrl') ? course.imageUrl : DefaultGolfCoursePic );
    const imageModal = useRef();
    const newImageUrl = useRef();
    const updateImage = useRef();
    const previewImage = useRef();
    const updatedCourse = {...course}; //For saving changes
    

    function updateCourseImage() {
        updatedCourse.imageUrl = courseImage;
        updateCourseDetails(updatedCourse);
        const bsModal = window.bootstrap.Modal.getInstance(imageModal.current);
        bsModal.hide();
    }

    function cancelUpdateCourseImage() { //exit without saving
        setCourseImage(Object.hasOwn(updatedCourse,'imageUrl') ? updatedCourse.imageUrl : DefaultGolfCoursePic);
        const bsModal = window.bootstrap.Modal.getInstance(imageModal.current);
        bsModal.hide();
    }


    function handleImageInput(event) {
        setCourseImage(event.target.value);
    }

    function invalidImage() {
        updateImage.current.classList.add("disable-btn");
        previewImage.current.setAttribute("alt","Invalid image");
    }

    function validImage() {
        updateImage.current.classList.remove("disable-btn");
    }

    return (
        <>
        <div ref={imageModal} id="imageModal" data-bs-backdrop="static" className="modal fade" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Course Image</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body centered">
                        <h6>Image Preview</h6>
                        <img ref={previewImage} src={courseImage} alt="Preview" width="200" 
                             onError={invalidImage} onLoad={validImage} />
                        <br></br><br></br>
                        <span>Enter URL of Course Image:</span><br></br>
                        <input ref={newImageUrl} type="url" size="30" 
                               value={courseImage} onChange={handleImageInput}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" 
                                onClick={cancelUpdateCourseImage}>
                            Cancel
                        </button>
                        <button ref={updateImage} type="button" className="btn btn-primary" 
                                onClick={() => updateCourseImage(newImageUrl.current.value)}>
                            Update Image
                        </button>
                    </div>
                    </div>
                </div>
        </div>
        <div className="image-with-button-container">
            <img className="image-course" src={courseImage} alt="Golf Course" />
            <button className="button-overlaid" data-bs-toggle="modal"
                     data-bs-target="#imageModal">
                <FontAwesomeIcon icon="camera"/>
            </button>
        </div>
        <div className="centered">
        <h3>{course.shortName}</h3>
        <address>{course.address}</address>
        <label className="form-label" htmlFor="courseImageUrl">More details go here</label>
        </div>
        <div className="close-dialog-btn">
            <button className="mode-page-btn action-dialog cancel-button"
                    onClick={closeCourseDetails}><FontAwesomeIcon icon="xmark"/>&nbsp;Close</button>
        </div>
     </>
        
    );

 };