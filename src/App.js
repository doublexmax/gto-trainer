import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

import { Navbar } from './Navbar';
import { Chart } from './Chart';

import './App.css';

/*
TODO:

1. instantiate each position (just do 9max for now)
2. don't delete an element, but toggle its visibility with UTG being visible by default
*/

function App() {
  const [cookies, setCookies] = useState(cookie.loadAll());
  const [selectedPosition, setSelectedPosition] = useState('utg');
  const [sliderValue, setSliderValue] = useState(50);


  useEffect(() => {
    positions.forEach((position) => {
      const table = document.getElementById(position);
      if (table) {
        table.style.display = position === selectedPosition ? 'table' : 'none';
      }
    });
  }, [selectedPosition]);

  const handleSliderChange = (event) => {
    setSliderValue(Number(event.target.value));
  }

  const handleSelectChange = (event) => {
    const newPosition = event.target.value;
    setSelectedPosition(newPosition);
  };

  function hidePopup() {
    document.getElementById("popupBackground").style.display = "none";
  }

  const positions = ['utg', 'utg1', 'utg2', 'lj', 'hj', 'co', 'btn', 'sb'];
  //const positions = ['utg'];
  return (
    <div className="App">
      <Navbar />
      <div id="popupBackground">
        <div id="popup">
          <h2>Chart - {selectedPosition.toUpperCase()}</h2>
          <div className="container mt-3" id="select-position">
            <label htmlFor="positionSelect" className="form-label">Select Position</label>
            <select
              id="positionSelect"
              className="form-select"
              value={selectedPosition}
              onChange={handleSelectChange}
            >
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position.toUpperCase()}
                </option>
              ))}
            </select>
            {selectedPosition && (
              <div className="mt-3">
                <p>Selected Position: {selectedPosition}</p>
              </div>
            )}
            <div className="slidecontainer">
              <input type="range" min="0" max="100" className="slider" id="myRange" value={sliderValue} onChange={handleSliderChange} />
              <p>Raise Percent: {sliderValue}</p>
            </div>
          </div>
          {positions.map((position) => (
            <Chart key={position} position={position} visible={selectedPosition === position} />
          ))}
          <button id="closeBtn" onClick={hidePopup}>Close</button>
        </div>
      </div>
      <div className="table-container">
        <div className="table">
          <div className="seat utg">1</div>
          <div className="seat utg1">2</div>
          <div className="seat utg2">3</div>
          <div className="seat lj">4</div>
          <div className="seat hj">5</div>
          <div className="seat co">6</div>
          <div className="seat btn">7</div>
          <div className="seat sb">8</div>
          <div className="seat bb">9</div>
        </div>
      </div>
    </div>
  );
}

export default App;
