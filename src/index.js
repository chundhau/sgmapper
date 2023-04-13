import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import CoursesModeSearch from './CoursesModeSearchFilter';
import CoursesMode from './CoursesMode';
import reportWebVitals from './reportWebVitals';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMapPin, faGlobe, faMap, faPhone, faEye } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)
library.add(faMapPin)
library.add(faGlobe)
library.add(faMap)
library.add(faPhone)
library.add(faEye)

const coursesDiv = ReactDOM.createRoot(document.getElementById('coursesModeTab'));
//const coursesSearchDiv = ReactDOM.createRoot(document.getElementById('coursesModeSearchDiv'));
// coursesSearchDiv.render(
//   <React.StrictMode>
//     <CoursesModeSearch />
//   </React.StrictMode>
// );
coursesDiv.render(
  <React.StrictMode>
    <CoursesMode />
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();