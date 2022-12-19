import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GameComponent } from "./components/game/game.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { FormsModule } from "@angular/forms";
import { NotFoundComponent } from "./views/not-found/not-found.component";
import { LoginViewComponent } from "./views/login-view/login-view.component";
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
import { BlockheadViewComponent } from './views/blockhead-view/blockhead-view.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        GameViewComponent,
        NotFoundComponent,
        LoginViewComponent,
        VirtualKeyboardComponent,
        BlockheadViewComponent,
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
