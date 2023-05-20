import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';
import CoursesModeUploadGeoPathModal from './CoursesModeUploadGeoPathModal';
import CoursesModeDetailsHoleMap from './CoursesModeDetailsHoleMap';
import * as Conversions from '../conversions';

 /*************************************************************************
 * File: coursesModeDetailsBasic.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

export default function CoursesModeDetailsHoleTable({selectedTee, holes, updateHoles, distUnits}) {

    function handleHoleDataChange(e,index,prop, minVal, maxVal) {
        const newHoles = {...holes};
        let newVal = Number(e.target.value);
        if (newVal < minVal)
          newVal = minVal;
        else if (newVal > maxVal)
          newVal = maxVal;
        newHoles[index][prop] = newVal;
        updateHoles(newHoles); 
    }

    return(
        <>
        <fieldset className="centered">
            <legend>{"Hole Info from " + selectedTee + " Tees"}</legend>
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
              <th title="Transition path running distance. Computed automatically based on transition path">Trans Path Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
              <th title="Golf path running distance. Computed automatically based on golf path">Golf Path Dist&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
              <th title="Women's time par. Computed automatically based on hole's running distance and topography">W TPar&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
              <th title="Men's time par. Computed automatically based on hole's running distance and topography">M TPar&nbsp;<FontAwesomeIcon icon="circle-info"/></th>
            </tr>
        </thead>
        <tbody>
            {holes.map((h,i) => { 
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
                                onChange={(e) => handleHoleDataChange(e,i,"womensHandicap",1,holes.length)}/>
                    </td>
                    <td>
                        <input type="number" className="par-width"  value={h.mensStrokePar} 
                                onChange={(e) => handleHoleDataChange(e,i,"mensStrokePar",3,6)}/>
                    </td>
                    <td>
                        <input type="number" className="par-width" value={h.mensHandicap} 
                                onChange={(e) => handleHoleDataChange(e,i,"mensHandicap",1,holes.length)}/></td>
                    <td>
                        <input type="number" disabled className="dist-width" 
                               value={distUnits==="Imperial" ? Conversions.toYards(h.runDistance) :
                                      Conversions.toMeters(h.runDistance)}/>
                    </td>
                    <td>
                        <input type="number" disabled className="dist-width" 
                               value={distUnits==="Imperial" ? Conversions.toYards(h.transRunDistance) :
                                      Conversions.toMeters(h.transRunDistance)}/>
                    </td>
                    <td>
                        <input type="number" disabled className="dist-width" 
                               value={distUnits==="Imperial" ? Conversions.toYards(h.golfRunDistance) :
                                      Conversions.toMeters(h.golfRunDistance)}/>
                    </td>
                    <td>
                        <input type="text" disabled className="time-width" 
                                value={h.womensTimePar === "" ? "" : Conversions.toTimePar(h.womensTimePar)}/>
                    </td>
                    <td>
                        <input type="text" disabled className="time-width" 
                                value={h.mensTimePar === "" ? "" : Conversions.toTimePar(h.mensTimePar)}/>
                    </td>                                    
                </tr>
                ];

            })}
        </tbody>
        </table>
        </fieldset>
        </>
    );
}