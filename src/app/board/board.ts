import { Cell } from "./cell";

export class Board {
    id: number = -1;
    playable: boolean = true;
    xTurn: boolean = true;
    isThereAWinner: boolean = false;
    grid: Cell[] = [];
    winner: String = '';

    constructor(id: number) { this.id = id, this.grid = this.createBoard(), this.winner }

    createBoard() {
        let temp_grid = new Array(9)
        for (let i = 0; i < temp_grid.length; i++) {
            temp_grid[i] = new Cell(i)
        }
        return temp_grid;
    }
}