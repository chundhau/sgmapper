import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import CoursesMode from './CoursesMode';
import reportWebVitals from './reportWebVitals';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMapPin } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)
library.add(faMapPin)

const coursesDiv = ReactDOM.createRoot(document.getElementById('coursesModeTab'));
coursesDiv.render(
  <React.StrictMode>
    <CoursesMode />
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();