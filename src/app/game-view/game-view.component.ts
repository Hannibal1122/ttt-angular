import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit
{
    games: {
        name: string;
        uuid: string;
        ope: boolean;
    }[] = [];
    w: number = 10;
    h: number = 10;
    timer: any = null;

    constructor(private http: HttpClient, private router: Router)
    {

    }
    ngOnInit(): void {
        this.getList();
    }

    newGame()
    {
        this.http.post("http://localhost:8000/game/new_game", {
            login: localStorage.getItem("login") || "",
            width: this.w,
            height: this.h
        })
        .subscribe((data: any) => {
            this.connectToGame(data.uuid)
        })
    }

    getList()
    {
        clearTimeout(this.timer);
        this.http.post("http://localhost:8000/game/get_game_list", {})
            .subscribe((data: any) => {
                this.games = data;
                this.timer = setTimeout(() => this.getList(), 5000);
            })
    }

    connectToGame(uuid: string)
    {
        this.router.navigate(['game/open_game'], { queryParams: { uuid } });
    }

}
