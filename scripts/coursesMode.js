import ssLogo from "./images/sslogo2.png";

function Logo() {
    return <img className="mode-page-icon" src={ssLogo} alt="SpeedScore logo"/>
}

const coursesDiv = ReactDOM.createRoot(document.getElementById('coursesModeTab'));
coursesDiv.render(<Logo />);