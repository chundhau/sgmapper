import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeUploadGeoPathModal from './CoursesModeUploadGeoPathModal';
import CoursesModeDetailsMap from './CoursesModeDetailsMap';
import {parRunPaceWomen, parRunPaceMen, 
        parShotBoxSecWomen, parShotBoxSecMen, 
        getHoleRunningStats} from './speedgolfCalculations';

 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsTees({course, updateCourseVal }) {

    const yardsToMeters = 0.9144;
    const [addEditTeeDialog, setAddEditTeeDialog] = useState({show: false});
    const [uploadGeoPathDialog, setUploadGeoPathDialog] = useState({show: false});
    const [selectedTee, setSelectedTee] = 
      useState(course.tees === "" ? "No tees defined": Object.keys(course.tees)[0]);
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
        const updatedTees = (course.tees === "" ? {} : {...course.tees});
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
            disallowed: (course.tees === "" ? [] : Object.keys(course.tees))
        };
        setAddEditTeeDialog({show: true, data: dialogData, prevTee: (editing ? selectedTee : "")});
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

    function updatePathFromMap(holeNum,pathType,pathCoords) {
      const updatedTees = {...course.tees};
      const thisHole = {...updatedTees[selectedTee].holes[holeNum-1]};
      thisHole[pathType] = pathCoords;
      updatedTees[selectedTee].holes[holeNum-1] = thisHole;
      updateCourseVal("tees",updatedTees);
    } 

    function updatePathFromTable(val) {
        const updatedTees = {...course.tees};
        const thisHole = {...updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-1]};
        const prevHole = (uploadGeoPathDialog.holeNum > 1 ? 
            {...updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-2]} : null);
        if (uploadGeoPathDialog.prop === 'golfPath') {
            if (thisHole.transitionPath !== "" &&
                Object.keys(thisHole.transitionPath).length > 0) { 
                //adjust start of golf path to match prev trans path
                const transPath = thisHole.transitionPath;
                val[0].lat = transPath[transPath.length-1].lat;
                val[0].lng = transPath[transPath.length-1].lng;
                val[0].elv = transPath[transPath.length-1].elv;
            }
            thisHole.golfPath = val;
            thisHole.teeLoc = {...val[0]};
            thisHole.flagLoc = {...val[val.length-1]};
            if (uploadGeoPathDialog.holeNum === 1 && thisHole.transitionPath === "") {
                thisHole.transitionPath = {}; //Special case: Force empty trans path for Hole #1
            }
        } else { //uploadGeoPathDialog.prop === 'transitionPath
            if (uploadGeoPathDialog.holeNum > 1 &&  prevHole.golfPath !== "") {
                //adjust start of trans path to match end of prev golf path
                val[0].lat = prevHole.golfPath[prevHole.golfPath.length-1].lat;
                val[0].lng = prevHole.golfPath[prevHole.golfPath.length-1].lng;
                val[0].elv = prevHole.golfPath[prevHole.golfPath.length-1].elv;
            }
            thisHole.transitionPath = val;
            thisHole.teeLoc = {...val[val.length-1]};
        } 
        if (thisHole.transitionPath !== "" &&
            thisHole.golfPath !== "") { //Compute running distance and time pars!
                const womenHoleRunStats = 
                  getHoleRunningStats(thisHole.transitionPath, thisHole.golfPath,
                    thisHole.womensStrokePar, parRunPaceWomen, parShotBoxSecWomen);
                const menHoleRunStats = 
                  getHoleRunningStats(thisHole.transitionPath, thisHole.golfPath,
                    thisHole.mensStrokePar, parRunPaceMen, parShotBoxSecMen);
                thisHole.runDistance = Math.round(womenHoleRunStats.holeRunDistance);
                thisHole.transRunDistance = Math.round(womenHoleRunStats.transPathRunDistance);
                thisHole.golfRunDistance = Math.round(womenHoleRunStats.golfPathRunDistance);
                thisHole.womensTimePar = Math.round(womenHoleRunStats.holeTimePar);
                thisHole.mensTimePar = Math.round(menHoleRunStats.holeTimePar);
        }
        updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-1] = thisHole;
        updateCourseVal("tees",updatedTees);
        setUploadGeoPathDialog({show: false});
    }

    function cancelSaveGeoPath() {
        setUploadGeoPathDialog({show: false});
    }

    function toTimePar(sec) {
        const intSec = parseInt(sec);
        return (Math.floor(intSec/60)) + ":" + (intSec % 60 < 10 ? "0" + intSec % 60 : intSec % 60);
    }

    function toYards(ft) {
      if (ft === "")
        return "";
      return Math.round(parseInt(ft)/3);
    }

    function toMeters(ft) {
      if (ft === "")
        return "";
      return Math.round(parseInt(ft)/3.28084);
    }

    function toMiles(ft) {
      if (ft === "")
        return "";
      return (parseInt(ft)/5280).toFixed(2);

    }

    return(
        addEditTeeDialog.show ? 
            <CoursesModeEditTextModal 
              title={addEditTeeDialog.prevTee === "" ? "Add Tee" : "Update Tee Name"} 
              prompt={addEditTeeDialog.prevTee === "" ? "Enter a new tee name:" : "Enter updated name for tee:"} 
              buttonLabel={addEditTeeDialog.prevTee === "" ? "Add" : "Edit"}
              data={addEditTeeDialog.data}
              updateData={addEditTee}
              cancelUpdate={cancelAddEditTee} /> :
        uploadGeoPathDialog.show ?
          <CoursesModeUploadGeoPathModal 
            title={uploadGeoPathDialog.title}
            prompt={uploadGeoPathDialog.prompt}
            buttonLabel={uploadGeoPathDialog.buttonLabel}
            updateData={updatePathFromTable}
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
                        disabled={course.tees === "" ? false: true}/>
                </label>
                <div id="numHoles-descr" className="form-text">
                      Number of holes on the course. Once a set of tees has been added to the course, you may <i>not</i> change this value.
                </div>
            </div>
            <div className="mb-3 centered">
                <label className="form-label" htmlFor="tees">Selected Tees:</label><br></br>
                <select className="form-select-sm centered" value={selectedTee} id="tees" onChange={handleSelectedTeeChange}>
                    {course.tees === "" ? 
                      <option value="No tees defined">Choose '+' to add a tee</option> :
                    Object.keys(course.tees).map((t) => {
                      return [
                        <option key={t} value={t}>{t}</option>
                      ]
                    })}
                </select>&nbsp;
                <button className="btn-theme" aria-label="Add New Tee"
                        onClick={()=>openAddEditTeeDialog(false)} title="Add a set of tees">               
                  <FontAwesomeIcon icon="plus"/>
                </button>&nbsp;
                {course.tees === "" ? null :
                  <button className="btn-theme" aria-label="Edit Name of Tee"
                        onClick={()=>openAddEditTeeDialog(true)} title="Edit name of selected set of tees">               
                    <FontAwesomeIcon icon="edit"/>
                  </button>
                }
            </div>
            <p></p>
            {selectedTee === "No tees defined" ? null :
                <div>
                  <fieldset className="centered">
                  <legend>{"Distances and Pars from the " + selectedTee + " Tees"}</legend>
                    <label>Distance Unit</label>
                    <div className="form-check" role="radiogroup">
                        <input className="centered" 
                               type="radio" name="distYards" id="distYards" 
                               onChange={toggleUnits}
                               value="yards" checked={distUnits==="yards"} />
                        <label className="form-check-label centered" htmlFor="distYards">
                          &nbsp;Yards
                        </label>&nbsp;
                        <input className="centered" 
                               type="radio" name="distMeters" id="distMeters" 
                               onChange={toggleUnits}
                               value="meters" checked={distUnits==="meters"}/>
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
                          value={distUnits === "yards" ? course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.golfDistance === "" ? 0 : h.golfDistance),0) : 
                                   course.tees[selectedTee].holes.reduce((acc,h)=>
                                    acc + (h.golfDistance === "" ? 0 : (h.golfDistance * yardsToMeters)),0)}  
                          aria-describedby="golfDistance-descr" />
                    </label>
                    <div id="golfDistance-descr" className="form-text">
                      {"Total golf distance from the " + selectedTee + " tees. Calculated automatically based on golf distances entered for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="womensGolfPar">Women's Golf Par:
                    <input id="womensGolfPar" disabled
                          className="form-control centered"
                          type="number" 
                          name="womensGolfPar" 
                          value={course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.womensStrokePar === "" ? 0 : Number(h.womensStrokePar)),0)}  
                          aria-describedby="womensGolfPar-descr" />
                    </label>
                    <div id="womensGolfPar-descr" className="form-text">
                      {"Total women's golf par from the " + selectedTee + " tees. Calculated automatically based on golf pars entered for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="mensGolfPar">Men's Golf Par:
                    <input id="mensGolfPar" disabled
                          className="form-control centered"
                          type="number" 
                          name="mensGolfPar" 
                          value={course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.mensStrokePar === "" ? 0 : Number(h.mensStrokePar)),0)}  
                          aria-describedby="mensGolfPar-descr" />
                    </label>
                    <div id="womensGolfPar-descr" className="form-text">
                      {"Total women's golf par from the " + selectedTee + " tees. Calculated automatically based on golf pars entered for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Running Distance:
                    <input id="runningDistance" disabled
                          className="form-control centered"
                          type="number" 
                          name="runningDistance" 
                          value={distUnits === "yards" ? toMiles(course.tees[selectedTee].holes.reduce((acc,h)=>
                          acc + (h.runDistance === "" ? 0 : h.runDistance),0)) : 
                           toMeters(course.tees[selectedTee].holes.reduce((acc,h)=>
                            acc + (h.runDistance === "" ? 0 : (h.runDistance)),0))}   
                          aria-describedby="runningDistance-descr" />
                    </label>
                    <div id="runningDistance-descr" className="form-text">
                      {"Total running distance from the " + selectedTee + " tees. Calculated automatically based on running distances entered for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="womensTimePar">Women's Time Par:
                    <input id="womensTimePar" disabled
                          className="form-control centered"
                          type="text" 
                          name="womensTimePar" 
                          value={toTimePar(course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.womensTimePar === "" ? 0 : h.womensTimePar),0))}  
                          aria-describedby="womensTimePar-descr" />
                    </label>
                    <div id="womensTimePar-descr" className="form-text">
                      {"Total women's time par from the " + selectedTee + " tees. Calculated automatically based on time pars computed for individual holes."}
                    </div>
                  </div>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="mensTimePar">Men's Time Par:
                    <input id="mensTimePar" disabled
                          className="form-control centered"
                          type="text" 
                          name="mensTimePar" 
                          value={toTimePar(course.tees[selectedTee].holes.reduce((acc,h)=>
                                   acc + (h.mensTimePar === "" ? 0 : h.mensTimePar),0))}  
                          aria-describedby="mensTimePar-descr" />
                    </label>
                    <div id="womensTimePar-descr" className="form-text">
                      {"Total men's time par from the " + selectedTee + " tees. Calculated automatically based on time pars computed for individual holes."}
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
                    <label className="form-label" htmlFor="numHoles">Women's Course Slope:
                    <input id="womensSlope" 
                          className="form-control centered"
                          type="number" 
                          name="womensSlope" 
                          value={course.tees[selectedTee].womensSlope} 
                          onChange={handleTeeDataChange} 
                          aria-describedby="womensSlope-descr" />
                    </label>
                    <div id="womensSlope-descr" className="form-text">
                    {"Women's course slope for the " + selectedTee + " tee, as listed on scorecard"}
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
                    <label className="form-label" htmlFor="numHoles">Men's Course Slope:
                    <input id="mensSlope" 
                          className="form-control centered"
                          type="number" 
                          name="mensSlope" 
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
                    <legend>{"Hole Data for the " + selectedTee + " Tees"}</legend>
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
                          <th title="Vector of geopoints (latitude, longitude, and elevation) tracing ideal running path from center of previous green to tee">Trans Path&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Transition path running distance. Computed automatically based on transition path">Trans Path Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Vector of geopoints (latitude, longitude, and elevation) tracing ideal running path from tee to center of green">Golf Path&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
                          <th title="Golf path running distance. Computed automatically based on golf path">Golf Path Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
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
                                        <input type="number" disabled className="dist-width" value={toYards(h.runDistance)}/>
                                    </td>
                                    <td>
                                        <input type="text" disabled className="time-width" 
                                               value={h.womensTimePar === "" ? "" : toTimePar(h.womensTimePar)}/>
                                    </td>
                                    <td>
                                        <input type="text" disabled className="time-width" 
                                               value={h.mensTimePar === "" ? "" : toTimePar(h.mensTimePar)}/>
                                    </td>                                    
                                    <td>
                                        <button className="btn" onClick={() => openGeoPathDialog(i+1,"transitionPath")}>
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <FontAwesomeIcon icon={(h.transitionPath !== "" ? "check" : "xmark")}
                                                             className={h.transitionPath !== "" ? "btn-green" : "btn-red"}/>
                                        </button>
                                    </td>
                                    <td>
                                        <input type="number" disabled className="dist-width" value={toYards(h.transRunDistance)}/>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => openGeoPathDialog(i+1,"golfPath")}>
                                            <FontAwesomeIcon icon="edit" />&nbsp;
                                            <FontAwesomeIcon icon={(h.golfPath !== "" ? "check" : "xmark")}
                                                             className={h.golfPath !== "" ? "btn-green" : "btn-red"}/>
                                        </button>
                                    </td>
                                    <td>
                                        <input type="number" disabled className="dist-width" value={toYards(h.golfRunDistance)}/>
                                    </td>
                                    <td><FontAwesomeIcon icon="edit"/></td>
                                </tr>
                                ];

                            })}
                        </tbody>
                        </table>
                        </div>
                        <div className="tab-pane fade" id="hole-map" role="tabpanel" aria-labelledby="map-tab">
                            <CoursesModeDetailsMap holes={course.tees[selectedTee].holes} mapCenter={course.geoLocation} updatePath={updatePathFromMap} />
                        </div>
                    </div>
                  </fieldset>
                </div>
            }
            <br></br>
        </>
    );
    

}
