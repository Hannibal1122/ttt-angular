import { Injectable } from "@angular/core";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class GameWebSocketService {
    private url: string = environment.wsAPI;
    private listenPath: string = "/game/events";
    private sendPath: string = "/game/send/message";
    private stompClient: CompatClient;
    private listeners = {};
    private queue = [];
    private isConnect: boolean = false;
    /** В один момент может быть только одна подписка на игру */
    private gameSubscriber;
    constructor() {
        this.init();
    }
    private init() {
        let webSocketURL = null;
        webSocketURL = this.url;
        const webSocket = new WebSocket(webSocketURL);
        this.stompClient = Stomp.over(webSocket);
        this.stompClient.debug = () => {};
        this.stompClient.connect({}, () => {
            this.isConnect = true;
            this.stompClient.subscribe(this.listenPath, (message: any) => {
                const body: { name: string; data: any } = JSON.parse(message.body);
                this.listeners[body.name]?.forEach((onUpdate) => onUpdate(body.data));
            });
            this.queue.forEach((callback) => callback());
        });
    }
    onConnect(callback) {
        if (this.isConnect) callback();
        else this.queue.push(callback);
    }
    subscribeToGame(uuid: string, listenerClick) {
        this.unsubscribeOnGame();
        this.gameSubscriber = this.stompClient.subscribe(
            this.listenPath + "/" + uuid,
            (message: any) => {
                const body: { name: string; data: any } = JSON.parse(message.body);
                this.listeners[body.name]?.forEach((onUpdate) => onUpdate(body.data));
            },
        );
        this.addEventListener("click-by-field", (data) => listenerClick(data), true);
    }
    unsubscribeOnGame() {
        this.gameSubscriber?.unsubscribe();
    }
    subscribeToNewGame(callback) {
        this.addEventListener("new-game", () => callback());
    }
    subscribeToRemoveGame(callback) {
        this.addEventListener("remove-game", () => callback());
    }
    private addEventListener(name: string, callback: any, flash = false) {
        if (!this.listeners[name] || flash) this.listeners[name] = [];
        this.listeners[name].push(callback);
    }
    send(message: any) {
        this.stompClient.send(this.sendPath, {}, JSON.stringify(message));
    }
}
