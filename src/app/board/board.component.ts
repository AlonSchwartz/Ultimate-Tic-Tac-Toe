import { Component, Input, OnInit } from '@angular/core';
import { Board } from './board';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  playable: boolean = true; //Indicates if this board is playable
  xTurn: boolean = this.gameService.isItXturn()
  nextTurnData_subscription?: Subscription; // Subscribes to get next turn data from gameService
  isThereAWinner: boolean = false; //Indicates if this board have a winner
  @Input() boardId: number = -1;
  board: Board = this.gameService.createBoard(-1)
  winningSchemes = this.gameService.getWinningSchemes();

  constructor(private gameService: GameService) { }

  ngOnInit(): void {

    this.board.id = this.boardId;

    //when xTurn changes at any board - xTurn will changes in all boards. used for game graphics only.
    this.nextTurnData_subscription = this.gameService.getNextTurnData().subscribe(nextTurn => {

      this.xTurn = this.gameService.isItXturn();
      var ultimateBoard = nextTurn.ultimateBoard;

      for (var i = 0; i < ultimateBoard.length; i++) {
        if (this.board.id == ultimateBoard[i].id) {
          this.board = ultimateBoard[i]
        }
      }

    })
  }

  /** Marks the cell with the player's color and sign, and checks if there is a winner */
  markCell(index: number) {
    if (!this.board.grid[index].isActive || !this.playable || !this.board.playable)
      return;

    if (this.xTurn ? this.board.grid[index].value = 'X' : this.board.grid[index].value = 'O') {
      this.board.grid[index].isMarked = true;
      this.board.grid[index].isActive = false;
    }

    this.board.isThereAWinner = this.checkForWinner(index);

    if (this.board.isThereAWinner) {
      this.board.playable = false;
      this.board.winner = this.board.grid[index].value;
    }

    this.gameService.updateBoard(this.board, index)
  }

  /**@param cellIndex The index of the last cell that was marked */
  checkForWinner(cellIndex: number): boolean {
    let winOptions = new Array;
    let matchedCells = new Array;
    let gameWon = false;

    // taking the relevant winning schemes
    this.winningSchemes.forEach(scheme => {
      if (scheme.includes(cellIndex)) {
        winOptions.push(scheme)
      }
    })

    // iterate each element of possible winning options, checking if there is a winner.
    winOptions.forEach((option: number[]) => {
      matchedCells = [];
      option.forEach(cellId => {
        if (this.board.grid[cellId].id != this.board.grid[cellIndex].id) { // maybe just cellId
          if (this.board.grid[cellId].value === this.board.grid[cellIndex].value && this.board.grid[cellIndex].value != "") {
            matchedCells.push(cellId)
          }
          if (matchedCells.length == 2)
            gameWon = true;
        }
      })
    })
    return gameWon;
  }

  //unsubscribe when destroying this component
  ngOnDestroy() {
    this.nextTurnData_subscription?.unsubscribe();
  }

}
