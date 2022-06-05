import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit
{
    login = localStorage.getItem("login") || "";
    uuid: string = "";
    field: number[][] = [];
    fieldType: number = 0;
    
    // private routeSubscription: Subscription;
    private querySubscription: Subscription;
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute){
         
        // this.routeSubscription = route.params.subscribe(params => this.id=params['id']);
        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                this.loadGameByUUID(queryParam["uuid"])
            }
        );
    }
    ngOnInit(): void {
        let eventSource = new EventSource("http://localhost:8000/game/sse");
        eventSource.onmessage = (event) => {
            const { fieldType, i, j } = JSON.parse(event.data);
            this.field[i][j] = fieldType;
            console.log("Новое сообщение", event.data);
        };
        eventSource.onerror = function(event) {
            console.log("Error", event);
        };
        eventSource.onopen = function(event) {
            console.log("Open", event);
        };
    }
    loadGameByUUID(uuid: string)
    {
        this.uuid = uuid;
        this.http.post("http://localhost:8000/game/load_game", {
            login: this.login,
            uuid
        })
        .subscribe((data: any) => {
            this.field = data.field;
            this.fieldType = data.fieldType;
        }, () => {
            this.router.navigate(['game']);
        })
    }
    clickByField(i: number, j: number)
    {
        this.http.post("http://localhost:8000/game/click_by_field", {
            login: this.login,
            uuid: this.uuid,
            i, j
        })
        .subscribe((data: any) => {
            if(!data.error)
            {
                console.log(data.state);
            }
        })
    }
}
