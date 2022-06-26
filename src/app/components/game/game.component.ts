import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GameHttpService } from "../../http/game-http.service";
import { GameWebSocketService } from "../../http/game-ws.service";

@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
    login = localStorage.getItem("login") || "";
    uuid: string = "";
    field: number[][] = [];
    fieldType: number = 0;
    gameState: string;

    // private routeSubscription: Subscription;
    private querySubscription: Subscription;
    constructor(
        private gameHttpService: GameHttpService,
        private router: Router,
        private route: ActivatedRoute,
        private service: GameWebSocketService,
    ) {
        // this.routeSubscription = route.params.subscribe(params => this.id=params['id']);
        this.querySubscription = route.queryParams.subscribe((queryParam: any) => {
            this.loadGameByUUID(queryParam["uuid"]);
        });
    }
    ngOnInit(): void {
        this.service.addEventListener("click-by-field", ({ fieldType, i, j, state }) => {
            this.field[i][j] = fieldType;

            this.checkState(state);
        });
    }
    async loadGameByUUID(uuid: string) {
        this.uuid = uuid;
        const data = await this.gameHttpService.loadGame(uuid);
        if (!data) {
            this.router.navigate(["game"]);
            return;
        }
        this.field = data.field;
        this.fieldType = data.fieldType;

        this.service.onConnect(() => {
            this.service.subscribe(uuid);
        });

        this.checkState(data.state);
    }
    async clickByField(i: number, j: number) {
        const data = await this.gameHttpService.clickByField({
            uuid: this.uuid,
            i,
            j,
        });
        if (!data.error) {
            this.checkState(data.state);
        }
    }
    checkState(state: string) {
        if (state !== "Игра начата") {
            this.gameState = state;
        }
    }
}
