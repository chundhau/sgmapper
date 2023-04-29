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

    const [showEditTextModal, setShowEditTextModal] = useState({show: false});
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    
       
    function openTextEditModal(propertyDisplayName, propertyName, propertyData) {
        setShowEditTextModal({show: true, 
                          propDisplayName: propertyDisplayName,
                          propName: propertyName,
                          propData: propertyData});
    }

    function updateDataFromModal(newVal) {
        updateCourseVal(showEditTextModal.propName,newVal);
        setShowEditTextModal({show: false});
    }

    function updateImageFromModal(newVal) {
        updateCourseVal("imageUrl",newVal);
        setShowEditImageModal(false);
    }

    return (
    <>  {showEditTextModal.show ? 
          <CoursesModeEditTextModal 
            title={"Update " + showEditTextModal.propDisplayName} 
            prompt={"Enter new " + showEditTextModal.propDisplayName + ":"}
            data={showEditTextModal.propData}
            updateData = {updateDataFromModal} 
            cancelUpdate={()=>setShowEditTextModal({show:false})} /> : null
        }
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
        <div className="centered">
            <label className="bold" htmlFor="name">Name:</label>
            <div className="float-center">
                <div>{course.shortName}</div>&nbsp;
                <button className="btn-theme" aria-label="Edit course name"
                        onClick={()=>openTextEditModal("Course Name","shortName",
                                     {val: course.shortName,
                                      type: "text",
                                      size: "30",
                                      emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="addr">Address:</label>
            <div id="addr" className="float-center">
                <div>{course.address}</div>&nbsp;
                <button className="btn-theme" aria-label="Edit course address" 
                         onClick={()=>openTextEditModal("Course Address","address",
                         {val: course.address,
                          type: "text",
                          size: "50",
                          emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="state">State/Province:</label>
            <div id="state" className="float-center">
                <div>{course.state}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Course State/Province","state",
                        {val: course.state,
                         type: "text",
                         size: "20",
                         emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="country">Country:</label>
            <div id="country" className="float-center">
                <div>{course.country}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Course Country","country",
                                     {val: course.country,
                                      type: "text",
                                      size: "20",
                                      emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="phone">Phone Number:</label>
            <div id="phone" className="float-center">
                <div>{course.phoneNumber}</div>&nbsp;
                <button className="btn-theme"
                         onClick={()=>openTextEditModal("Course Phone Number","phoneNumber",
                                     {val: course.phoneNumber,
                                      type: "tel",
                                      size: "15",
                                      emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgContact">Website:</label>
            <div id="website" className="float-center">
                <div><a href={course.website} target="_blank">{course.website}</a></div>&nbsp;
                <button className="btn-theme"
                         onClick={()=>openTextEditModal("Course Web Site","website",
                                     {val: course.website,
                                      type: "url",
                                      size: "50",
                                      emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgContact">Google Maps Page:</label>
            <div id="website" className="float-center">
                <div><a href={course.mapsUrl} target="_blank">{course.mapsUrl}</a></div>&nbsp;
                <button className="btn-theme"
                         onClick={()=>openTextEditModal("Course Google Maps Page","mapsUrl",
                                     {val: course.mapsUrl,
                                      type: "url",
                                      size: "50",
                                      emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgContact">Number of Holes:</label>
                        <div id="state" className="float-center">
                <div>{course.numHoles}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Number of Holes","numHoles",
                        {val: course.numHoles,
                         type: "number",
                         min: "1",
                         max: "22",
                         emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgContact">Speedgolf Contact Name:</label>
                        <div id="state" className="float-center">
                <div>{course.sgContactName}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Speedgolf Contact Name","sgContactName",
                        {val: course.sgContactName,
                         type: "text",
                         size: "30",
                         emptyAllowed: true})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgContactEmail">Speedgolf Contact Email:</label>
                        <div id="state" className="float-center">
                <div>{course.sgContactEmail}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Speedgolf Contact Email","sgContactEmail",
                                     {val: course.sgContactEmail,
                                      type: "email",
                                      size: "30",
                                      emptyAllowed: true})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgFriendliness">Speedgolf Friendliness Rating:</label>
            <div id="sgFriendliness" className="float-center">
                <CoursesModeStarRating maxStars={5} numStars={course.sgFriendlinessRating} />  
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Speedgolf Friendliness Rating","sgFriendlinessRating",
                        {val: course.sgFriendlinessRating,
                         type: "number",
                         min: "0",
                         max: "5",
                         emptyAllowed: false})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>
            <label className="bold" htmlFor="sgNotes">Speedgolf Notes:</label>
                        <div id="state" className="float-center txt-wrap">
                <div className="notes-div">{course.sgNotes}</div>&nbsp;
                <button className="btn-theme"
                        onClick={()=>openTextEditModal("Speedgolf Notes","sgNotes",
                        {val: course.sgNotes,
                         type: "textarea",
                         size: "40",
                         lines: "5",
                         emptyAllowed: true})}>
                    <FontAwesomeIcon icon="edit"/>
                </button>
            </div>         
        </div>
     </>    
    );

 };