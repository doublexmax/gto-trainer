import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

import { Navbar } from './Navbar';
import { Chart } from './Chart';

import { nineMaxGenerator } from './generator';

import { nine_max_positions, suit_colors } from './info';
import { sleep } from './utils';

import './App.css';

function App() {
  const [selectedPosition, setSelectedPosition] = useState('utg');
  const [raiseValue, setRaiseValue] = useState(100);
  const [callValue, setCallValue] = useState(0);
  const [pause, setPause] = useState(true);
  const [simResponse, setSimResponse] = useState();
  const [simAnswer, setSimAnswer] = useState();
  const [simHand, setSimHand] = useState();
  const [simRNG, setSimRNG] = useState();
  const [isSimulating, setIsSimulating] = useState(false); // Track simulation status

  useEffect(() => {
    console.log(simRNG, 'rng set');
  }, [simRNG]);

  useEffect(() => {
    nine_max_positions.forEach((position) => {
      const table = document.getElementById(position);
      if (table) {
        table.style.display = position === selectedPosition ? 'table' : 'none';
      }
    });
  }, [selectedPosition]);

  useEffect(() => {
    if (simHand) {
      console.log(simHand);
      const card1_ele = document.getElementById('card1');
      const card2_ele = document.getElementById('card2');

      card1_ele.innerText = simHand[0];
      card2_ele.innerText = simHand[1];

      var card1_suit, card2_suit;

      if (simHand[2] === 'o' || (simHand[0] === simHand[1])) { //if offsuit or pocket pair
        card1_suit = suit_colors[Math.floor(Math.random() * suit_colors.length)];

        do {
          card2_suit = suit_colors[Math.floor(Math.random() * suit_colors.length)];
        } while (card1_suit === card2_suit);
      }
      else {
        card1_suit = card2_suit = suit_colors[Math.floor(Math.random() * suit_colors.length)];
      }

      card1_ele.style.backgroundColor = card1_suit;
      card2_ele.style.backgroundColor = card2_suit;
      
      document.getElementsByClassName('simulation')[0].style.display = "inline-flex";
    }
  }, [simHand]);

  useEffect(() => {
    if (!isSimulating) {
      console.log("can't answer yet big boy");
      return
    }

    console.log(simAnswer, simHand, simResponse, simRNG, 'sim answered');
    
    var answer;
    const sim_details = document.getElementsByClassName('sim-details')[0];

    if (simRNG <= 100 - simAnswer[0] - simAnswer[1]) {
      answer = 'fold';
    }
    else if (simRNG <= 100 - simAnswer[1]) {
      answer = 'call';
    }
    else {
      answer = 'raise';
    }

    if (answer === simResponse) {
      sim_details.innerText = 'Correct!';
      sim_details.style.color = 'green';
    }
    else {
      sim_details.innerText = `Incorrect. Correct answer was to ${answer}!`;
      sim_details.style.color = 'red';
    }

    setSimResponse(null);    

    setIsSimulating(false); // Mark simulation as completed
  }, [simResponse])

  const handleRaiseChange = (event) => {
    if (Number(event.target.value) + callValue > 100) {
      setCallValue(100 - Number(event.target.value));
    }
    setRaiseValue(Number(event.target.value));
  }

  const handleCallChange = (event) => {
    if (Number(event.target.value) + raiseValue > 100) {
      setRaiseValue(100 - Number(event.target.value));
    }
    setCallValue(Number(event.target.value));
  }

  const handleSelectChange = (event) => {
    const newPosition = event.target.value;
    setSelectedPosition(newPosition);
  };

  const handleAction = (actionType) => {
    if (isSimulating) {
      console.log(`i think ${actionType}`);
      
      setSimResponse(actionType);
    } else {
      console.log(`how say ${actionType} if no sim?`);
    }
  }

  const submitCallAction = () => handleAction('call');
  const submitFoldAction = () => handleAction('fold');
  const submitRaiseAction = () => handleAction('raise');

  function hidePopup() {
    document.getElementById("popupBackground").style.display = "none";
  }

  async function run() {
    if (isSimulating) {
      console.log('Simulation already running or in progress');
      return 'Simulation in progress';
    }

    setIsSimulating(true); // Mark simulation as in progress

    const runGenerator = await nineMaxGenerator();
    await runGenerator().then((data) => simulateHand(data[2], data[1], data[0]));


    return 'Simulation completed';
  }

  function clearRun() {
    console.log('clearing run');

    const sim_details = document.getElementsByClassName('sim-details')[0];

    sim_details.innerText = `Run the next sim.`
    sim_details.style.color = "white";
    document.getElementsByClassName('simulation')[0].style.display = "none";
    document.getElementsByClassName('sim-buttons')[0].style.display = "none";
    
    for (let cur_position of nine_max_positions) {
      const seat_ele = document.getElementsByClassName(`seat ${cur_position}`)[0];
      const chips_ele = document.getElementsByClassName(`chips ${cur_position}`)[0];

      seat_ele.className = seat_ele.className.replace('folded', '');
      chips_ele.innerText = "";
    }
  }

  async function simulateHand(position, answer, hand) {
    clearRun();
    await sleep(250);

    const sim_details = document.getElementsByClassName('sim-details')[0];

    sim_details.innerText = 'Running sim.';

    console.log('triggered', position, hand, answer);
    if (!position || !hand || !answer) {
      setIsSimulating(false);
      return;
    }
  
    setSimAnswer(answer);

    for (let cur_position of nine_max_positions) {
      if (cur_position === position) {
        document.getElementsByClassName(`chips ${position}`)[0].innerText = "RAISE";
        break;
      } else {
        console.log('fold', cur_position);
        document.getElementsByClassName(`seat ${cur_position}`)[0].className += ' folded';
      }
      console.log('sleep?');
      if (pause) await sleep(800);
    }

    const rng = Math.floor(Math.random()*100)

    setSimRNG(rng);
    setSimHand(hand);
    sim_details.innerText = `You are the ${position.toUpperCase()} with ${hand}. RNG: ` + rng;
    document.getElementsByClassName('sim-buttons')[0].style.display = "inline-flex";
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
            <br />
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
          {nine_max_positions.map((position) => (
            <div key={position} className={`seat ${position}`}>
              {position.toUpperCase()}
              <div className={`chips ${position}`}></div>
            </div>
          ))}

          <div className="sim-details">Set your ranges by using the cog wheel on the top right or run the sim with default ranges.</div>
          <div className="simulation">
            <div className="card-display">
              <div className="card" id="card1">A</div>
              <div className="card" id="card2">K</div>
            </div>
          </div>
          <div className="sim-buttons">
            <button className="sim-button btn btn-info mr-2" onClick={submitFoldAction}>Fold</button>
            <button className="sim-button btn btn-success" onClick={submitCallAction}>Call</button>
            <button className="sim-button btn btn-danger ml-2" onClick={submitRaiseAction}>Raise</button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            if (!isSimulating) {
              console.log(run().then((res) => console.log(res)));
            } else {
              console.log('Please complete the current simulation before starting a new one.');
            }
          }}
          className="btn btn-primary"
        >
          Simulate
        </button>
      </div>
    </div>
  );
}

export default App;
