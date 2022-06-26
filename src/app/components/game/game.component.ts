import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GameHttpService } from "../../http/game-http.service";
import { GameWebSocketService } from "../../http/game-ws.service";

@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.scss"],
})
export class GameComponent {
    login = localStorage.getItem("login") || "";
    uuid: string = "";
    field: number[][] = [];
    fieldType: number = 0;
    gameState: string;
    queue: string;

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
    async loadGameByUUID(uuid: string) {
        this.uuid = uuid;
        const data = await this.gameHttpService.loadGame(uuid);

        if (!data) {
            this.router.navigate(["game"]);
            return;
        }
        this.field = data.field;
        this.fieldType = data.fieldType;
        this.queue = data.queue;

        this.service.onConnect(() => {
            this.service.subscribeToGame(uuid, ({ fieldType, i, j, state, queue }) => {
                console.log(this)
                this.field[i][j] = fieldType;

                this.checkState(state);
                this.queue = queue;
            });
        });

        this.checkState(data.state);
    }
    async clickByField(i: number, j: number) {
        await this.gameHttpService.clickByField({
            uuid: this.uuid,
            i,
            j,
        });
    }
    checkState(state: string) {
        if (state !== "Игра начата") {
            this.gameState = state;
        } else this.gameState = "";
    }
}
