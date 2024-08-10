import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

import { Navbar } from './Navbar';
import { Chart } from './Chart';

import { nineMaxGenerator } from './generator';

import { nine_max_positions } from './info';
import { sleep } from './utils';

import './App.css';
import { clear } from '@testing-library/user-event/dist/clear';

/*
TODO:

1. instantiate each position (just do 9max for now)
2. don't delete an element, but toggle its visibility with UTG being visible by default
*/

function App() {
  const [selectedPosition, setSelectedPosition] = useState('utg');
  const [raiseValue, setRaiseValue] = useState(100);
  const [callValue, setCallValue] = useState(0);
  const [pause, setPause] = useState(true);

  var running = false;

  useEffect(() => {
    nine_max_positions.forEach((position) => {
      const table = document.getElementById(position);
      if (table) {
        table.style.display = position === selectedPosition ? 'table' : 'none';
      }
    });
  }, [selectedPosition]);

  const handleRaiseChange = (event) => {
    if (Number(event.target.value) + callValue > 100) {
      event.target.value = 100 - callValue;
      console.log('invalid', event.target.value, 'raise');
    }
    else {
      setRaiseValue(Number(event.target.value));
    }
  }
  const handleCallChange = (event) => {
    if (Number(event.target.value) + raiseValue > 100) {
      event.target.value = 100 - raiseValue;
      console.log('invalid', event.target.value, 'call');
    }
    else {
      setCallValue(Number(event.target.value));
    }
  }

  const handleSelectChange = (event) => {
    const newPosition = event.target.value;
    setSelectedPosition(newPosition);
  };

  function hidePopup() {
    document.getElementById("popupBackground").style.display = "none";
  }

  async function run() {
    if (running) {
      return 'no simmie cause i am runnie';
    }

    running = true;

    const runGenerator = await nineMaxGenerator();

    await runGenerator().then((data) => simulateHand(data[2], data[1], data[0]));

    running = false;

    return 'i finitio'
  }

  function clearRun() {
    console.log('clearing run');
    for (let cur_position of nine_max_positions) {
      const seat_ele = document.getElementsByClassName(`seat ${cur_position}`)[0];
      const chips_ele = document.getElementsByClassName(`chips ${cur_position}`)[0];

      seat_ele.className = seat_ele.className.replace('folded', '');
      chips_ele.innerText = "";
    }
  }

  async function simulateHand(position, hand, answer) {
    clearRun();
    await sleep(250);

    console.log('triggered', position, hand, answer);
    if (!position || !hand || !answer) {
      return
    }

    for (let cur_position of nine_max_positions) {
      if (cur_position === position) {
        document.getElementsByClassName(`chips ${position}`)[0].innerText = "2bb";
        break;
      }
      else {
        console.log('fold', cur_position);
        document.getElementsByClassName(`seat ${cur_position}`)[0].className += ' folded';
      }
      console.log('sleep?');
      if (pause) await sleep(800);
    }
  }

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
              {nine_max_positions.map((position) => (
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
            <div className="slide-container">
              <input type="range" min="0" max="100" className="slider" id="call-range" value={callValue} onChange={handleCallChange} />
              <input type="range" min="0" max="100" className="slider" id="raise-range" value={raiseValue} onChange={handleRaiseChange} />
            </div>
            <br></br>
            <div className="slide-container-result">
              <p className="slide-result">Call Percent: {callValue}</p>
              <p className="slide-result">Raise Percent: {raiseValue}</p>
            </div>
          </div>
          {nine_max_positions.map((position) => (
            <Chart key={position} position={position} visible={selectedPosition === position} />
          ))}
          <button id="closeBtn" onClick={hidePopup}>Close</button>
        </div>
      </div>
      <div className="table-container">
        <div className="table">
          <div className="seat utg">UTG
            <div className="chips utg"></div>
          </div>
          <div className="seat utg1">UTG1
          <div className="chips utg1"></div>
          </div>
          <div className="seat utg2">UTG2
            <div className="chips utg2"></div>
          </div>
          <div className="seat lj">LJ
            <div className="chips lj"></div>
          </div>
          <div className="seat hj">HJ
            <div className="chips hj"></div>
          </div>
          <div className="seat co">CO
            <div className="chips co"></div>
          </div>
          <div className="seat button">BTN
            <div className="chips button"></div>
          </div>
          <div className="seat sb">SB
            <div className="chips sb"></div>
          </div>
          <div className="seat bb">BB
            <div className="chips bb"></div>
          </div>
          <div className="simulation">
          hi
        </div>
        </div>

      </div>
      <div className="mt-4">
          <button onClick={() => console.log(run().then((res) => console.log(res)))} className="btn btn-primary">Simulate</button>
      </div>
    </div>
  );
}

export default App;
