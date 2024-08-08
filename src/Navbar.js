import { cards } from "./info";

export function Navbar() {
    function togglePopup() {
        if (document.getElementById("popupBackground").style.display === "flex") {
            hidePopup();
        }
        else {
            showPopup();
        }
    }

    function hidePopup() {
        document.getElementById("popupBackground").style.display = "none";
    };

    function showPopup() {
        document.getElementById("popupBackground").style.display = "flex";
    };

    return (
        <div className="Navbar">
            <nav className="navbar sticky-top bg-dark">
            <a className="navbar-brand" href="#">Navbar</a>
            <div id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#"><button onClick={() => togglePopup()}> <i className="bi bi-gear"></i></button></a>
                </li>
                </ul>
            </div>

            </nav>
        </div>
    )
}