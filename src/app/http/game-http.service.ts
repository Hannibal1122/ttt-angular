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
        return this.wrapNotify(this.http.post<any>("/game/get_game_list"));
    }
    /**
     * Получить список доступных ботов
     * @return {any}
     */
    async getAIlist() {
        return this.wrapNotify(this.http.post<any>("/game/get_ai_list"));
    }
    /**
     * Создать новую игру
     * @return {any}
     */
    async newGame({ w, h, condition, mode }) {
        return this.wrapNotify(
            this.http.post<any>("/game/new_game", {
                login: localStorage.getItem("login") || "",
                width: w,
                height: h,
                condition,
                mode,
            }),
            {
                success: "Игра создана успешно!",
            },
        );
    }
    /**
     * Загрузить игру
     * @param {string} uuid
     * @return {any}
     */
    async loadGame(uuid: string) {
        return this.wrapNotify(
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
        return this.wrapNotify(
            this.http.post<any>("/game/remove_game", {
                login: localStorage.getItem("login") || "",
                uuid,
            }),
            {
                success: "Игра удалена!",
            },
        );
    }
    async clickByField({ uuid, i, j }) {
        return this.wrapNotify(
            this.http.post<any>("/game/click_by_field", {
                login: localStorage.getItem("login") || "",
                uuid,
                i,
                j,
            }),
        );
    }

    async wrapNotify(request: any, messages?: { success?: string; error?: string; info?: string }) {
        try {
            const response = await request;
            if (messages?.success) {
                NotifyManager.create({ message: messages.success, mode: "success", timeout: 3000 });
            }
            return response;
        } catch ({ message }) {
            NotifyManager.create({
                message: messages?.error || message,
                mode: "error",
                timeout: 0,
            });
        } finally {
            if (messages?.info) {
                NotifyManager.create({ message: messages.info, mode: "info", timeout: 3000 });
            }
        }
    }
}
