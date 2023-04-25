import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useState} from 'react';

export default function StarRating({maxStars, numStars}) {
    const [starRating, setStarRating] = useState(numStars);
    const starArray = Array.from({length: maxStars}, (_, i) => i + 1);

    return(
        <div className="rating">
            {starArray.map((i) => {
                return(
                <span key={i}
                      className={(i <= numStars) ? 
                                   "star-selected" : "star-unselected"}>
                    <FontAwesomeIcon icon="star"/>
                </span> );
                })
            }
        </div>
    );
}