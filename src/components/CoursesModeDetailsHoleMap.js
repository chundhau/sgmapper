 /*************************************************************************
 * File: coursesModeDetailsHoleMap.js
 * This file defines the CoursesModeDetails React component, which enables
 * users to view and edit the basic data on a golf course.
 ************************************************************************/

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
mapboxgl.accessToken = 'pk.eyJ1IjoidWRkeWFuIiwiYSI6ImNsZzY3MG1tZjAzbnczY3FjN2h0amp0MjUifQ.h7bnjg6dqjrJeFqNPvJyuA';


export default function CoursesModeDetailsHoleMap({holes, mapCenter, updatePath})  {

  const [editPath, setEditPath] = useState(null);
  const [profileHole, setProfileHole] = useState(0);
  const [zoom, setZoom] = useState(15);
  const [lng, setLng] = useState(mapCenter.lng);
  const [lat, setLat] = useState(mapCenter.lat);
  const [status, setStatus] = useState({mode: "select", selection: null, pathLength: null, autoAdvance: null});
  const mapContainer = useRef(null);
  const map = useRef(null);
  //line colors for hole features
  const lineColor = {
    golfPath: '#FF0000',
    transitionPath: '#FFFF00',
    teebox: '#0000FF',
    green: '#90EE90',
  };
  //text labels for hole features
  const featureLabel = {
    golfPath: 'Golf',
    transitionPath: 'Transition',
    teebox: 'Tee',
    green: 'Green',

  };

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


  /*************************************************************************
   * @function on load handler
   * @Desc 
   * Invoked when the map is loaded.
   *************************************************************************/
   map.current.on('load', () => {
     map.current.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.terrain-rgb',
      'tileSize': 256,
      'maxzoom': 15
      });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
      displayAllDefinedFeatures();
    });

    map.current.on('render', () => {
      map.current.resize();
    });

    

    /*************************************************************************
     * @function on move handler
     * @Desc 
     * Update state vars when pan and zoom change
     *************************************************************************/
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

     //Instantiate a mapbox draw object, but hide draw controls
     const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: editPath === null ? 'simple_select' : 'draw_line_string'
    });
    
    map.current.addControl(draw);

    let coords = []; //Coordinates of path currently being defined
    //Whether a path is currently being defined
    let isDrawingStopped = (editPath === null ? true : false);

    /*************************************************************************
   * @function displayFeature
   * @param feature, an array of geocoord objects with 'lat' and 'lng' props.
   * @param lineColor, a hex value indicating the color of the feature.
   * @param id, a unique id to assign to the feature
   * @param label, a textual label for the feature that includes the feature
   *        type as a substring: 'Golf', 'Transition', 'Green' or 'Tee'
   * @returns the unique id of the feature displayed
   * @Desc 
   * Display a feature (transition path, teebox, golf path, or green) on the 
   * map; label the feature on the map (TO DO)
   *************************************************************************/
  function displayFeature(holeNum, featureCoords, featureType) {
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
    const id = `H${holeNum}${featureType}`;
    map.current.addSource(id,geojson); 
    //Add line segment
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
      //Add path label layer
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
    }
    if (featureType==='golfPath') {
      //Add _draggable!_ tee and flag markers
      const teePopup = new mapboxgl.Popup()
        .setText(`Hole ${holeNum} Tee`)
        .addTo(map.current);
      const tee = new mapboxgl.Marker({
        color: "#3bb2d0",
        symbol: holeNum,
        draggable: true
      }).setLngLat([featureCoords[0].lng, 
          featureCoords[0].lat])
        .addTo(map.current)
        .setPopup(teePopup);
      const flagPopup = new mapboxgl.Popup()
        .setText(`Hole ${holeNum} Flag`)
        .addTo(map.current);
      const flag = new mapboxgl.Marker({
        color: "#3bb2d0",
        symbol: holeNum,
        draggable: true
      }).setLngLat([featureCoords[featureCoords.length-1].lng, 
          featureCoords[featureCoords.length-1].lat])
        .addTo(map.current)
        .setPopup(flagPopup);
  }
  return id;
}

  /*************************************************************************
   * @function displayAllDefinedFeatures
   * @Desc 
   * Display all the features defined in the holes array (component prop).
   * Give each feature a unique id so that click handlers can be defined on
   * them. Give each feature a distinctive color according to our 
   * color legend: yellow for trans path, blue for tee box, red for 
   * golf path, and bright green for green.
   *************************************************************************/
  function displayAllDefinedFeatures() {

    for (let h = 0; h < holes.length; h++) {
      if (holes[h].transitionPath !== "") {
        displayFeature(h+1,holes[h].transitionPath,'transitionPath');
      }
      if (holes[h].golfPath !== "") {
        displayFeature(h+1,holes[h].golfPath,'golfPath');
      }
      if (holes[h].teebox !== "") {
        displayFeature(h+1,holes[h].teebox,'teebox');
      }
      if (holes[h].green!== "") {
        displayFeature(h+1,holes[h].green,'green');
      }   
    }
  }

  // function toggleSelectedLayer(id) {
  //   if (map.current.getPaintProperty(id,'line-width') === 3)
  //     map.current.setPaintProperty(id,'line-width',6);
  //   else 
  //     map.current.setPaintProperty(id,'line-width',6);
  // }

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
   * @function draw.create event handler
   * @Desc 
   * Invoked when user starts drawing a path. Calls updateLine to update
   * path stats.
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

  /*************************************************************************
   * @function addMarker
   * @param coords, the lat and lng where the path vertex is to be added
   * @Desc 
   * Called by the 'click' event to add a path vertex to the map at the
   * latitude and longitude that were clicked.
   *************************************************************************/
  function addMarker(coords) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'radial-gradient(circle, yellow 60%, transparent 70%)';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';
    
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current);
    }

  /*************************************************************************
   * @function map.click event handler
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
      if (!isDrawingStopped && e.originalEvent.detail === 2) {
          draw.changeMode('simple_select'); //Line is done
          isDrawingStopped = true;
          updatePath(editPath.holeNum, editPath.pathType, coords);
          setEditPath(null);
      } else if (!isDrawingStopped) {
          const elev = map.current.queryTerrainElevation(e.lngLat, { exaggerated: false }) * 3.280839895 // convert meters to feet
          coords.push({lat: e.lngLat.lat, lng: e.lngLat.lng, elv: elev });
          addMarker(e.lngLat);
      }
    });

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

  return ( 
    <div className="map-container">
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
        {status.mode !=="select" ? 
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