import CourseMapper from './images/CourseMapper.jpg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState, useEffect, useRef} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeEditGeoPtModal from './CoursesModeEditGeoPtModal';
import CoursesModeUploadGeoPathModal from './CoursesModeUploadGeoPathModal';
import CoursesModeDetailsHoleMap from './CoursesModeDetailsHoleMap';

 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsTees({course, updateCourseVal }) {

    const yardsToMeters = 0.9144;
    const [addEditTeeDialog, setAddEditTeeDialog] = useState({show: false});
    const [editGeoPtDialog, setEditGeoPtDialog] = useState({show: false});
    const [uploadGeoPathDialog, setUploadGeoPathDialog] = useState({show: false});
    const [selectedTee, setSelectedTee] = 
      useState(Object.keys(course.tees) == 0 ? null: Object.keys(course.tees)[0]);
    const [distUnits, setDistUnits] = useState("yards");

    function handleNumHolesChange(event) {
        let val = (Number(event.target.value) > 22 ? 22 : 
                    (Number(event.target.value) < 1 ? 1 : Number(event.target.value)));
        updateCourseVal(event.target.name, val);
    }

    function handleSelectedTeeChange(event) {
        setSelectedTee(event.target.value);
    }

    function handleHoleDataChange(e,index,prop, minVal, maxVal) {
        const newTees = {...course.tees};
        let newVal = Number(e.target.value);
        if (newVal < minVal)
          newVal = minVal;
        else if (newVal > maxVal)
          newVal = maxVal;
        newTees[selectedTee].holes[index][prop] = newVal;
        updateCourseVal("tees",newTees); 
    }

    function handleTeeDataChange(event) {
        const updatedTees = {...course.tees};
        updatedTees[selectedTee][event.target.name] = Number(event.target.value);
        updateCourseVal("tees",updatedTees);
    }

    function toggleUnits(event) {
        setDistUnits(event.target.value);
    }

    function addEditTee(teeName) {
        const updatedTees = (course.tees == "" ? {} : {...course.tees});
        if (addEditTeeDialog.prevTee !== "") {
            updatedTees[teeName] = course.tees[addEditTeeDialog.prevTee];
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
              holes: Array.from({length: course.numHoles}, (_, i) => ({
                number: i+1,
                name: "",
                golfDistance: "",
                runningDistance: "",
                womensHandicap: "",
                mensHandicap: "",
                womensStrokePar: "",
                mensStrokePar: "",
                teeLoc: "",
                flagLoc: "",
                features: "",
                golfPath: "",
                transitionPath: ""
            }))
          };
          updatedTees[teeName] = newTee;
        }
        updateCourseVal("tees",updatedTees);
        setSelectedTee(teeName);
        setAddEditTeeDialog({show: false});
    }

    function cancelAddEditTee() {
        setAddEditTeeDialog({show: false});
    }

    function openAddEditTeeDialog(editing) {
        const dialogData = {
            val: (editing ? selectedTee : ""),
            type: "text",
            size: 20,
            emptyAllowed: false,
            disallowed: (course.tees == "" ? [] : Object.keys(course.tees))
        };
        setAddEditTeeDialog({show: true, data: dialogData, prevTee: (editing ? selectedTee : "")});
    }

    function openGeoPtDialog(holeNum, prop) {
        const feature = {flagLoc: "center of green",
                         teeLoc: "center of teeing area"};
        const verb = (course.tees[selectedTee].holes[holeNum-1][prop] === "") ? 
                        "Add" : "Edit";
        const dialogData = {
            show: true,
            title: verb + " location of " + feature[prop] + " on Hole " + holeNum,
            prompt: "Enter location of " + feature[prop] + " on Hole " + holeNum,
            val: course.tees[selectedTee].holes[holeNum-1][prop],
            buttonLabel: verb,
            holeNum: holeNum,
            prop: prop
        }
        setEditGeoPtDialog(dialogData);
    }

    function openGeoPathDialog(holeNum, prop) {
        const briefFeature = {transitionPath: "Transition Path",
        golfPath: "Golf Path"};
        const feature = {transitionPath: "path from center of previous green to center of teeing area",
                         golfPath: "path from center of teeing area to center of green"};
              const dialogData = {
            show: true,
            title: "Upload " + briefFeature[prop],
            prompt: "Upload " + feature[prop],
            buttonLabel: "Save",
            holeNum: holeNum,
            prop: prop
        }
        setUploadGeoPathDialog(dialogData);
    }

    function updateGeoData(val) {
        const updatedTees = {...course.tees};
        updatedTees[selectedTee].holes[editGeoPtDialog.holeNum-1][editGeoPtDialog.prop] = val;
        updateCourseVal("tees",updatedTees);
        setEditGeoPtDialog({show: false});
    }

    function saveGeoPath(val) {
        const updatedTees = {...course.tees};
        updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-1][uploadGeoPathDialog.prop] = val;
        updateCourseVal("tees",updatedTees);
        setUploadGeoPathDialog({show: false});
    }

    function cancelUpdateGeoData() {
        setEditGeoPtDialog({show: false});
    }

    function cancelSaveGeoPath() {
        setUploadGeoPathDialog({show: false});
    }

    return(
        (addEditTeeDialog.show) ? 
            <CoursesModeEditTextModal 
              title={addEditTeeDialog.prevTee == "" ? "Add Tee" : "Update Tee Name"} 
              prompt={addEditTeeDialog.prevTee == "" ? "Enter a new tee name:" : "Enter updated name for tee:"} 
              buttonLabel={addEditTeeDialog.prevTee == "" ? "Add" : "Edit"}
              data={addEditTeeDialog.data}
              updateData={addEditTee}
              cancelUpdate={cancelAddEditTee} /> :
        editGeoPtDialog.show ?
          <CoursesModeEditGeoPtModal 
            title={editGeoPtDialog.title}
            prompt={editGeoPtDialog.prompt}
            value={editGeoPtDialog.val}
            buttonLabel={editGeoPtDialog.buttonLabel}
            viewport={course.viewport}
            updateData={updateGeoData}
            cancelUpdate={cancelUpdateGeoData} /> :
        uploadGeoPathDialog.show ?
          <CoursesModeUploadGeoPathModal 
            title={uploadGeoPathDialog.title}
            prompt={uploadGeoPathDialog.prompt}
            buttonLabel={uploadGeoPathDialog.buttonLabel}
            updateData={saveGeoPath}
            cancelUpdate={cancelSaveGeoPath} /> :
        <>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="numHoles">Number of Holes:
                <input id="numHoles" 
                        className="form-control centered"
                        type="number" 
                        min="1"
                        max="22"
                        name="numHoles" 
                        value={course.numHoles} 
                        onChange={handleNumHolesChange} 
                        aria-describedby="numHoles-descr"
                        disabled={course.tees == "" ? false: true}/>
                </label>
                <div id="numHoles-descr" className="form-text">
                      Number of holes on the course. Once a set of tees has been added to the course, you may <i>not</i> change this value.
                </div>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="tees">Selected Tees:</label><br></br>
                <select className="form-select-sm centered" id="tees" onChange={handleSelectedTeeChange}>
                    {course.tees === "" ? 
                      <option value="No tees defined">Choose '+' to add a tee</option> :
                    Object.keys(course.tees).map((t) => {
                      return [
                        <option key={t} value={t}>{t}</option>
                      ]
                    })}
                </select>&nbsp;
                <button role="button" className="btn-theme" aria-label="Add New Tee"
                        onClick={()=>openAddEditTeeDialog(false)} title="Add a set of tees">               
                  <FontAwesomeIcon icon="plus"/>
                </button>&nbsp;
                {course.tees == "" ? null :
                  <button role="button" className="btn-theme" aria-label="Edit Name of Tee"
                        onClick={()=>openAddEditTeeDialog(true)} title="Edit name of selected set of tees">               
                    <FontAwesomeIcon icon="edit"/>
                  </button>
                }
            </div>
            <p></p>
            {selectedTee == null ? null :
                <div>
                  <fieldset className="centered">
                  <legend>{"Distances for " + selectedTee + " Tees"}</legend>
                    <label>Distance Unit</label>
                    <div className="form-check" role="radiogroup">
                        <input className="centered" 
                               type="radio" name="distYards" id="distYards" 
                               onChange={toggleUnits}
                               value="yards" checked={distUnits=="yards"} />
                        <label className="form-check-label centered" htmlFor="distYards">
                          &nbsp;Yards
                        </label>&nbsp;
                        <input className="centered" 
                               type="radio" name="distMeters" id="distMeters" 
                               onChange={toggleUnits}
                               value="meters" checked={distUnits=="meters"}/>
                        <label className="form-check-label centered" htmlFor="distMeters">
                          &nbsp;Meters
                        </label>
                    </div>
                  <p></p>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Golf Distance:
                    <input id="golfDistance" disabled
                          className="form-control centered"
                          type="number" 
                          name="golfDistance" 
                          value={distUnits == "yards" ? course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.golfDistance == "" ? 0 : Number(h.golfDistance)),0) : 
                                   course.tees[selectedTee].holes.reduce((acc,h)=>
                                    acc + (h.golfDistance == "" ? 0 : (Number(h.golfDistance) * yardsToMeters)),0)}  
                          aria-describedby="golfDistance-descr" />
                    </label>
                    <div id="golfDistance-descr" className="form-text">
                      {"Total golf distance for the " + selectedTee + " tees. Calculated automatically based on golf distances entered for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Running Distance:
                    <input id="runningDistance" disabled
                          className="form-control centered"
                          type="number" 
                          name="runningDistance" 
                          value={distUnits == "yards" ? course.tees[selectedTee].holes.reduce((acc,h)=>
                          {return acc + (h.runningDistance == "" ? 0 : h.runningDistance)}) : 
                           course.tees[selectedTee].holes.reduce((acc,h)=>
                            {return acc + (h.runningDistance == "" ? 0 : (h.runningDistance * yardsToMeters))})}   
                          aria-describedby="runningDistance-descr" />
                    </label>
                    <div id="runningDistance-descr" className="form-text">
                      {"Total running distance for the " + selectedTee + " tees. Calculated automatically based on running distances entered for individual holes."}
                    </div>
                  </div>
                  </fieldset>
                  <fieldset className="centered">
                    <legend>{"Course Rating/Slope for " + selectedTee + " Tees"}</legend>
                    <div className="mb-3 centered">
                      <label className="form-label" htmlFor="numHoles">Women's Course Rating:
                      <input id="womensRating"
                            className="form-control centered"
                            type="number" 
                            name="womensRating" 
                            value={course.tees[selectedTee].womensRating} 
                            onChange={handleTeeDataChange} 
                            aria-describedby="womensRating-descr" />
                      </label>
                    <div id="womensRating-descr" className="form-text">
                      {"Women's course rating for the " + selectedTee + " tee, as listed on scorecard"}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Men's Course Rating:
                    <input id="mensRating" 
                          className="form-control centered"
                          type="number" 
                          name="mensRating" 
                          value={course.tees[selectedTee].mensRating} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="mensRating-descr" />
                    </label>
                    <div id="mensRating-descr" className="form-text">
                    {"Men's course rating for the " + selectedTee + " tee, as listed on scorecard"}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Women's Course Slope:
                    <input id="womensRating" 
                          className="form-control centered"
                          type="number" 
                          name="womensRating" 
                          value={course.tees[selectedTee].womensSlope} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="womensSlope-descr" />
                    </label>
                    <div id="womensSlope-descr" className="form-text">
                    {"Women's course slope for the " + selectedTee + " tee, as listed on scorecard"}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Men's Course Slope:
                    <input id="mensSlope" 
                          className="form-control centered"
                          type="number" 
                          name="mensRating" 
                          value={course.tees[selectedTee].mensSlope} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="mensSlope-descr" />
                    </label>
                    <div id="mensRating-descr" className="form-text">
                    {"Men's course rating for the " + selectedTee + " tee, as listed on scorecard"}
                    </div>
                  </div>
                  </fieldset>
                  <fieldset className="centered">
                    <legend>{"Hole-by-Hole Data for " + selectedTee + " Tees"}</legend>
                    <ul className="nav nav-tabs" id="table-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" 
                                    id="basic-info-tab" data-bs-toggle="tab" data-bs-target="#hole-table" 
                                    type="button" role="tab" aria-controls="hole-table" 
                                    aria-selected="true">
                            Table
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="map-tab" 
                                    data-bs-toggle="tab" data-bs-target="#hole-map" 
                                    type="button" role="tab" aria-controls="hole-map" 
                                    aria-selected="false">
                            Map
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="holeTabContent">
                        <div className="tab-pane fade show active" id="hole-table" role="tabpanel" aria-labelledby="table-tab">
                        <table className="table table-sm table-striped table-hover caption-top">
                        <caption>Table of Hole Info</caption>
                        <thead>
                          <tr>
                          <th>Hole #</th>
                          <th title="Hole distance, as shown on scorecard">Golf Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Women's stroke par, as shown on scorecard">W Par&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Women's hole handicap, as shown on scorecard">W Hcp&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Men's stroke par, as shown on scorecard">M Par&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Men's hole handicap, as shown on scorecard">M Hcp&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Running distance. Computed automatically based on transition path and golf path">Run Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Women's time par. Computed automatically based on hole's running distance and topography">W TPar&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Women's time par. Computed automatically based on hole's running distance and topography">M TPar&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Latitude, longitude, and elevation of tee">Tee Loc&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Latitude, longitude, and elevation of center of green">Flag Loc&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Vector of geopoints (latitude, longitude, and elevation) tracing ideal running path from center of previous green to tee">Trans Path&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Vector of geopoints (latitude, longitude, and elevation) tracing ideal running path from tee to center of green">Golf Path&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Vector of polygons demarcating hole features such as the tee box, bunkers, water hazards, and the green">Features&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          </tr>
                        </thead>
                        <tbody>
                            {course.tees[selectedTee].holes.map((h,i) => { 
                                return [
                                <tr key={h.number}>
                                    <td>{h.number}</td>
                                    <td>
                                        <input type="number" className="dist-width"  value={h.golfDistance}                                                    
                                               onChange={(e) => handleHoleDataChange(e,i,"golfDistance",1,900)}/>
                                    </td>
                                    <td>
                                        <input type="number" className="par-width"  value={h.womensStrokePar} 
                                               onChange={(e) => handleHoleDataChange(e,i,"womensStrokePar",3,6)}/>
                                    </td>
                                    <td>
                                        <input type="number" className="par-width" value={h.womensHandicap} 
                                               onChange={(e) => handleHoleDataChange(e,i,"womensHandicap",1,course.numHoles)}/>
                                    </td>
                                    <td>
                                        <input type="number" className="par-width"  value={h.mensStrokePar} 
                                               onChange={(e) => handleHoleDataChange(e,i,"mensStrokePar",3,6)}/>
                                    </td>
                                    <td>
                                        <input type="number" className="par-width" value={h.mensHandicap} 
                                               onChange={(e) => handleHoleDataChange(e,i,"mensHandicap",1,course.numHoles)}/></td>
                                    <td>
                                        <input type="number" disabled className="dist-width" value={h.runningDistance}/>
                                    </td>
                                    <td>
                                        <input type="number" disabled className="time-width" value={h.womensTimePar}/>
                                    </td>
                                    <td>
                                        <input type="number" disabled className="time-width" value={h.womensTimePar}/>
                                    </td>                                    
                                    <td><button className="btn" 
                                                onClick={() => openGeoPtDialog(i+1,"teeLoc")} >
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <span className={(h.teeLoc !== "" ? "btn-green" : "btn-red")}>
                                            <FontAwesomeIcon icon={(h.teeLoc !== "" ? "check" : "xmark")}/>
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => openGeoPtDialog(i+1,"flagLoc")}>
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <span className={(h.flagLoc !== "" ? "btn-green" : "btn-red")}>
                                            <FontAwesomeIcon icon={(h.flagLoc !== "" ? "check" : "xmark")}/>
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => openGeoPathDialog(i+1,"transitionPath")}>
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <span className={(h.transitionPath !== "" ? "btn-green" : "btn-red")}>
                                            <FontAwesomeIcon icon={(h.transitionPath !== "" ? "check" : "xmark")}/>
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => openGeoPathDialog(i+1,"golfPath")}>
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <span className={(h.golfPath !== "" ? "btn-green" : "btn-red")}>
                                            <FontAwesomeIcon icon={(h.golfPath !== "" ? "check" : "xmark")}/>
                                            </span>
                                        </button>
                                    </td>
                                    <td><FontAwesomeIcon icon="edit"/></td>
                                </tr>
                                ];

                            })}
                        </tbody>
                        </table>
                        </div>
                        <div className="tab-pane fade" id="hole-map" role="tabpanel" aria-labelledby="map-tab">
                            <CoursesModeDetailsHoleMap course={course} updateCourseVal={updateCourseVal}/>
                        </div>
                    </div>
                  </fieldset>
                </div>
            }
            <br></br>
        </>
    );
    

}
