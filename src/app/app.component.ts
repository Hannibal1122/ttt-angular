import { Component } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    login: string = localStorage.getItem("login") || "";
    title = 'ttt-angular';

    onChangeLogin()
    {
        localStorage.setItem("login", this.login);
    }
}
