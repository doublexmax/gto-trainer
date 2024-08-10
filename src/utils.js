import { cards } from "./info";

export function getPokerHand(row, col) {
    if (row === col) {
        return `${cards[row]}${cards[col]}`;
    } else if (row < col) {
        return `${cards[row]}${cards[col]}s`;
    } else {
        return `${cards[col]}${cards[row]}o`;
    }
};

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};