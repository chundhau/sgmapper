 /*************************************************************************
 * File: coursesModeDetailsHoleMap.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

import React, { useEffect, useState, useRef } from 'react';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import FontawesomeMarker from 'mapbox-gl-fontawesome-markers'
import * as SGCalcs from '../speedgolfCalculations'
import * as Conversions from '../conversions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { feature } from '@turf/turf';
mapboxgl.accessToken = 'pk.eyJ1IjoidWRkeWFuIiwiYSI6ImNsZzY3MG1tZjAzbnczY3FjN2h0amp0MjUifQ.h7bnjg6dqjrJeFqNPvJyuA';


export default function CoursesModeDetailsHoleMap({holes, mapCenter, updatePath, distUnits})  {
  
  /* Enumerated type for top-level state of "Hole Map" */
  const holeMapTool = {
    SELECT: 0,
    DEFINE_PATH: 1,
    DEFINE_POLYGON: 2
  };
  Object.freeze(holeMapTool);

   /* Static object mapping hole features to line colors */
   const lineColor = {
    golfPath: '#FF0000',
    transitionPath: '#FFFF00',
    teebox: '#0000FF',
    green: '#90EE90',
  };
  Object.freeze(lineColor);

  /* Static object mapping hole features to text labels displayed on map */
  const featureLabel = {
    golfPath: 'Golf',
    transitionPath: 'Transition',
    teebox: 'Tee',
    green: 'Green',
  };
  Object.freeze(featureLabel);

  /* For now, we're using editPath to capture the state of the feature currently being edited. 
     Ultimately, this will be done in 'status' state variable. */
  const [editPath, setEditPath] = useState(null);

  /* profileHole keeps track hole currently displayed in profile view. Wil become part of 'status. */
  const [profileHole, setProfileHole] = useState(0);
  
  /* zoom, lng, and lat keep track of current zoom and focus of map */
  const [zoom, setZoom] = useState(15);
  const [lng, setLng] = useState(mapCenter.lng);
  const [lat, setLat] = useState(mapCenter.lat);

  /* status: Keeps track of app mode, the current selection, hole currently displayed in profiel view,
     length of current path, and autoAdvance mode */
  const [status, setStatus] = useState({
    mode: holeMapTool.SELECT, 
    selection: null, 
    profileHole: 0,
    pathLength: null,
    autoAdvance: false});

  const mapContainer = useRef(null);
  const map = useRef(null);

  //Layer Id of path currently selected.
  const selectedPathId = useRef(null); 

  //Will store refs to the tee and flag markers for each hole
  const teeFlagMarkers = useRef(null);
 

  //const distanceContainer = useRef(null);

  function handleEditPath(holeNum, path) { 
      setEditPath({holeNum: holeNum,
                   pathType: path
      });
  }

  //All of the Mapbox functionality is defined in useEffect() because it has to 
  //happen after render, and because it has to be updated after changes to
  //status state variable.
  useEffect(() => {
    
    //Instantiate a mapbox Map object and attach to mapContainer DOM element
     map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    teeFlagMarkers.current = Array.from({length: holes.length}, (h) => {return {tee: null, flag: null}});

  /**********************************************************************
   * GLOBAL MAP EVENT HANDLERS
   **********************************************************************/

  /*************************************************************************
   * @function on load handler
   * @Desc 
   * When map is first loaded, add the mapbox 'terrain-rgb' source 
   * (satellite imagery with street and place labels), and set the terrain
   * to the source with an exaggeration of 1 (to give slight 3D appearance)
   *************************************************************************/
  map.current.on('load', () => {
    map.current.addSource('mapbox-golf', {
     'type': 'raster-dem',
     'url': 'mapbox://mapbox.terrain-rgb',
     'tileSize': 256,
     'maxzoom': 15
     });
     map.current.setTerrain({ 'source': 'mapbox-golf', 'exaggeration': 1 });
     addAllFeaturesToMap();
   });

   //Not sure why, but this resize appears necessary to allow the user to
   //scale the map to consume entire window after opening tab.
   //There is still a bug: We need window to open at full size out of the gate
   map.current.on('render', () => {
     map.current.resize();
   });

   /*************************************************************************
    * @function on move handler
    * @Desc 
    * Update state vars when pan and zoom change, to ensure current pan
    * and zoom are maintained.
    *************************************************************************/
   map.current.on('move', () => {
     setLng(map.current.getCenter().lng.toFixed(4));
     setLat(map.current.getCenter().lat.toFixed(4));
     setZoom(map.current.getZoom().toFixed(2));
   });


 /**********************************************************************
  * END OF GLOBAL MAP EVENT HANDLERS
  **********************************************************************/

  /**********************************************************************
   * PATH DRAWING, SELECTION, DELETION, & EVENT HANDLING
   **********************************************************************/

  const pathIds = []; //array of layer ids of all paths added to the map
  
  //Popup for displaying distance info when path is hovered over
  const pathPopup = new mapboxgl.Popup({closeButton: false}); 
  
  //Mapbox draw object to allow users to create paths on map
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    defaultMode: editPath === null ? 'simple_select' : 'draw_line_string'
  });
  map.current.addControl(draw);

  //Array of coordinates of path currently being defined
  const pathCoords = []; 

  //Whether a path is currently being defined
  let isDrawingStopped = (editPath === null ? true : false);


  /*************************************************************************
   * @function updateLine
   * @Desc 
   * As the user draws a path, update the stats on the path in the 
   * distanceContainer object.
   *************************************************************************/
  function updateLine() {
    const data = draw.getAll();
    if (data.features.length > 0) {
      const line = data.features[0];
      //const distance = turf.length(line, { units: 'feet' });
      //distanceContainer.current.innerHTML = `${distance.toFixed(2)} miles`;
    }// } else {
    //   distanceContainer.current.innerHTML = "0.00 miles";
    // }
}

