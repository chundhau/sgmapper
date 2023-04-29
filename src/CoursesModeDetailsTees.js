import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState, useEffect, useRef} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';

 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsTees({numHoles, tees, updateTees }) {

    const [addTeeDialog, setAddTeeDialog] = useState({show: false});

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
            holes: Array.from({length: numHoles}, (_, i) => ({
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
        const updatedTees = {...tees};
        updatedTees[teeName] = newTee;
        updateTees(updatedTees);
        setAddTeeDialog({show: false});
    }

    function cancelAddTee() {

    }

    function openAddTeeDialog() {
        const dialogData = {
            val: "",
            type: "text",
            size: 20,
            emptyAllowed: false,
            disAllowed: Object(tees).keys
        };
        setAddTeeDialog({show: true, data: dialogData});
    }

    return(
        (addTeeDialog.show) ? 
            <CoursesModeEditTextModal title="New Tee"
                                      prompt="Enter new tee name:" 
                                      data={addTeeDialog.data}
                                      updateData={addTee}
                                      cancelUpdate={cancelAddTee} /> :
        <div className="centered">
        <label className="bold" htmlFor="tees">Tees:&nbsp;</label>
            <div className="float-center">
                <select id="tees">
                    {Object.keys(tees).length === 0 ? 
                      <option value="No tees defined">Choose '+' to add a tee</option> :
                    Object.keys(tees).map((t) => {
                      return [
                        <option key={t} value={t}>{t}</option>
                      ]
                    })}
                </select>&nbsp;
                <button className="btn-theme" aria-label="Add New Tee"
                        onClick={openAddTeeDialog}>               
                  <FontAwesomeIcon icon="plus"/></button>&nbsp;
                <button className="btn-theme"><FontAwesomeIcon icon="map" /></button>
            </div>
        </div>
    );
    

}
