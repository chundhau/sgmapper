import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CoursesModeDetailsHoleMap({holes, mapCenter, updatePath})  {

  const [editPath, setEditPath] = useState(null);
  const [profileHole, setProfileHole] = useState(0);
  const mapContainer = useRef(null);
  //const distanceContainer = useRef(null);

  function handleEditPath(holeNum, path) { 
      setEditPath({holeNum: holeNum,
                   pathType: path
      });
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidWRkeWFuIiwiYSI6ImNsZzY3MG1tZjAzbnczY3FjN2h0amp0MjUifQ.h7bnjg6dqjrJeFqNPvJyuA';
    
    //Instantiate a mapbox Map object and attach to mapContainer DOM element
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      //'mapbox://styles/mapbox/satellite-v9',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 15,
    });

    //Instantiate a mapbox draw object, but hide draw controls
    const draw = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: editPath === null ? 'simple_select' : 'draw_line_string'
      });
      map.addControl(draw);
    
      //Vertices of path currently being defined
      let coords = []; 
      //Boolean indicating whether a path is currently being defined
      let isDrawingStopped = (editPath === null ? true : false);

    /*************************************************************************
     * @function displayPath
     * @param path, an array of geocoord objects with 'lat' and 'lng' props.
     * @param segmentCount, an integer indicating the next available unique
     * label for a path segment. 
     * @param lineColor, a hex value indicating the color of the path
     * @param label, a textual label for the path
     * @Desc 
     * Display a path (transition or golf) on the map
     * TO DO: Show path label
     *************************************************************************/
      function displayPath(path, segmentCount, lineColor, label) {
        for(let i = 0; i < path.length-1; i++) {
          map.addSource(`route${segmentCount+i}`, {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {title: label},
              'geometry': {
                'type': 'LineString',
                'coordinates': [[path[i].lng, path[i].lat],
                                [path[i+1].lng, path[i+1].lat]]
              }
            }
          });
          map.addLayer({
            'id': `route${segmentCount+i}`,
            'type': 'line',
            'source': `route${segmentCount+i}`,
            'layout': {
              'line-join': 'round',
              'line-cap': 'round',
            },
            'paint': {
              'line-color': lineColor,
              'line-width': 3
            },
            
          })
        }
      }

    /*************************************************************************
     * @function displayAllDefinedPaths
     * @Desc 
     * Display all the paths defined in the holes array (component prop).
     * Maintain a segment counter to ensure each path segment has a unique
     * id, per Mapbox requirements
     *************************************************************************/
      function displayAllDefinedPaths() {
        let segmentCount = 0;
        for (let h = 0; h < holes.length; h++) {
          if (holes[h].transitionPath !== "") {
            displayPath(holes[h].transitionPath,segmentCount,"#FFFF00","Hole" + (h+1) + " Transition");
            segmentCount += holes[h].transitionPath.length;
          }
          if (holes[h].golfPath !== "") {
            displayPath(holes[h].golfPath,segmentCount, '#FF0000',"Hole " + (h+1) + " Golf");
            segmentCount += holes[h].golfPath.length;
          }
        }   
      }
    
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
      map.on('draw.create', () => {
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
      map.on('draw.update', () => {
        updateLine();
      });

    /*************************************************************************
     * @function draw.create event handler
     * @Desc 
     * Invoked when user starts drawing a path. Calls updateLine to update
     * path stats.
     *************************************************************************/
      map.on('load', () => {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.terrain-rgb',
          'tileSize': 256,
          'maxzoom': 15
          });
          map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
          displayAllDefinedPaths();
      })

      map.on('render', () => {
        map.resize();
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
          .addTo(map);
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
      map.on('click', (e) => {
        if (!isDrawingStopped && e.originalEvent.detail === 2) {
            draw.changeMode('simple_select'); //Line is done
            isDrawingStopped = true;
            updatePath(editPath.holeNum, editPath.pathType, coords);
            setEditPath(null);
        } else if (!isDrawingStopped) {
            const elev = map.queryTerrainElevation(e.lngLat, { exaggerated: false }) * 3.280839895 // convert meters to feet
            coords.push({lat: e.lngLat.lat, lng: e.lngLat.lng, elv: elev });
            addMarker(e.lngLat);
        }
      });

    // Cleanup on unmount
    return () => {
      map.remove();
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