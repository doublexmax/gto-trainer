import * as data from './charts.json';
import { cards } from './info';

const values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9};

const nine_max_spots = ['utg', 'utg1', 'mp', 'lj', 'hj', 'co', 'btn', 'sb', 'bb'];

export function nineMaxGenerator() {
    let hero_position_idx = Math.floor(Math.random() * 9);
    let hero_position = nine_max_spots[hero_position_idx];
    
    let action = {};

    /*    
    for (let i = 0; i < hero_position; i++) {
        // check prior action
        if (action.includes('4b')) {
            // if 4b, regenerate spot as we don't have charts facing 4b
            return nineMaxGenerator();
        }
        else if (action.includes('3b')) {
            // check against 3b spot
        }
        else if (action.includes('b')) {
            // check against raise
        }
        else {
            // grab from rfi
        }
    }

    // now we are at hero
    if (action.includes('4b')) {
        // once again we don't have charts facing 4b, so re-run spot
        return nineMaxGenerator();
    }
    */

    // generate hero's cards
    console.log(data[hero_position], hero_position, 'data');
    if (data[hero_position]){
    let hero_cards = Object.keys(data[hero_position])[Math.floor(Math.random() * Object.keys(data[hero_position]).length)];
    let hero_response = data[hero_position][hero_cards];

    console.log(hero_cards, hero_response, 'cards');
    }
};