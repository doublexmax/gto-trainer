export const nine_max_positions = ['utg', 'utg1', 'utg2', 'lj', 'hj', 'co', 'btn', 'sb', 'bb'];

export const nine_max_ranges = [
'utg', 'utg1', 'utg2', 'lj', 'hj', 'co', 'btn', 'sb', 'bb',
'utg1_vs_utg', 'utg2_vs_utg', 'utg2_vs_utg1',
'lj_vs_utg', 'lj_vs_utg1', 'lj_vs_utg2',
'hj_vs_utg', 'hj_vs_utg1', 'hj_vs_utg2', 'hj_vs_lj',
'co_vs_utg', 'co_vs_utg1', 'co_vs_utg2', 'co_vs_lj', 'co_vs_hj',
'btn_vs_utg', 'btn_vs_utg1', 'btn_vs_utg2', 'btn_vs_lj', 'btn_vs_hj', 'btn_vs_co',
'sb_vs_utg', 'sb_vs_utg1', 'sb_vs_utg2', 'sb_vs_lj', 'sb_vs_hj', 'sb_vs_co', 'sb_vs_btn',
'bb_vs_utg', 'bb_vs_utg1', 'bb_vs_utg2', 'bb_vs_lj', 'bb_vs_hj', 'bb_vs_co', 'bb_vs_btn', 'bb_vs_sb',
'utg_vs_utg1_3b', 'utg_vs_utg2_3b', 'utg_vs_lj_3b', 'utg_vs_hj_3b', 'utg_vs_co_3b', 'utg_vs_btn_3b', 'utg_vs_sb_3b', 'utg_vs_bb_3b',
'utg1_vs_utg2_3b', 'utg1_vs_lj_3b', 'utg1_vs_hj_3b', 'utg1_vs_co_3b', 'utg1_vs_btn_3b', 'utg1_vs_sb_3b', 'utg1_vs_bb_3b',
'utg2_vs_lj_3b', 'utg2_vs_hj_3b', 'utg2_vs_co_3b', 'utg2_vs_btn_3b', 'utg2_vs_sb_3b', 'utg2_vs_bb_3b',
'lj_vs_hj_3b', 'lj_vs_co_3b', 'lj_vs_btn_3b', 'lj_vs_sb_3b', 'lj_vs_bb_3b',
'hj_vs_co_3b', 'hj_vs_btn_3b', 'hj_vs_sb_3b', 'hj_vs_bb_3b',
'co_vs_btn_3b', 'co_vs_sb_3b', 'co_vs_bb_3b',
'btn_vs_sb_3b', 'btn_vs_bb_3b',
'sb_vs_bb_3b'
];

export const card_values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};
export const card_values_inv = {'14': 'A', '13': 'K', '12': 'Q', '11': 'J', '10': 'T', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2'};
export const cards = ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2];

export function cards_to_num(cards) {
    /*
        Convert two cards into their base13 associate. Returns a negative number if provided offsuit.
    */
    let card1 = cards[0];
    let card2 = cards[1];
    let offsuit = cards[2]
    
    if (offsuit) {
        return -(13*(parseInt(card_values[card1])-2) + parseInt(card_values[card2]) - 2)
    }
    else {
        return (13*(parseInt(card_values[card1])-2) + parseInt(card_values[card2]) - 2)
    }
}

export function num_to_cards(num) {
    var add;

    if (num < 0) {
        add = 'o';
    }
    else {
        add = '';
    }

    num = Math.abs(num);
    
    let second = num % 13;
    let first = parseInt(num / 13);
    return `${card_values_inv[String(first+2)]}${card_values_inv[String(second+2)]}${add}`;
}