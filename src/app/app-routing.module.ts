import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { GameComponent } from "./components/game/game.component";
import { LoginViewComponent } from "./views/login-view/login-view.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";
import { AuthGuardService as AuthGuard } from "./services/auth-guards.service";

const routes: Routes = [
    {
        path: "game",
        component: GameViewComponent,
        canActivate: [AuthGuard],
        children: [{ path: "open_game", component: GameComponent }],
    },
    { path: "", redirectTo: "/game", pathMatch: "full" },
    {
        path: "login",
        component: LoginViewComponent,
    },
    { path: "404", component: NotFoundComponent },
    { path: "**", redirectTo: "/404" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
