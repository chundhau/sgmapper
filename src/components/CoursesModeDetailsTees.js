 /*************************************************************************
 * File: coursesModeDetailsTees.js
 * This file defines the CoursesModeDetailsTees React component, which enables
 * users to view and edit information on the golf course's tee sets.
 ************************************************************************/

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';
import * as Conversions from './../conversions';

export default function CoursesModeDetailsTees({numHoles, tees, updateTees, 
                                                selectedTee, setSelectedTee,
                                                distUnits, setDistUnits}) {

    /*************************************************************************
     * @function handleTeeDataChange
     * @param event, the event object returned by the event handler
     * @Desc 
     * Update tee data to include the data entered.
     *************************************************************************/
        function handleTeeDataChange(event) {
          const updatedTees = {...tees};
          tees[event.target.name] = Number(event.target.value);
          updateTees(updatedTees);
      }

    /*************************************************************************
     * @function computeTotal
     * @param prop, the name of the hole prop over which to compute the total
     *          
     * @Desc 
     * Compute the total sum over all holes
     *************************************************************************/
    function computeTotal(prop) {
      const total = tees[selectedTee].holes.reduce((acc,h) =>
                           acc + (h[prop] === "" ? 0 : h[prop]),0);
      return total;
    }

    // function updatePathFromTable(val) {
    //     const updatedTees = {...tees};
    //     const thisHole = {...updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-1]};
    //     const prevHole = (uploadGeoPathDialog.holeNum > 1 ? 
    //         {...updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-2]} : null);
    //     if (uploadGeoPathDialog.prop === 'golfPath') {
    //         if (thisHole.transitionPath !== "" &&
    //             Object.keys(thisHole.transitionPath).length > 0) { 
    //             //adjust start of golf path to match prev trans path
    //             const transPath = thisHole.transitionPath;
    //             val[0].lat = transPath[transPath.length-1].lat;
    //             val[0].lng = transPath[transPath.length-1].lng;
    //             val[0].elv = transPath[transPath.length-1].elv;
    //         }
    //         thisHole.golfPath = val;
    //         thisHole.teeLoc = {...val[0]};
    //         thisHole.flagLoc = {...val[val.length-1]};
    //         if (uploadGeoPathDialog.holeNum === 1 && thisHole.transitionPath === "") {
    //             thisHole.transitionPath = {}; //Special case: Force empty trans path for Hole #1
    //         }
    //     } else { //uploadGeoPathDialog.prop === 'transitionPath
    //         if (uploadGeoPathDialog.holeNum > 1 &&  prevHole.golfPath !== "") {
    //             //adjust start of trans path to match end of prev golf path
    //             val[0].lat = prevHole.golfPath[prevHole.golfPath.length-1].lat;
    //             val[0].lng = prevHole.golfPath[prevHole.golfPath.length-1].lng;
    //             val[0].elv = prevHole.golfPath[prevHole.golfPath.length-1].elv;
    //         }
    //         thisHole.transitionPath = val;
    //         thisHole.teeLoc = {...val[val.length-1]};
    //     } 
    //     if (thisHole.transitionPath !== "" &&
    //         thisHole.golfPath !== "") { //Compute running distance and time pars!
    //             const womenHoleRunStats = 
    //               getHoleRunningStats(thisHole.transitionPath, thisHole.golfPath,
    //                 thisHole.womensStrokePar, parRunPaceWomen, parShotBoxSecWomen);
    //             const menHoleRunStats = 
    //               getHoleRunningStats(thisHole.transitionPath, thisHole.golfPath,
    //                 thisHole.mensStrokePar, parRunPaceMen, parShotBoxSecMen);
    //             thisHole.runDistance = Math.round(womenHoleRunStats.holeRunDistance);
    //             thisHole.transRunDistance = Math.round(womenHoleRunStats.transPathRunDistance);
    //             thisHole.golfRunDistance = Math.round(womenHoleRunStats.golfPathRunDistance);
    //             thisHole.womensTimePar = Math.round(womenHoleRunStats.holeTimePar);
    //             thisHole.mensTimePar = Math.round(menHoleRunStats.holeTimePar);
    //     }
    //     updatedTees[selectedTee].holes[uploadGeoPathDialog.holeNum-1] = thisHole;
    //     updateCourseVal("tees",updatedTees);
    //     setUploadGeoPathDialog({show: false});
    // }

    // function cancelSaveGeoPath() {
    //     setUploadGeoPathDialog({show: false});
    // }

    return(
            (selectedTee === null) ? null :
              <div>
                <fieldset className="centered">
                <legend>
                  {"Distances and Pars from " + selectedTee + " Tees"}
                  <br/>
                  <i className="font-small">{"(based on " + tees[selectedTee].numHolesGolfDataComplete +
                    " holes with complete golf data and " +
                    tees[selectedTee].numHolesPathDataComplete + 
                    " holes with complete running path data)"}</i>
                </legend>
                <table className="table table-sm table-striped table-hover caption-top">
                  <tbody>
                    <tr>
                      <td>Golf Distance:</td>
                      <td>{distUnits==="Imperial" ? 
                              Conversions.toYards(computeTotal("golfDistance")) + " yards":
                              Conversions.toMeters(computeTotal("golfDistance")) + " meters"}
                      </td>
                    </tr>
                    <tr>
                      <td>Running Distance:</td>
                      <td>{distUnits==="Imperial" ? 
                              Conversions.toMiles(computeTotal("runningDistance")) + " miles" :
                              Conversions.toKilometers(computeTotal("runningDistance")) + " km"}
                      </td>
                    </tr>
                    <tr>
                      <td>Stroke Par:</td>
                      <td>
                        {computeTotal("womensStrokePar") + " (women), " + 
                          computeTotal("mensStrokePar") + " (men)"}
                      </td>
                    </tr>
                    <tr>
                      <td>Time Par:</td>
                      <td>
                        {Conversions.toTimePar(computeTotal("womensTimePar")) + " (women), " + 
                          Conversions.toTimePar(computeTotal("mensStrokePar")) + " (men)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p></p>
                </fieldset>
                <fieldset className="centered">
                  <legend>{"Course Rating/Slope for " + selectedTee + " Tees"}</legend>
                  <div className="mb-3 centered">
                    <label className="form-label" htmlFor="numHoles">Women's Course Rating:
                    <input id="womensRating"
                          className="form-control centered"
                          type="number" 
                          name="womensRating" 
                          value={tees[selectedTee].womensRating} 
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
                        value={tees[selectedTee].womensSlope} 
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
                        value={tees[selectedTee].mensRating} 
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
                        value={tees[selectedTee].mensSlope} 
                        onChange={handleTeeDataChange} 
                        aria-describedby="mensSlope-descr" />
                  </label>
                  <div id="mensRating-descr" className="form-text">
                  {"Men's course rating for the " + selectedTee + " tee, as listed on scorecard"}
                  </div>
                </div>
                </fieldset>  
                <br/>    
              </div>
    );
    

}