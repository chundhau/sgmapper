import CourseMapper from './images/CourseMapper.jpg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState, useEffect, useRef} from 'react';
import CoursesModeEditTextModal from './CoursesModeEditTextModal';

export default function CoursesModeDetailsHoleMap({course, updateCourseVal}) {

    return(
        <img src={CourseMapper} alt="Mock up of Course Mapping Tool" />
    );

}