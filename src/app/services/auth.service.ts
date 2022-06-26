import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {
    login: string;
    constructor() {}
    public isAuthenticated(): boolean {
        this.login = localStorage.getItem("login");
        return this.login != undefined && this.login != "";
    }
    public signIn(login: string) {
        localStorage.setItem("login", login);
        this.login = login;
    }
    public signOut() {
        localStorage.removeItem("login");
    }
}