/*************************************************************************
 * @function addMarker
 * @param coords, the lat and lng where the path vertex is to be added
 * @Desc 
 * Called by the global 'click' event handler to add a path vertex to the 
 * map at the latitude and longitude that were clicked.
 *************************************************************************/
function addMarker(coords) {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundImage = 'radial-gradient(circle, yellow 60%, transparent 70%)';
  el.style.width = '10px';
  el.style.height = '10px';
  el.style.borderRadius = '50%';
  new mapboxgl.Marker(el)
    .setLngLat(coords)
    .addTo(map.current);
}
      
/*************************************************************************
 * @function draw.create event handler
 * @Desc 
 * Invoked when user starts drawing a path. Updates status box.
 *************************************************************************/
  map.current.on('draw.create', () => {
    updateLine();
  });
  
  // map.on('draw.delete', () => {
  //   markers.forEach(marker => {
  //     marker.remove();
  //   });
  //   markers = [];
  //   updateLine();
  // });
  
/*************************************************************************
 * @function draw.update event handler
 * @Desc 
 * Invoked when user continues drawing a path. Calls updateLine to update
 * path stats.
 *************************************************************************/
  map.current.on('draw.update', () => {
    updateLine();
  });

// function selectPath(pathId) {
//   if (map.current.getPaintProperty(pathId,'line-width') === 3)
//     map.current.setPaintProperty(id,'line-width',6);
//   else 
//     map.current.setPaintProperty(id,'line-width',6);
// }

  /*************************************************************************
   * @function map.click event handler for path selection events
   * @param pathIds, the array of layer ids of all paths on the map
   *        This allows the handler to fire only when one of these layers
   *        is clicked on.
   * @param e, the event object
   * @Desc 
   * Invoked when the user clicks on a path on the map. If the path is 
   * currently selected, it is unselected. Otherwise, the path is selected
   * and the previously selected path (if any) is unselected. 
   *************************************************************************/
  map.current.on('click',pathIds, (e)=> {
    e.clickOnLayer = true; //Ensure that the event propagates no further
    const id = e.features[0].layer.id; //undocumented magic!
    if (selectedPathId.current === id) {
      //unselect path just clicked on
      map.current.setPaintProperty(id,'line-width',3); //normal width
      selectedPathId.current = null;
      return;
    }
    //if here, we need to select the path that was clicked on
    map.current.setPaintProperty(id,'line-width',6); //thick width
    if (selectedPathId.current !== null) {
      //unselect currently selected path
      map.current.setPaintProperty(selectedPathId.current,'line-width',3);
    }
    //Set current selection
    selectedPathId.current = id;
  });


  /*************************************************************************
   * @function map.click event handler for path definition events and
   * clicks outside of path
   * @param e, the event object
   * @Desc 
   * Invoked when the user clicks on the map. If a path is in the process
   * of being defined, invokes addMarker() to add a vertex, with lat, lng, 
   * and elv, at the location clicked. If the event is a double-click 
   * (e.orginalEvent.detal === 2), path is terminated and staged for saving
   * via the updatePath prop function, and drawing mode is toggled to 
   * 'simple_select' (i.e., path not being defined).
   *************************************************************************/
  map.current.on('click', (e) => {
    if (e.clickOnLayer) return;  //Don't execute if click was on layer
    console.dir(e);
    if (selectedPathId.current !== null) {
      //unselect current selection
      map.current.setPaintProperty(selectedPathId.current,'line-width',3);
      selectedPathId.current = null;
    }
    if (!isDrawingStopped && e.originalEvent.detail === 2) {
        draw.changeMode('simple_select'); //Line is done
        isDrawingStopped = true;
        updatePath(editPath.holeNum, editPath.pathType, pathCoords);
        setEditPath(null);
    } else if (!isDrawingStopped) {
        const elev = map.current.queryTerrainElevation(e.lngLat, { exaggerated: false }) * 3.280839895 // convert meters to feet
        pathCoords.push({lat: e.lngLat.lat, lng: e.lngLat.lng, elv: elev });
        addMarker(e.lngLat);
    }
  });

  /**********************************************************************
   * END OF PATH DRAWING, SELECTION, DELETION, & EVENT HANDLING
   **********************************************************************/


  /**********************************************************************
   * FUNCTIONS TO ADD COURSE FEATURES TO MAP
   **********************************************************************/
  /*************************************************************************
   * @function addFeatureToMap
   * @param the holeNum associated with the feature to add to the map
   * @param featureCoords, an array of geocoord objects (with 'lat' 
   *        and 'lng' props) that define the feature.
   * @param featureType, the type of feature to add to the map 
   *        ('transitionPath', 'teebox', 'golfPath', or 'green')
   * @param createMarkers, a boolean indicating whether to create fresh tee and
   *        green markers (used only when featureType==='golfPath')
   * @returns the unique id of the feature added to the map
   * @Desc 
   * Display a feature (transition path, teebox, golf path, or green) on the 
   * map; label the feature on the map (TO DO)
   *************************************************************************/
   function addFeatureToMap(holeNum, featureCoords, featureType, createMarkers=true) {
    if (featureCoords.length == 0) return;
    const geojson = {
      'type': 'geojson',
      'data': { 
        'type': 'Feature',
        'properties': {
          'label': `Hole ${holeNum} ${featureLabel[featureType]}`
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': featureCoords.map(pt => [pt.lng, pt.lat])                 
        }
      }
    };
    const id = ((holeNum < 10) ? `H0${holeNum}${featureType}`: `H${holeNum}${featureType}`);
    map.current.addSource(id,geojson); 
    //Add path layer
    map.current.addLayer({
      'id': id,
      'type': 'line',
      'source': id,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': lineColor[featureType],
        'line-width': 3
      },
    });
    if (featureType==='golfPath' || featureType==='transitionPath') {
      //Add path label layer and add to pathIds array to enable
      //popup on event hover
      map.current.addLayer({
        'id': id + "_label",
        'type': "symbol",
        'source': id,
        'layout': {
          'symbol-placement': 'line-center',
          'text-max-angle': 90,
          'text-offset': [1,1],
          "text-font": ["Arial Unicode MS Regular"],
          "text-field": '{label}',
          "text-size": 12,
        },
        'paint': {
          'text-color': '#FFFFFF',
          'text-halo-color': '#000000',
          'text-halo-width': 0.5,
          'text-halo-blur': 0.5
        }
      });
      pathIds.push(id);
    }
    
    if (featureType==='golfPath' && createMarkers) {
      //Add _draggable!_ tee and flag markers
      const teePopup = new mapboxgl.Popup({closeButton: false, maxWidth: 'none'})
        .setText(`Hole ${holeNum} Tee`);
      const tee = new FontawesomeMarker({
        icon: 'fas fa-golf-ball-tee',
        iconColor: 'white',
        color: 'blue',
        draggable: true
      }).setLngLat([featureCoords[0].lng, 
          featureCoords[0].lat])
         .setPopup(teePopup)
         .addTo(map.current);
      const flagPopup = new mapboxgl.Popup({closeButton: false, maxWidth: 'none'})
        .setText(`Hole ${holeNum} Flag`);
      const flag = new FontawesomeMarker({
          icon: 'fas fa-flag',
          iconColor: 'white',
          color: 'lightgreen',
          draggable: true
        }).setLngLat([featureCoords[featureCoords.length-1].lng, 
                      featureCoords[featureCoords.length-1].lat])
           .setPopup(flagPopup)
           .addTo(map.current);
      teeFlagMarkers.current[holeNum-1].tee = tee;
      teeFlagMarkers.current[holeNum-1].flag = flag;
      tee.on('drag', ()=>handleTeeDrag(holeNum,tee));
      tee.on('dragend',()=>handleTeeDragEnd(holeNum,tee));
      flag.on('drag', ()=>handleFlagDrag(holeNum,flag));
      flag.on('dragend',()=>handleFlagDragEnd(holeNum,flag));
      flag.on('mouseenter',()=>{alert("entering markder!")});
      const teeDiv = tee.getElement();
      const flagDiv = flag.getElement();
      teeDiv.addEventListener('mouseenter',()=>tee.togglePopup());
      teeDiv.addEventListener('mouseleave',()=>tee.togglePopup());
      teeDiv.addEventListener('click',()=>tee.togglePopup());
      flagDiv.addEventListener('mouseenter',()=>flag.togglePopup());
      flagDiv.addEventListener('mouseleave',()=>flag.togglePopup());
      teeDiv.addEventListener('click',()=>tee.togglePopup());
    }
    return id;
  }

  /*************************************************************************
   * @function addAllFeaturesToMap
   * @Desc 
   * Display all the features defined in the holes array (component prop).
   * Give each feature a unique id so that click handlers can be defined on
   * them. Give each feature a distinctive color according to our 
   * color legend: yellow for trans path, blue for tee box, red for 
   * golf path, and bright green for green.
   *************************************************************************/
  function addAllFeaturesToMap() {

    for (let h = 0; h < holes.length; h++) {
      if (holes[h].transitionPath !== "") {
        addFeatureToMap(h+1,holes[h].transitionPath,'transitionPath');
      }
      if (holes[h].golfPath !== "") {
        addFeatureToMap(h+1,holes[h].golfPath,'golfPath');
      }
      if (holes[h].teebox !== "") {
        addFeatureToMap(h+1,holes[h].teebox,'teebox');
      }
      if (holes[h].green!== "") {
        addFeatureToMap(h+1,holes[h].green,'green');
      }   
    }
  }

  /**********************************************************************
   * END OF FUNCTIONS TO ADD COURSE FEATURES TO MAP
   **********************************************************************/

  
  /**********************************************************************
   * MARKER DRAG EVENT HANDLERS
   **********************************************************************/

    function handleTeeDrag(holeNum, teeMarker) {
    //TBD: May need to write code here to update status box as marker is dragged
    }

    function handleFlagDrag(holeNum, flagMarker) {
    //TBD: May need to write code here to update status box as marker is dragged
    }

  /*************************************************************************
   * @function handleFlagDragEnd
   * @param the holeNum of the flag marker just dragged
   * @param flagMarker, the Mapbox marker object just dragged
   * @Desc 
   * Update the golf path leading up to the flag, along with the transition
   * path emanating from the tee (if present), such that they match the
   * flag's new dragged location 
   *************************************************************************/
    function handleFlagDragEnd(holeNum, flagMarker) {
      const lngLat = flagMarker.getLngLat();
      const elv = map.current.queryTerrainElevation(lngLat, {exaggerated: false}) * 3.280839895;
      const golfLayerId = ((holeNum < 10) ? `H0${holeNum}golfPath`:  `H${holeNum}golfPath`);
      const transLayerId = ((holeNum < 10) ? `H0${holeNum}transitionPath`:  `H${holeNum}transitionPath`);
      if (holes[holeNum-1].golfPath !== "") {
        map.current.removeLayer(golfLayerId);
        map.current.removeLayer(golfLayerId + "_label");
        map.current.removeSource(golfLayerId);
        holes[holeNum-1].golfPath[holes[holeNum-1].golfPath.length-1].lat = lngLat.lat;
        holes[holeNum-1].golfPath[holes[holeNum-1].golfPath.length-1].lng = lngLat.lng;
        holes[holeNum-1].golfPath[holes[holeNum-1].golfPath.length-1].elv = elv; 
        addFeatureToMap(holeNum,holes[holeNum-1].golfPath,'golfPath',false);
      }
      if (holeNum < holes.length && holes[holeNum].transitionPath !== "") {
        map.current.removeLayer(transLayerId);
        map.current.removeLayer(transLayerId + "_label");
        map.current.removeSource(transLayerId);
        holes[holeNum].transitionPath[0].lat = lngLat.lat;
        holes[holeNum].transitionPath[0].lng = lngLat.lng;
        holes[holeNum].transitionPath[0].elv = elv;
        addFeatureToMap(holeNum+1,holes[holeNum].transitionPath,'transitionPath');
      }
    }

  /*************************************************************************
   * @function handleTeeDragEnd
   * @param the holeNum of the tee marker just dragged
   * @param teeMarker, the Mapbox marker object just dragged
   * @Desc 
   * Update the transition path leading up to the tee, along with the golf
   * path emanating from the tee (if present), such that they match the
   * tee's new dragged location 
   *************************************************************************/

    function handleTeeDragEnd(holeNum, teeMarker) {
      const lngLat = teeMarker.getLngLat();
      const elv = map.current.queryTerrainElevation(lngLat, {exaggerated: false}) * 3.280839895;
      const transLayerId = `H${holeNum}transitionPath`;
      const golfLayerId = `H${holeNum}golfPath`;
      if (holes[holeNum-1].transitionPath !== "" && holes[holeNum-1].transitionPath.length > 1) {
        map.current.removeLayer(transLayerId);
        map.current.removeLayer(transLayerId + "_label");
        map.current.removeSource(transLayerId);
        holes[holeNum-1].transitionPath[holes[holeNum-1].transitionPath.length-1].lat = lngLat.lat;
        holes[holeNum-1].transitionPath[holes[holeNum-1].transitionPath.length-1].lng = lngLat.lng;
        holes[holeNum-1].transitionPath[holes[holeNum-1].transitionPath.length-1].elv = elv;
        addFeatureToMap(holeNum,holes[holeNum-1].transitionPath,'transitionPath');
      }
      if (holes[holeNum-1].golfPath !== "") {
        map.current.removeLayer(golfLayerId);
        map.current.removeLayer(golfLayerId + "_label");
        map.current.removeSource(golfLayerId);
        holes[holeNum-1].golfPath[0].lat = lngLat.lat;
        holes[holeNum-1].golfPath[0].lng = lngLat.lng;
        holes[holeNum-1].golfPath[0].elv = elv; 
        addFeatureToMap(holeNum,holes[holeNum-1].golfPath,'golfPath',false);
      }
    }

  
  /**********************************************************************
   * END OF GLOBAL MAP EVENT HANDLERS
   **********************************************************************/

  /**********************************************************************
   * EVENT HANDLERS TO DISPLAY POPUPS WHEN PATHS ARE HOVERED
   **********************************************************************/

  /*************************************************************************
   * @function path mousenter event handler 
   * @param pathIds, the array of ids of the path layers (responds only to these)
   * @param e, the event object
   * @Desc 
   * When the user hovers over a path, change the cursor to a pointer and
   * show a popop that displays the path's distance. 
   * Note: the pathIds array allows us to specify this mousenter behavior
   * only for map layers that contain paths. Miraculously, we can obtain
   * the layer id of the path that was clicked via e.features[0].layer.id.
   * This is not documented; I discovered it via debugging.
   *************************************************************************/
    map.current.on("mouseenter", pathIds, (e) => {
      map.current.getCanvas().style.cursor = 'pointer';
      const id = e.features[0].layer.id;
      const hNum = parseInt(id.substr(1,2));
      const distProp = ((id[3] === 'g') ? 'golfRunDistance' : 'transRunDistance');
      const dist = ((distUnits === 'Imperial') ? `${Conversions.toYards(holes[hNum-1][distProp])} yards` :
                    `${Conversions.toMeters(holes[hNum-1][distProp])} meters`);
      //alert("in mousenter with id = " + id + ", hNum = " + hNum + ", dist = " + dist);
      pathPopup.setText(`Running distance: ${dist}`)
        .setLngLat(e.lngLat)
        .addTo(map.current);
    });

    /*************************************************************************
   * @function path mouseleave event handler 
   * @param pathIds, the array of ids of the path layers (responds only to these)
   * @param e, the event object
   * @Desc 
   * When the mouse leaves a path that was hovered,, change the cursor
   * back to the hand and hide the popup displaying the path's distance. to a pointer and
   * show a popop that displays the path's distance. 
   *************************************************************************/
    map.current.on("mouseleave", pathIds, (e) => {
      map.current.getCanvas().style.cursor = '';
      pathPopup.remove();
    });
   
  /**********************************************************************
   * END OF EVENT HANDLERS TO DISPLAY POPUPS WHEN PATHS ARE HOVERED
   **********************************************************************/
   
  

  // Cleanup on unmount
  return () => {
    map.current.remove();
  };     
}, [editPath]); //useEffect() is reinvoked whenever editPath state var changes 
      

  /*************************************************************************
   * @function handleProfileClick
   * @param holeNum, the number of the hole whose "show profile" button was
   *        clicked.
   * @Desc 
   * Shows/hides the currently displayed hole profile pane.
   *************************************************************************/
  function handleProfileClick(holeNum) {
      if (profileHole === holeNum) {
      setProfileHole(0);
      }
      else {
      setProfileHole(holeNum);
      }
  }

   /*************************************************************************
   * @function handleKeyDown
   * @param e, the event object
   * @Desc 
   * When the user hits a key when the map window is focused, we potentially
   * need to respond. Here are the cases we currently support:
   * - Delete or backspace when path selected: Delete the path
   *************************************************************************/
  function handleKeyDown(e) {
    if (selectedPathId.current !== null && (e.keyCode === 8 || e.keyCode === 46)) {
      map.current.removeLayer(selectedPathId.current);
      const hNum = parseInt(selectedPathId.current.substr(1,2));
      const pathType = selectedPathId.current.substr(3);
      updatePath(hNum, pathType, "");
      selectedPathId.current = null; //path no longer selected
      if (pathType == 'golfPath') {
        if (hNum == 1) {
          if (holes[0].transitionPath.length === 0) {
          teeFlagMarkers.current[0].tee.remove();
          }
          if (holes[1].transitionPath === "") {
          teeFlagMarkers.current[0].flag.remove();
          }
        } else {
          if (holes[hNum-1].transitionPath === "") {
            teeFlagMarkers.current[hNum-1].tee.remove();
          }
          if (hNum < holes.length && holes[hNum].transitionPath === "") {
            teeFlagMarkers.current[hNum-1].flag.remove();
          }
          
        } 
      }
    }
  }

  // Component's JSX Render Code
  return ( 
    <div className="map-container" onKeyDown={handleKeyDown}>
      <table className="table table-light table-sm w-auto">
        <thead>
          <tr className="font-small">
          <th>Hole</th>
          <th><span className="txt-yellow bg-black">Trans<br/>Path</span></th>
          <th><span className="txt-blue">Tee<br/>Box</span></th>
          <th><span className="txt-red">Golf<br/>Path</span></th>
          <th><span className="txt-green bg-black">Green</span></th>
          </tr>
        </thead>
        <tbody>
          {holes.map((h) => {
            return(
              <tr key={h.number}>
              <td><button className="btn btn-sm" disabled={(h.transitionPath === "" || h.golfPath === "")}
                          onClick={()=>handleProfileClick(h.number)}>
                   {h.number}
                   </button>
              </td>
              <td>
                <button className={"btn btn-sm" + ((h.transitionPath !== "") ? " btn-green" : "")}
                        aria-label={"Hole " + h.holeNum + " transition path " + 
                                    ((h.transitionPath === "") ? "(not yet defined)":"(defined)")}
                          onClick={((h.transitionPath === "") ? ()=>handleEditPath(h.number,"transitionPath") : null)}>
                    <FontAwesomeIcon icon={((h.transitionPath === "") ? "plus" : "check")}/>
                </button>
              </td>
              <td>
              <button className={"btn btn-sm" + ((h.teebox !== "") ? " btn-green" : "")}
                        aria-label={"Hole " + h.holeNum + " tee box " + 
                                    ((h.transitionPath === "") ? "(not yet defined)":"(defined)")}
                          onClick={((h.transitionPath === "") ? ()=>handleEditPath(h.number,"teebox") : null)}>
                    <FontAwesomeIcon icon={((h.teebox === "") ? "plus" : "check")}/>
                </button>
              </td>
              <td>
              <button className={"btn btn-sm" + ((h.golfPath !== "") ? " btn-green" : "")}
                        aria-label={"Hole " + h.holeNum + " golf path " + 
                                    ((h.golfPath === "") ? "(not yet defined)":"(defined)")}
                          onClick={((h.golfPath === "") ? ()=>handleEditPath(h.number,"golfPath") : null)}>
                    <FontAwesomeIcon icon={((h.golfPath === "") ? "plus" : "check")}/>
                </button>
              </td>
              <td>
              <button className={"btn btn-sm" + ((h.green !== "") ? " btn-green" : "")}
                        aria-label={"Hole " + h.holeNum + " green " + 
                                    ((h.green === "") ? "(not yet defined)":"(defined)")}
                          onClick={((h.green === "") ? ()=>handleEditPath(h.number,"green") : null)}>
                    <FontAwesomeIcon icon={((h.green === "") ? "plus" : "check")}/>
                </button>
              </td>
              </tr>
          );
          })}
        </tbody>
      </table>
      <div className="map-box-container">
        <div ref={mapContainer} className="map-box-full">
        {status.mode === holeMapTool.DEFINE_PATH ? 
          <div className="status-box">
            <span className="txt-small-bold">Defining Hole 1 Transition Path...</span>
            <br/>
            <span>Click to start path and to define points along path; double-click to end path</span>
            <div className="txt-small small-pad">Path Length: 230 yards</div>
            <div className="form-check form-switch">
              <div className="layout-inline-block">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={status.autoAdvance}/>
              </div>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Auto-advance path</label>
            </div>
          </div> : 
          <div className="status-box" tabIndex="0">     
            <span className="txt-small-bold">Tips:</span>
            <ul className="txt-small txt-align-left">
              <li>Click on a <FontAwesomeIcon icon="plus" /> icon in side panel to define a hole's
                  &nbsp;<span className="txt-yellow bg-black">Transition Path</span>, <span className="txt-red">Golf Path</span>,&nbsp;
                  <span className="txt-blue">Tee Box</span>, or&nbsp;<span className="txt-green bg-black">Green</span></li>
              <li>A <FontAwesomeIcon icon="check" className="btn-green"/> icon in side panel means the hole's path, tee box, or green has been defined. To redefine it, first delete it on map by selecting it and hitting 'delete' key.</li>
              <li>Click on a hole # to show/hide elevation profile of hole. (Available only if transition path AND golf path are defined for hole.)</li>
            </ul>
          </div>
        }

        </div>
        <div className="hole-profile" hidden={profileHole===0}>
            <div className="flex-container">
              <div><h5>{"Hole #" + profileHole + " Elevation Profile"}</h5></div>
              <div><button onClick={()=>setProfileHole(0)}><FontAwesomeIcon icon="xmark"/></button></div>
            </div>
        </div>
      </div>
    </div>
  );
};