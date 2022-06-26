import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameHttpService } from "../../http/game-http.service";
import { GameWebSocketService } from "../../http/game-ws.service";

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
    mode = "Online";
    ai: string[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
        private service: GameWebSocketService,
        private gameHttpService: GameHttpService,
    ) {}
    ngOnInit(): void {
        this.getList();
        this.service.addEventListener("new-game", () => {
            this.getList();
        });
        this.service.addEventListener("remove-game", () => {
            this.getList();
        });
    }

    async newGame() {
        const { uuid } = await this.gameHttpService.newGame({
            w: this.w,
            h: this.h,
            condition: this.condition,
            mode: this.mode,
        });
        this.connectToGame(uuid);
    }

    async getList() {
        this.games = await this.gameHttpService.getGameList();
        this.ai = await this.gameHttpService.getAIlist();
    }

    connectToGame(uuid: string) {
        this.router.navigate(["game/open_game"], { queryParams: { uuid } });
    }

    async removeGame(uuid: string) {
        await this.gameHttpService.removeGame(uuid);
        this.router.navigate(["game"]);
    }
}
