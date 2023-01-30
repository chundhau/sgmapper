 /*************************************************************************
 * File: coursesMode.js
 * This file defines the CoursesMode react component, which implements
 * SpeedScore's "Courses" mode
 ************************************************************************/
import { useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CoursesMode() {
    const [showDialog, setShowDialog] = useState(false);
    const [autocomplete, setAutocomplete] = useState({boxContents: "", matches: [], validCourseChosen: false});
    const dialog = useRef();
    const addBtn = useRef();
    const cancelBtn = useRef();
    const courseSearch = useRef();
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    let  autocompleteSessionToken = null; //null == no current session
    let newSearchValue = "";

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
        if (showDialog) {
            setAutocomplete({boxContents: "", matches: []});
            window.transitionFromDialog(null);
        } else {
            window.transitionToDialog(null,"Add Course",function(){});
        }
        setShowDialog(!showDialog);
    }

    /*************************************************************************
     * @function handleAutocompleteItemClick 
     * @Desc 
     * When the user clicks on an item in the autocomplete dropdown, we 
     * place that item in the autocomplete box and set the list of automatches to
     * empty (signifying the end of an autocomplete session).
     * This forces a re-render.  
     *************************************************************************/
    function handleAutocompleteItemClick(i) {
        autocompleteSessionToken = null; //Session is over
        setAutocomplete({boxContents: i.name, matches: [], validCourseChosen: true}); //Force re-render    
    }

    /*************************************************************************
     * @function updateAutocompleteMatches 
     * @param matches, an array of matches returned by getPlacePredictions()
     * @Desc status, the status returned by getPlacePredictions()
     * This is the function called by the Google Places API 
     * getPlacePredictions() function after it retrieves the matches based on
     * the latest contents of the autocomplete field. We update the 
     * autocompleteMatches state variable with the latest matches, triggering a 
     * re-rendering of the component.
     *************************************************************************/
    function updateAutocomplete(matches, status) {
        if (status != window.google.maps.places.PlacesServiceStatus.OK || !matches) {
            setAutocomplete({boxContents: newSearchValue, matches: [], validCourseChosen: false});
            return;
        }
        let matchArray = [];
        matches.forEach((match) => {
            const items = match.description.split(",");
            if ((items[0].includes("Golf Course") || items[0].includes("Golf Club") ||
                 items[0].includes("Golf Links")) && !items[0].includes("Disc Golf"))
            {
              matchArray.push({name: match.description, id: match.place_id});
            }
        });
        setAutocomplete({boxContents: newSearchValue, matches: matchArray, validCourseChosen: false}); //force re-render
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
    }

    function handleAutocompleteChange(event) {
        newSearchValue = event.target.value;
        if (newSearchValue == "") {
            setAutocomplete({boxContents: "", matches: [], validCourseChosen: false});
            return;
        }
        if (autocompleteSessionToken === null) { //start new session
            autocompleteSessionToken = new window.google.maps.places.AutocompleteSessionToken();
        }
        autocompleteService.getPlacePredictions({
            input: newSearchValue + " Golf Course",
            offset: 3,
            types: ['establishment'],
            sessionToken: autocompleteSessionToken}, 
            updateAutocomplete); 
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
                    <input id="courseSearch" 
                          ref={courseSearch} type="text" 
                          className="form-control-lg centered autocomplete-input"
                          placeholder="Enter a golf course" 
                          aria-describedby="courseSearch"
                          value={autocomplete.boxContents}
                          onChange={handleAutocompleteChange} />
                    <div className="autocomplete-results-wrapper"> 
                        <ul className="autocomplete-results">
                        {autocomplete.matches.map((item) => {
                            return (
                              <li key={item.id} 
                                  className="autocomplete-item" 
                                  onClick={()=>handleAutocompleteItemClick(item)}>
                                  {item.name}
                               </li>);
                        })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mode-page-btn-container">
            <button id="coursesModeAddBtn" ref ={addBtn} tabIndex="0"
                    className={autocomplete.validCourseChosen ? 
                            "mode-page-btn action-dialog action-button" : 
                            "mode-page-btn action-dialog action-button disable-btn"}
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