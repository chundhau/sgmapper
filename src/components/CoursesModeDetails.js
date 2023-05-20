import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeDetailsBasic from './CoursesModeDetailsBasic';
import CoursesModeDetailsSG from './CoursesModeDetailsSG'
import CoursesModeDetailsTees from './CoursesModeDetailsTees';
import CoursesModeDetailsHoleTable from './CoursesModeDetailsHoleTable';
import CoursesModeDetailsHoleMap from './CoursesModeDetailsHoleMap';
import * as SGCalcs from '../speedgolfCalculations';
   
 /*************************************************************************
 * File: coursesModeDetails.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit a course's 'basic' and 'tees' data in 
 * different tabs. 
 ************************************************************************/

export default function CoursesModeDetails({course, updateCourseDetails, closeCourseDetails}) {

    const [addEditTeeDialog, setAddEditTeeDialog] = useState({show: false});
    const [updatedCourse, setUpdatedCourse] = useState(course);
    const [selectedTee, setSelectedTee] = 
      useState(course.tees === "" ? null: Object.keys(course.tees)[0]);
    const [distUnits, setDistUnits] = useState("Imperial");

    const sgRatingFactors = ["sgMembership", "sgRoundDiscount", "sgStandingTeeTimes", "sgPlay"];


    /*************************************************************************
     * @function handleSelectedTeeChange
     * @param event, the event object returned by the event handler
     * @Desc 
     * Update the selected tee to the tee chosen.
     *************************************************************************/
    function handleSelectedTeeChange(event) {
        setSelectedTee(event.target.value);
    }

    /*************************************************************************
     * @function toggleUnits
     * @param event, the event object returned by the event handler
     * @Desc 
     * Set the distance units when the user clicks on "Imperial" or "Metric"
     * radio button.
     *************************************************************************/
    function toggleUnits(event) {
        setDistUnits(event.target.value);
    }

    /*************************************************************************
     * @function addEditTee
     * @param teeName, the name of the tee being added or edited
     * @Desc 
     * If the user is changing the name of the current tee, update that name.
     * Otherwise, add a new tee with name teeName and set it as current tee.
     *************************************************************************/
    function addEditTee(teeName) {
        const updatedTees = (updatedCourse.tees === "" ? {} : {...updatedCourse.tees});
        if (addEditTeeDialog.prevTee !== "") {
            updatedTees[teeName] = updatedCourse.tees[addEditTeeDialog.prevTee];
            delete updatedTees[addEditTeeDialog.prevTee];
        } else {
            const newTee = {
              name: teeName,
              finishLinePath: "",
              golfDistance: "",
              runningDistance: "",
              mensStrokePar: "",
              womensStrokePar: "",
              womensTimePar: "",
              mensTimePar: "",
              mensSlope: "",
              womensSlope: "",
              mensRating: "",
              womensRating: "",
              holes: Array.from({length: updatedCourse.numHoles}, (_, i) => ({
                number: i+1,
                name: "",
                golfDistance: "",
                runDistance: "",
                transRunDistance: "",
                golfRunDistance: "",
                womensHandicap: "",
                mensHandicap: "",
                womensStrokePar: "",
                mensStrokePar: "",
                womensTimePar: "",
                mensTimePar: "",
                teeLoc: "",
                flagLoc: "",
                features: "",
                golfPath: "",
                transitionPath: ""
            })),
            numHolesGolfDataComplete: 0,
            numHolesPathDataComplete: 0,
            numHolesGreenDataComplete: 0
          };
          updatedTees[teeName] = newTee;
        }
        updateTees(updatedTees);
        setSelectedTee(teeName);
        setAddEditTeeDialog({show: false});
    }

    /*************************************************************************
     * @function cancelAddEditTee
     * @Desc 
     * Close the Add/Edit tee dialog box without making changes.
     *************************************************************************/
    function cancelAddEditTee() {
        setAddEditTeeDialog({show: false});
    }

    /*************************************************************************
     * @function openAddEditTeeDialog
     * @param editing, a boolean indicating whether the user is editing the
     * name of the current tee
     * @Desc 
     * Open a dialog box to allow the user to either edit the current tee's
     * name or add a new tee.
     *************************************************************************/
    function openAddEditTeeDialog(editing) {
        const dialogData = {
            val: (editing ? selectedTee : ""),
            type: "text",
            size: 20,
            emptyAllowed: false,
            disallowed: (updatedCourse.tees === "" ? [] : Object.keys(updatedCourse.tees))
        };
        setAddEditTeeDialog({show: true, data: dialogData, prevTee: (editing ? selectedTee : "")});
    }
    
    /*************************************************************************
     * @function updateCourseVal
     * @param prop, the property whose value is to be updated
     * @param val, the new value for prop
     * @Desc 
     * Create a new updatedCourse object with the updated property value,
     * forcing a state change and re-render.
     *************************************************************************/
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
                default:
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

    /*************************************************************************
     * @function updateTees
     * @param newTees, a tee object
     * @Desc 
     * Create a new updatedCourse object whose tees prop is assigned to tees
     *************************************************************************/
    function updateTees(newTees) {
        updateCourseVal("tees",newTees);
    }

    /*************************************************************************
     * @function updateHoles
     * @param newHoles, a holes array
     * @Desc 
     * Create a new updatedCourse object whose tees[selectedTee] prop 
     * is assigned to holes
     *************************************************************************/
    function updateHoles(newHoles) {
        const newTees = {...course.tees};
        newTees[selectedTee].holes = newHoles;
        updateCourseVal("tees",newTees); 
      }

    /*************************************************************************
     * @function updatePath
     * @param holeNum, the number of the hole whose path is to be updated
     * @param pathType, "transitionPath" or "golfPath"
     * @param pathCoords, an array of coord objects {lat, lng, elv} defining
     *        the path
     * @Desc 
     * update the hole's path with the new path coords, and update the 
     * corresponding hole's running distances and time pars.
     *************************************************************************/
      function updatePath(holeNum,pathType,pathCoords) {
        const updatedTees = {...updatedCourse.tees};
        const thisHole = {...updatedTees[selectedTee].holes[holeNum-1]};
        thisHole[pathType] = pathCoords;
        if (pathType === 'golfPath' && holeNum === 1 && 
            thisHole.transitionPath === "") { //Special case: Add empty trans path
              thisHole.transitionPath = [];
        }
        if (thisHole.transitionPath !== "" &&  thisHole.golfPath !== "") { 
          const runStats = SGCalcs.getHoleRunningStats(thisHole.transitionPath, thisHole.golfPath,
               thisHole.womensStrokePar, thisHole.mensStrokePar);
          thisHole.runDistance = runStats.runDistance;
          thisHole.transRunDistance = runStats.transRunDistance;
          thisHole.golfRunDistance = runStats.golfRunDistance;
          thisHole.womensTimePar = runStats.womensTimePar;
          thisHole.mensTimePar = runStats.mensTimePar;
        }
        updatedTees[selectedTee].holes[holeNum-1] = thisHole;
        updateTees(updatedTees);
      } 
  
    return (
      addEditTeeDialog.show ? 
        <CoursesModeEditTextModal 
          title={addEditTeeDialog.prevTee === "" ? "Add Tee" : "Update Tee Name"} 
          prompt={addEditTeeDialog.prevTee === "" ? "Enter a new tee name:" : "Enter updated name for tee:"} 
          buttonLabel={addEditTeeDialog.prevTee === "" ? "Add" : "Edit"}
          data={addEditTeeDialog.data}
          updateData={addEditTee}
          cancelUpdate={cancelAddEditTee} /> :
     <section>
       <h1 className="centered">{updatedCourse.shortName}</h1>
       <div className="flex-container-centered centered">
        <div>
            <label className="form-label" htmlFor="tees">Selected Tees:</label><br></br>
            <select className="form-select-sm centered" 
                    value={selectedTee === null ? "": selectedTee} 
                    id="tees" onChange={handleSelectedTeeChange}>
                {selectedTee === null ? 
                    <option value="No tees defined">Choose '+' to add a tee</option> :
                Object.keys(updatedCourse.tees).map((t) => {
                    return [
                    <option key={t} value={t}>{t}</option>
                    ]
                })}
            </select>&nbsp;
            <button className="btn-theme" aria-label="Add New Tee"
                    onClick={()=>openAddEditTeeDialog(false)} title="Add a set of tees">               
                <FontAwesomeIcon icon="plus"/>
            </button>&nbsp;
            {updatedCourse.tees === "" ? null :
                <button className="btn-theme" aria-label="Edit Name of Tee"
                    onClick={()=>openAddEditTeeDialog(true)} title="Edit name of selected set of tees">               
                <FontAwesomeIcon icon="edit"/>
                </button>
            }
        </div>
        <div>
            <label>Distance Units:</label>
                <div className="form-check" role="radiogroup">
                    <input className="centered" 
                            type="radio" name="Imperial" id="Imperial" 
                            onChange={toggleUnits}
                            value="Imperial" checked={distUnits==="Imperial"} />
                    <label className="form-check-label centered" htmlFor="Imperial">
                      &nbsp;Imperial
                    </label>&nbsp;&nbsp;&nbsp;
                    <input className="centered" 
                            type="radio" name="Metric" id="Metric" 
                            onChange={toggleUnits}
                            value="Metric" checked={distUnits==="Metric"}/>
                    <label className="form-check-label centered" htmlFor="Metric">
                      &nbsp;Metric
                    </label>
                </div>
            </div>
        </div>
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
                <button className="nav-link" id="tees-tab" 
                        data-bs-toggle="tab" data-bs-target="#tees-info" 
                        type="button" role="tab" aria-controls="tees-info" 
                        aria-selected="false">
                    Tees Info
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="holes-table-tab" 
                        data-bs-toggle="tab" data-bs-target="#holes-info" 
                        type="button" role="tab" aria-controls="holes-info" 
                        disabled={selectedTee === "No tees defined"}
                        aria-selected="false">
                    Holes Info
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="holes-map-tab" 
                        data-bs-toggle="tab" data-bs-target="#path-map" 
                        type="button" role="tab" aria-controls="path-map" 
                        disabled={selectedTee === null}
                        aria-selected="false">
                    Running Info
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
            <div className="tab-pane fade" id="tees-info" role="tabpanel" aria-labelledby="tees-tab">
                <CoursesModeDetailsTees numHoles={updatedCourse.numHoles} tees={updatedCourse.tees} 
                                        updateTees={updateTees} selectedTee={selectedTee}
                                        setSelectedTee={setSelectedTee} distUnits={distUnits}
                                        setDistUnits={setDistUnits} />
            </div>
            <div className="tab-pane fade" id="holes-info" role="tabpanel" aria-labelledby="holes-table-tab">
              {selectedTee === null ? null : 
                <CoursesModeDetailsHoleTable selectedTee={selectedTee} holes={updatedCourse.tees[selectedTee].holes} 
                                             updateHoles={updateHoles} disUnits={distUnits}/>}
            </div>
            <div className="tab-pane fade" id="path-map" role="tabpanel" aria-labelledby="holes-map-tab">
              {selectedTee === null ? null:
                <CoursesModeDetailsHoleMap holes={updatedCourse.tees[selectedTee].holes} 
                                           mapCenter={updatedCourse.geoLocation}
                                           updatePath={updatePath} />}
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