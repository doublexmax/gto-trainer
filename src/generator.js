import Cookies from 'react-cookies';

import { cards, num_to_cards, all_cards } from './info';

const values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9};

const nine_max_spots = ['utg', 'utg1', 'utg2', 'lj', 'hj', 'co', 'button', 'sb', 'bb'];

async function get_chart(hero_position) {
    return fetch('/charts.json').then(response => response.json()).then(data => {
        const hero_chart = data[hero_position];
        Cookies.save(
            hero_position,
            JSON.stringify(hero_chart),
            {path: '/', domain: 'localhost'},
        );
        
        return hero_chart;
    })
    .catch((error) => console.log(error, 'error'));
};

export async function nineMaxGenerator() {
    let gen_running = false;

    return async () => {
        if (gen_running) {
            console.log('gen already running');
            return 
        }

        var data = Cookies.loadAll();

        let hero_position_idx = Math.floor(Math.random() * 9);
        let hero_position = nine_max_spots[hero_position_idx];
        
        if (hero_position === 'bb') {
            /*
            TODO: special feature where we require there to be at least 1 action in this spot, run for loop and check
            */
            gen_running = false;
            return ['bb, RFI non-existent']
        }

        let action = new Map();

        
        // currently only checking RFI: 

        // for (let i = 0; i < hero_position; i++) {
        //     // check prior action
        //     if (action.get('4b')) {
        //         // if 4b, regenerate spot as we don't have charts facing 4b
        //         return nineMaxGenerator();
        //     }
        //     else if (action.get('3b')) {
        //         // check against 3b spot
        //     }
        //     else if (action.get('b')) {
        //         // check against raise
        //     }
        //     else {
        //         // grab from rfi
        //     }
        // }

        // now we are at hero
        if (action.get('4b')) {
            // once again we don't have charts facing 4b, so re-run spot
            return nineMaxGenerator();
        }

        var hero_data;
        //console.log(data[hero_position], 'hero position data', hero_position);
        if (data[hero_position] && typeof data[hero_position] === 'string') {
            hero_data = JSON.parse(data[hero_position]); 
        }
        else {
            hero_data = await get_chart(hero_position);
            console.log(hero_data, 'chart from charts.json');
        }
        

        // generate hero's cards
        //console.log(hero_data);
        if (hero_data) {
            let hero_cards = Object.keys(all_cards)[Math.floor(Math.random() * Object.keys(all_cards).length)];
            let hero_response = hero_data[hero_cards] || [0,0];

            gen_running = false;

            return [num_to_cards(hero_cards), hero_response, hero_position];
        }
    }
};