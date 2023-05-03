import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState, useEffect, useRef} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeEditGeoPtModal from './CoursesModeEditGeoPtModal';
import CoursesModeDetailsHoleMap from './CoursesModeDetailsHoleMap';

 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsTees({course, updateCourseVal }) {

    const yardsToMeters = 0.9144;
    const [addTeeDialog, setAddTeeDialog] = useState({show: false});
    const [editGeoPtDialog, setEditGeoPtDialog] = useState({show: false});
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

    function handleHoleDataChange(e,index,prop) {
        const newTees = {...course.tees};
        newTees[selectedTee].holes[index][prop] = e.target.value;
        updateCourseVal("tees",newTees); 
    }

    function handleTeeDataChange(event) {
        const updatedTees = {...course.tees};
        updatedTees[selectedTee][event.target.name] = event.target.value;
        updateCourseVal("tees",updatedTees);
    }

    function toggleUnits(event) {
        setDistUnits(event.target.value);
    }

    function addTee(teeName) {
        const newTee = {
            name: teeName,
            finishLinePath: [],
            golfDistance: 0,
            runningDistance: 0,
            mensStrokePar: 0,
            womensStrokePar: 0,
            womensTimePar: 0,
            mensTimePar: 0,
            mensSlope: 0,
            womensSlope: 0,
            mensRating: 0,
            womensRating: 0,
            holes: Array.from({length: course.numHoles}, (_, i) => ({
                number: i+1,
                name: "",
                golfDistance: 0,
                runningDistance: 0,
                womensHandicap: 0,
                mensHandicap: 0,
                womensStrokePar: 0,
                mensStrokePar: 0,
                teeLoc: {},
                flagLoc: {},
                features: [],
                golfPath: [],
                transitionPath: []
            }))
        }
        const updatedTees = {...course.tees};
        updatedTees[teeName] = newTee;
        updateCourseVal("tees",updatedTees);
        setSelectedTee(teeName);
        setAddTeeDialog({show: false});
    }

    function cancelAddTee() {
        setAddTeeDialog({show: false});
    }

    function openAddTeeDialog() {
        const dialogData = {
            val: "",
            type: "text",
            size: 20,
            emptyAllowed: false,
            disallowed: Object.keys(course.tees)
        };
        setAddTeeDialog({show: true, data: dialogData});
    }

    function openGeoPtDialog(holeNum, prop) {
        const feature = {flagLoc: "center of green",
                         teeLoc: "center of teeing area"};
        const verb = (Object.keys(course.tees[selectedTee].holes[holeNum-1][prop]).length === 0) ? 
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

    function updateGeoData(val) {
        const updatedTees = {...course.tees};
        updatedTees[selectedTee].holes[editGeoPtDialog.holeNum-1][editGeoPtDialog.prop] = val;
        updateCourseVal("tees",updatedTees);
        setEditGeoPtDialog({show: false});
    }

    function cancelUpdateGeoData() {
        setEditGeoPtDialog({show: false});
    }

    return(
        (addTeeDialog.show) ? 
            <CoursesModeEditTextModal title="New Tee"
                                      prompt="Enter new tee name:" 
                                      buttonLabel="Add"
                                      data={addTeeDialog.data}
                                      updateData={addTee}
                                      cancelUpdate={cancelAddTee} /> :
        editGeoPtDialog.show ?
          <CoursesModeEditGeoPtModal title={editGeoPtDialog.title}
                                     prompt={editGeoPtDialog.prompt}
                                     value={editGeoPtDialog.val}
                                     buttonLabel={editGeoPtDialog.buttonLabel}
                                     viewport={course.viewport}
                                     updateData={updateGeoData}
                                     cancelUpdate={cancelUpdateGeoData} /> :

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
                        onChange={handleNumHolesChange} />
                </label>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="tees">Selected Tees:</label><br></br>
                <select className="form-select-sm centered" id="tees" onChange={handleSelectedTeeChange}>
                    {Object.keys(course.tees).length === 0 ? 
                      <option value="No tees defined">Choose '+' to add a tee</option> :
                    Object.keys(course.tees).map((t) => {
                      return [
                        <option key={t} value={t}>{t}</option>
                      ]
                    })}
                </select>&nbsp;
                <button role="button" className="btn-theme" aria-label="Add New Tee"
                        onClick={openAddTeeDialog}>               
                  <FontAwesomeIcon icon="plus"/>
                </button>
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
                    <input id="golfDistance" 
                          className="form-control centered"
                          type="number" 
                          name="golfDistance" 
                          value={distUnits == "yards" ? course.tees[selectedTee].golfDistance : 
                                 course.tees[selectedTee].golfDistance * yardsToMeters} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="golfDistance-descr" />
                    </label>
                    <div id="golfDistance-descr" className="form-text">
                      {"Total golf distance for the " + selectedTee + " tees , as listed on scorecard"}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Running Distance:
                    <input id="runningDistance" disabled
                          className="form-control centered"
                          type="number" 
                          name="runningDistance" 
                          value={distUnits == "yards" ? course.tees[selectedTee].runningDistance : 
                                 course.tees[selectedTee].runningDistance * yardsToMeters} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="runningDistance-descr" />
                    </label>
                    <div id="runningDistance-descr" className="form-text">
                      {"Total running distance for the " + selectedTee + " tees; autocalculated based on running distances entered for individual holes"}
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
                                    <td><input type="number" className="dist-width" value={h.golfDistance} onChange={(e) => handleHoleDataChange(e,i,"golfDistance")}/></td>
                                    <td><input type="number" className="par-width" value={h.womensStrokePar} onChange={(e) => handleHoleDataChange(e,i,"womensStrokePar")}/></td>
                                    <td><input type="number" className="par-width" value={h.womensHandicap} onChange={(e) => handleHoleDataChange(e,i,"womensHandicap")}/></td>
                                    <td><input type="number" className="par-width" value={h.mensStrokePar} onChange={(e) => handleHoleDataChange(e,i,"mensStrokePar")}/></td>
                                    <td><input type="number" className="par-width" value={h.mensHandicap} onChange={(e) => handleHoleDataChange(e,i,"mensHandicap")}/></td>
                                    <td><input type="number" disabled className="dist-width" value={h.runningDistance} onChange={(e) => handleHoleDataChange(e,i,"runningDistance")}/></td>
                                    <td><input type="number" disabled className="time-width" value={h.womensTimePar} onChange={(e) => handleHoleDataChange(e,i,"womensTimePar")}/></td>
                                    <td><input type="number" disabled className="time-width" value={h.womensTimePar} onChange={(e) => handleHoleDataChange(e,i,"mensTimePar")}/></td>                                    
                                    <td><button className={"btn " +  (Object.keys(h.teeLoc).length !== 0 ? "btn-green" : "btn-red")} 
                                                onClick={() => openGeoPtDialog(i+1,"teeLoc")} >
                                            <FontAwesomeIcon icon={(Object.keys(h.teeLoc).length !== 0 ? "check" : "edit")}/>
                                        </button>
                                    </td>
                                    <td><FontAwesomeIcon icon="edit"/></td>
                                    <td><FontAwesomeIcon icon="edit"/></td>
                                    <td><FontAwesomeIcon icon="edit"/></td>
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
