// MapBox.js
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export default function CoursesModeDetailsMap({holes, mapCenter, updatePath})  {

  const [editPath, setEditPath] = useState(null);
  const [profileHole, setProfileHole] = useState(0);
  const mapContainer = useRef(null);
  const distanceContainer = useRef(null);

  function handleEditPath(holeNum, path) { 
      const mapboxDraw =  new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: 'draw_line_string',
      });
      setEditPath({holeNum: holeNum,
                   pathType: path,
                   draw: mapboxDraw,
                   markers: [],
                   drawAdded: false,
                   isDrawingStopped: false,
      });
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidWRkeWFuIiwiYSI6ImNsZzY3MG1tZjAzbnczY3FjN2h0amp0MjUifQ.h7bnjg6dqjrJeFqNPvJyuA';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 15,
    });

    if (editPath !== null && !editPath.drawAdded) { //Add draw
      map.addControl(editPath.draw);
      setEditPath({...editPath, drawAdded: true});
    }

    // const draw = new MapboxDraw({
    //     displayControlsDefault: false,
    //     defaultMode: 'draw_line_string',
    //   });
    //   map.addControl(draw);
      
    //   let markers = [];
    //   let isDrawingStopped = false;
      

    function updateLine() {
        const data = editPath.draw.getAll();
        if (data.features.length > 0) {
          const line = data.features[0];
          const distance = turf.length(line, { units: 'feet' });
          //distanceContainer.current.innerHTML = `${distance.toFixed(2)} miles`;
        }// } else {
        //   distanceContainer.current.innerHTML = "0.00 miles";
        // }
      }
           
      map.on('editPath.draw.create', () => {
        updateLine();
      });
      
      // map.on('editPath.draw.delete', () => {
      //   markers.forEach(marker => {
      //     marker.remove();
      //   });
      //   markers = [];
      //   updateLine();
      // });
      
      map.on('editPath.draw.update', () => {
        updateLine();
      });

      map.on('render', () => {
        map.resize();
    });
    
    //TO DO: This doesn't obtain correct elevation. Please fix!
    function getElevation(coords, callback) {
        const queryCoords = coords.join(',');
        const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${queryCoords}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`;
      
        fetch(url)
          .then(response => response.json())
          .then(data => {
            const features = data.features;
            if (features.length > 0) {
              const elevations = features.map(feature => feature.properties.ele);
              // Calculates the closest elevation to the provided coordinates using the reduce method
              //it checks if the absolute difference between the current elevation (curr) and the provided coordinate's elevation (coords[2]) is 
              //less than the absolute difference between the previous elevation (prev) and the provided coordinate's elevation.
               //If it is, it returns the current elevation; otherwise, it returns the previous elevation.
              const closestElevation = elevations.reduce((prev, curr) =>
                Math.abs(curr - coords[2]) < Math.abs(prev - coords[2]) ? curr : prev
              );
              callback(closestElevation);
            } else {
              callback(0);
            }
          })
          .catch(error => console.error(error));
      }
      
      
      function addMarker(coords) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'radial-gradient(circle, yellow 60%, transparent 70%)';
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';
      
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .addTo(map);
      
        // el.addEventListener('mouseenter', () => {
        //   getElevation(coords.toArray(), elevation => {
        //     const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
        //       .setLngLat(coords)
        //       .setHTML(
        //         //`Longitude: ${coords.lng.toFixed(4)}<br>Latitude: ${coords.lat.toFixed(4)}<br>Elevation: ${elevation.toFixed(2)} meters`
        //         //`Longitude: ${coords.lng.toFixed(4)}<br>Latitude: ${coords.lat.toFixed(4)}<br>Elevation: ${(elevation * 3.28084).toFixed(2)} feet`
        //         `Longitude: ${coords.lng}<br>Latitude: ${coords.lat}<br>Elevation: ${(elevation * 3.28084)} feet`
        //     )
        //       .addTo(map);
      
        //     el.addEventListener('mouseleave', () => {
        //       popup.remove();
        //     });
        //   });
        // });
        const newMarkers = editPath.markers.push(marker);
        setEditPath({...editPath, markers: newMarkers});
      }
      
      map.on('click', (e) => {
        if (e.originalEvent.detail === 2) {
          editPath.draw.changeMode('simple_select');
          setEditPath({...editPath,isDrawingStopped: true});
        } else if (!editPath.isDrawingStopped) {
          addMarker(e.lngLat);
        }
      });
      
      map.on('draw.modechange', (e) => {
        if (e.mode === 'simple_select') {
          //I think this is what triggers the end of the path drawing episode.
          //Our job here is to save the path to the correct prop of the current hole.
          //I think the markers persist until explicitly deleted.
          //Need to convert a marker object to our coord object with lat, lng, elv props
          setEditPath(null); //Done with drawing this path!
          updatePath(editPath.holeNum, editPath.pathType,editPath.markers);
        } else {
          setEditPath({...editPath, isDrawingStopped: false});
        }
      });
      
      

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

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
      <div className="map-pane">
        <h5>Hole Paths</h5>
        <div className="table-responsive">
        <table className="table table-light table-sm">
          <thead>
            <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Transition</th>
            <th>Golf</th>
            </tr>
          </thead>
          <tbody>
            {holes.map((h) => {
              return(
                <tr key={h.number}>
                <td>{h.number}</td>
                <td> 
                    <button className={"btn btn-sm " + (profileHole===h.number ? "btn-primary" : "btn-outline-secondary")}
                            disabled={h.transitionPath === "" || h.golfPath === ""}
                            onClick={()=>handleProfileClick(h.number)}>
                      <FontAwesomeIcon icon="chart-line"/>
                    </button></td>
                <td>
                    <FontAwesomeIcon icon={h.transitionPath === "" ? "xmark" :"check"}
                                     className={h.transitionPath === "" ? "btn-red" : "btn-green"}/>
                  &nbsp;
                  <button className="btn btn-outline-secondary btn-sm"
                            onClick={()=>handleEditPath(h.number,"transitionPath")}>
                      <FontAwesomeIcon icon="edit"/>
                   </button>
                </td>
                <td>
                  <span className={h.transitionPath === "" ? "btn-red" : "btn-green"}>
                    <FontAwesomeIcon icon={h.golfPath === "" ? "xmark" :"check"}/>
                  </span>&nbsp;
                  <button className="btn btn-outline-secondary btn-sm"
                            onClick={()=>handleEditPath(h.number,"golfPath")}>
                      <FontAwesomeIcon icon="edit"/>
                   </button>
                </td>
                </tr>
            );
            })}
          </tbody>
        </table>
        </div>
        </div>
        <div className="map-box-container">
          <div ref={mapContainer} className="map-box-full"></div>
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
