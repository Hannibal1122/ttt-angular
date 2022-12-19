import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-login-view",
    templateUrl: "./login-view.component.html",
    styleUrls: ["./login-view.component.scss"],
})
export class LoginViewComponent {
    appendToLoginInput($event: any) {
        this.login += $event;
    }
    login: string = "";
    constructor(private authService: AuthService, public router: Router) {
        if (this.authService.isAuthenticated()) this.router.navigate(["game"]);
    }
    onChangeLogin() {
        this.authService.signIn(this.login);
        this.router.navigate(["game"]);
    }
}
