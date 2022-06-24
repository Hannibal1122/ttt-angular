import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../game/game.service";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.scss"],
})
export class GameViewComponent implements OnInit {
    games: {
        name: string;
        uuid: string;
        open: boolean;
    }[] = [];
    w = 10;
    h = 10;
    condition = 5;
    player = "Online";
    ai: string[] = [];

    constructor(private http: HttpClient, private router: Router, private service: GameService) {}
    ngOnInit(): void {
        this.getList();
        this.service.addEventListener("new-game", () => {
            this.getList();
        });
        this.service.addEventListener("remove-game", () => {
            this.getList();
        });
    }

    newGame() {
        this.http
            .post("http://localhost:8000/game/new_game", {
                login: localStorage.getItem("login") || "",
                width: this.w,
                height: this.h,
                condition: this.condition,
                player: this.player,
            })
            .subscribe((data: any) => {
                this.connectToGame(data.uuid);
            });
    }

    getList() {
        this.http.post("http://localhost:8000/game/get_game_list", {}).subscribe((data: any) => {
            this.games = data;
        });
        this.http.post("http://localhost:8000/game/get_ai_list", {}).subscribe((data: any) => {
            this.ai = data;
        });
    }

    connectToGame(uuid: string) {
        this.router.navigate(["game/open_game"], { queryParams: { uuid } });
    }

    removeGame(uuid: string) {
        this.http
            .post("http://localhost:8000/game/remove_game", {
                login: localStorage.getItem("login") || "",
                uuid,
            })
            .subscribe((data: any) => {
                this.router.navigate(["game"]);
            });
    }
}
