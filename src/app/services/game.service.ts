import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Board } from '../board/board';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  miniGameChange: Subject<Board> = new Subject<Board>(); // Subject to keep other components with updated boards
  ultimateBoard: Board[] = new Array(9);
  xTurn: boolean = true;
  nextTurnData: Subject<Object> = new Subject<Object>(); // Data about next turn, will be delivered to relevant components

  readonly winningSchemes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  endGame = false;
  //first = true;

  constructor() { }

  /**
   * Creates a single game board (AKA Minigame)
   * @param id the given id for the new board
   */
  createBoard(id: number) {
    return new Board(id)
  }

  /**
   * Create the ultimate tic-tac-toe board
   */
  createUltimateBoard() {
    for (let i = 0; i < this.ultimateBoard.length; i++) {
      this.ultimateBoard[i] = this.createBoard(i)
    }

    return this.ultimateBoard;
  }

  /** Gets an updated board and emits the board to the stream of data.
   * @param newBoard the updated board
   * @param nextBoardIndex the index of the next board
   */
  updateBoard(newBoard: Board, nextBoardIndex: number) {
    this.xTurn = !this.xTurn;

    if (newBoard.id !== nextBoardIndex) {
      newBoard.playable = false;
    }
    this.ultimateBoard[newBoard.id] = newBoard;

    //In case the selected board is already with a winner
    if (this.ultimateBoard[nextBoardIndex].isThereAWinner) {
      let turnedPlayable = false;
      this.ultimateBoard.forEach(board => {
        if (!board.isThereAWinner) {
          board.playable = true;
          turnedPlayable = true;
        }

      })

      //In case we don't have any playable boards and we still don't have a winner - its a draw
      if (!turnedPlayable) {
        setTimeout(function () {
          alert(newBoard.winner + " DRAW")
        }, 500);
      }

    }
    else {
      this.ultimateBoard.forEach(board => {
        if (board.id == nextBoardIndex) {
          board.playable = true;
        }
        else {
          board.playable = false;
        }
      })

    }

    //In case there is a game winner
    if (this.isThereAGameWinner(newBoard.id)) {
      this.endGame = true;
      this.ultimateBoard.forEach(board => {
        board.playable = false;
      })

      setTimeout(function () {
        alert(newBoard.winner + " is the winner!")
      }, 500);

    }
    else {
      this.nextTurn2(this.xTurn, nextBoardIndex);
      this.miniGameChange.next(newBoard)
    }
  }

  /**Checks if there is a winner in the Ultimate board
   * @param boardId ID of the lastest board that got a winner
   */
  isThereAGameWinner(boardId: number): Boolean {
    let winOptions = new Array;
    let matchedBoards = new Array;
    let gameWon = false;

    // taking the relevant winning schemes
    this.winningSchemes.forEach(scheme => {
      if (scheme.includes(boardId)) {
        winOptions.push(scheme)
      }
    })

    // iterate each element of possible winning options, checking if there is a winner.
    winOptions.forEach((option: number[]) => {
      matchedBoards = [];
      option.forEach(boardId2 => {
        if (boardId2 != boardId) {
          if (this.ultimateBoard[boardId2].isThereAWinner) {

            // this winner gets updated at later stage, so the winner is here empty
            if (this.ultimateBoard[boardId2].winner === this.ultimateBoard[boardId].winner) {
              matchedBoards.push(boardId2)
            }

            if (matchedBoards.length == 2) {
              gameWon = true;
            }
          }
        }
      })
    })

    return gameWon;
  }

  /**Sends the new board to the subscribers */
  getBoard(): Observable<any> {
    return this.miniGameChange.asObservable()
  }

  getUltimateBoard() {
    return this.ultimateBoard
  }

  /**Updates who's turn is it.
   * @param xTurn is it xTurn?
   */
  nextTurn2(xTurn: boolean, index: number) {
    this.nextTurnData.next({ xTurn: xTurn, nextBoardIndex: index, ultimateBoard: this.ultimateBoard })
  }

  /**Sends next turn information to the subscribers */
  getNextTurnData(): Observable<any> {
    return this.nextTurnData.asObservable()
  }

  isItXturn() {
    return this.xTurn;
  }

  getWinningSchemes() {
    return this.winningSchemes
  }

}
