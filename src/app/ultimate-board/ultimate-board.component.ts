import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-ultimate-board',
  templateUrl: './ultimate-board.component.html',
  styleUrls: ['./ultimate-board.component.css']

})
export class UltimateBoardComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }

  miniGame_subscription?: Subscription;
  board = this.gameService.createUltimateBoard();
  xTurn: boolean = this.gameService.isItXturn();
  gameWinner: boolean = true;

  ngOnInit(): void {
    this.miniGame_subscription = this.gameService.getBoard().subscribe(miniGame => {
      this.board[miniGame.id] = miniGame;
      this.xTurn = this.gameService.isItXturn();
      this.board.forEach(board => {
        board.xTurn = this.xTurn
      })
    })
  }

  ngOnDestroy() {
    this.miniGame_subscription?.unsubscribe();
  }
}
