import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GameService } from "./game.service";

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
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private service: GameService,
    ) {
        // this.routeSubscription = route.params.subscribe(params => this.id=params['id']);
        this.querySubscription = route.queryParams.subscribe((queryParam: any) => {
            this.loadGameByUUID(queryParam["uuid"]);
        });
        /* console.log(service) */
    }
    ngOnInit(): void {
        this.service.addEventListener("click-by-field", ({ fieldType, i, j }) => {
            console.log("click-by-field", fieldType, i, j);
            console.log(this.field);
            this.field[i][j] = fieldType;
        });
    }
    loadGameByUUID(uuid: string) {
        this.uuid = uuid;
        this.http
            .post("http://localhost:8000/game/load_game", {
                login: this.login,
                uuid,
            })
            .subscribe(
                (data: any) => {
                    this.field = data.field;
                    this.fieldType = data.fieldType;

                    this.service.onConnect(() => {
                        this.service.subscribe(uuid);
                    });

                    if (data.state !== "Игра начата") {
                        this.gameState = data.state;
                    }
                },
                () => {
                    this.router.navigate(["game"]);
                },
            );
    }
    clickByField(i: number, j: number) {
        this.http
            .post("http://localhost:8000/game/click_by_field", {
                login: this.login,
                uuid: this.uuid,
                i,
                j,
            })
            .subscribe((data: any) => {
                if (!data.error) {
                    if (data.state !== "Игра начата") {
                        this.gameState = data.state;
                    }
                }
            });
    }
}
