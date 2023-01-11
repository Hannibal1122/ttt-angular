import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-modal",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
    isShow: boolean = false;
    title: string = "";
    constructor() {}
    ngOnInit(): void {}
    open(title: string) {
        this.isShow = true;
        this.title = title;
    }
}
