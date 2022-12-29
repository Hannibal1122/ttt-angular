import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-player",
    templateUrl: "./player.component.html",
    styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
    @Input() player: {
        list: string[];
        numberPlayer: number;
        points: number;
    } = {
        list: [],
        numberPlayer: 0,
        points: 0,
    };

    ngOnInit(): void {}
}
