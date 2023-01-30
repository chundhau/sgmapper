 /*************************************************************************
 * File: coursesMode.js
 * This file defines the CoursesMode react component, which implements
 * SpeedScore's "Courses" mode
 ************************************************************************/
import { useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CoursesMode() {
    const [showDialog, setShowDialog] = useState(false);
    const [autoMatches, setAutoMatches] = useState([]);
    const dialog = useRef();
    const addBtn = useRef();
    const cancelBtn = useRef();
    const courseSearch = useRef();
    const autocompleteService = new window.google.maps.places.AutocompleteService();

    /*************************************************************************
     * @function handleClick 
     * @Desc 
     * When the user clicks any button, invoke the external JavaScript function
     *  transitionFromDialog (if showDialog is true) or transitionToDialog 
     * (if showDialog is false) to hide/display banner bar and mode tabs. Then
     * toggle the showDialog state variable to force a re-rendering of the 
     * component.
     *************************************************************************/
    function handleClick() {
        if (showDialog)
            window.transitionFromDialog(null);
        else
            window.transitionToDialog(null,"Add Course",function(){});
        setShowDialog(!showDialog);
    }

    /*************************************************************************
     * @function updateAutocompleteMatches 
     * @param matches, an array of matches returned by getPlacePredictions()
     * @Desc status, the status returned by getPlacePredictions()
     * This is the function called by the Google Places API 
     * getPlacePredictions() function after it retrieves the matches based on
     * the latest contents of the autocomplete field. We update the 
     * autoMatches state variable with the latest matches, triggering a 
     * re-rendering of the component.
     *************************************************************************/
    function updateAutocompleteMatches(matches, status) {
        if (status != window.google.maps.places.PlacesServiceStatus.OK || !matches) {
            alert(status);
            setAutoMatches([]);
            return;
        }
        let matchArray = [];
        matches.forEach((match) => {
            matchArray.push({name: match.description, id: match.place_id});
        });
        setAutoMatches(matchArray); //force re-render
    };

    /*************************************************************************
     * @function handleKeyPress 
     * @Desc 
     * When the user presses a key, check if it is the tab, enter, or escape
     * key (the three keys we care about). If so, determine which element had
     * the focus and act accordingly: If tab or shift-tab, then shift the focus
     * to next or previous element. If Enter, then call upon handleClick().
     *************************************************************************/
    async function handleKeyPress(event) {   
        //event.preventDefault();
        if (event.code === "Escape") {
            handleClick();
            return;
        } 
        if (event.code === "Enter" && (document.activeElement === addBtn.current || document.activeElement === cancelBtn.current)) {
            handleClick();
            return;
        }
        if (document.activeElement === dialog.current && event.code === "Tab" && event.shiftKey) {
                cancelBtn.current.focus();
                return;
        }
        if (document.activeElement === dialog.current && event.code === "Tab") {
            addBtn.current.focus();
            return;
        }
        if (document.activeElement === addBtn.current && event.code === "Tab" && event.shiftKey) {
            dialog.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === addBtn.current && event.code === "Tab") {
            cancelBtn.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === cancelBtn.current && event.code === "Tab" &&  event.shiftKey) {
            addBtn.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === cancelBtn.current && event.code === "Tab") {
            dialog.current.focus();
            event.stopPropagation();
            return;
        }
        if (document.activeElement === courseSearch.current) { //Autocomplete!
            addBtn.current.disabled = true;
            autocompleteService.getPlacePredictions({input: courseSearch.current.value + " Golf",
                                                     type: 'establishment'}, updateAutocompleteMatches);
            event.stopPropagation();
            return;
        }
    }

    // useEffect(() => {
    //     if (showDialog) {
    //         const options = {
    //             types: ['establishment']
    //         };
    //         const autocomplete = new window.google.maps.places.Autocomplete(courseSearch.current,options);
    //         courseSearch.current.focus();
    //     }
    // });

    function autocompleteItemClick(i) {
        courseSearch.current.value = i.name;
        setAutoMatches([]);
        addBtn.current.classList.remove("disable-btn");
    }

    /* JSX code to render the component */
    if (!showDialog) {
        return (
            <>
            <h1 className="mode-page-header">Courses</h1>
            <p className="mode-page-content">This page is under construction"</p>
            <img className="mode-page-icon" src="sslogo_lg.png" alt="SpeedScore logo"/>
            <button className="float-btn" onClick={handleClick}>
                <FontAwesomeIcon icon="map-pin" />&nbsp;Add Course</button>
            </>
        );
    } else { //showDialog!
      return (
        <div id="coursesModeDialog" ref={dialog} tabIndex="0"
            className="action-dialog centered" role="dialog" 
            aria-modal="true" aria-labelledby="newCourseHeader" 
            onKeyDown={handleKeyPress}>
            <h1>Add Course</h1>
            <div className="mb-3 centered">
                <label htmlFor="courseSearch" className="form-label">Search for Course:</label><br/>
                <div className="autocomplete-wrapper">
                    <input id="courseSearch" ref={courseSearch} type="text" className="form-control-lg centered autocomplete-input"
                            placeholder="Enter a golf course" aria-describedby="courseDescr"/>
                    <div className="autocomplete-results-wrapper"> 
                        <ul className="autocomplete-results">
                        {autoMatches.map((item) => {
                            return (<li className="autocomplete-item" onClick={()=>autocompleteItemClick(item)}>{item.name}</li>);
                        })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mode-page-btn-container">
            <button id="coursesModeAddBtn" ref ={addBtn} tabIndex="0"
                    className="mode-page-btn action-dialog action-button disable-btn" 
                    type="button" onClick={handleClick} 
                    onKeyDown={handleKeyPress}>Add Course</button>
            <button id="coursesModeCancelBtn" ref={cancelBtn} tabIndex="0"
                    className="mode-page-btn action-dialog cancel-button"
                    type="button" onClick={handleClick}
                    onKeyDown={handleKeyPress}>Cancel</button>
            </div>
        </div> 
      );
    }
}

export default CoursesMode;