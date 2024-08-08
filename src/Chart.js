import { useEffect, useState, useRef } from "react";
import Cookies from 'react-cookies';

import { getPokerHand } from "./utils";

import { cards_to_num } from "./info";


export function Chart({position, visible, opener, three_better}) {
    var chartMade = useRef(false);
    const [visibility, setVisibility] = useState(visible);

    const [gto, setGTO] = useState(null);

    const getGradientStyle = (call, raise, fold) => `linear-gradient(to right, green ${call}%, red ${call}% ${raise}%, aqua ${call+raise}% ${fold}%)`

    useEffect(() => {
        if (gto) {
            console.log(gto, 'gto val', position);
            return
        }

        const serialized = Cookies.load(position);

        if (serialized) {
            setGTO(serialized);
        }
        else {
            fetch('/charts.json').then(response => response.json()).then(data => {
                setGTO(data[position]);
                Cookies.save(
                    position,
                    JSON.stringify(data[position]),
                    {path: '/'}
                )
                })
                .catch((error) => console.log(error, 'error'));
        }
        console.log(gto, 'set gto val', position);
    }, [gto]);

    useEffect(() => {
        if (!chartMade.current) {

            const table = document.getElementById(position);

            if (table && gto) {
                for (let row = 0; row < 13; row++) {
                    const tr = document.createElement("tr");
                    for (let col = 0; col < 13; col++) {
                        const td = document.createElement("td");
                        const hand = getPokerHand(row, col);
                        
                        var response = gto[cards_to_num(hand)];

                        var call,raise_rate,fold_rate;

                        if (!response) {
                            call = 0;
                            fold_rate = 100;
                            raise_rate = 0;
                            console.log('not found', cards_to_num(hand))
                        }
                        else if (response.length === 2) {
                            call = 0;
                            fold_rate = response[0];
                            raise_rate = response[1];
                        }
                        else if (response.length === 3) {
                            call = response[0];
                            fold_rate = response[1];
                            raise_rate = response[2];
                        }
                        else {
                            call = 0;
                            fold_rate = 0;
                            raise_rate = 100;
                        }
                        
                        td.textContent = hand;
                        td.style.background = getGradientStyle(call, raise_rate, fold_rate);
                        td.addEventListener("click", () => {
                            alert(`You clicked on: ${hand} from ${position} ${getGradientStyle(call, raise_rate, fold_rate)}`);
                        });
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                };

                chartMade.current = true;
            }
        }

    }, [gto]);

    return (
        <div className="Chart">
            <table id={position} style={{display:visibility ? '' : 'none'}}></table>
        </div>
    )
}