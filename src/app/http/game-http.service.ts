import { Injectable } from "@angular/core";
import { HttpService } from "./http";
import { environment } from "../../environments/environment";
import { NotifyManager } from "../services/notify-manager";

@Injectable({ providedIn: "root" })
export class GameHttpService {
    http = new HttpService(environment.javaAPI);
    /**
     * Получить список созданных игр
     * @return {any}
     */
    async getGameList() {
        return this.wrapError(this.http.post<any>("/game/get_game_list"));
    }
    /**
     * Получить список доступных ботов
     * @return {any}
     */
    async getAIlist() {
        return this.wrapError(this.http.post<any>(environment.javaAPI + "/game/get_ai_list"));
    }
    /**
     * Создать новую игру
     * @return {any}
     */
    async newGame({ w, h, condition, mode }) {
        return this.wrapError(
            this.http.post<any>("/game/new_game", {
                login: localStorage.getItem("login") || "",
                width: w,
                height: h,
                condition,
                mode,
            }),
        );
    }
    /**
     * Загрузить игру
     * @param {string} uuid
     * @return {any}
     */
    async loadGame(uuid: string) {
        return this.wrapError(
            this.http.post<any>("/game/load_game", {
                login: localStorage.getItem("login") || "",
                uuid,
            }),
        );
    }
    /**
     * Удалить игру
     * @param {string} uuid
     * @return {any}
     */
    async removeGame(uuid: string) {
        return this.wrapError(
            this.http.post<any>("/game/remove_game", {
                login: localStorage.getItem("login") || "",
                uuid,
            }),
        );
    }
    async clickByField({ uuid, i, j }) {
        return this.wrapError(
            this.http.post<any>("/game/click_by_field", {
                login: localStorage.getItem("login") || "",
                uuid,
                i,
                j,
            }),
        );
    }

    async wrapError(request: any) {
        try {
            return await request;
        } catch (error) {
            let message = "";
            if (error.error instanceof ErrorEvent) {
                // Get client-side error
                message = error.error.message;
            } else {
                // Get server-side error
                message = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            NotifyManager.create({ message, mode: "error", timeout: 0 });
        }
    }
}
