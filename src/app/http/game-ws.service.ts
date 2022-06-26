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
    private subscribeGame;
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
    addEventListener(name: string, callback: any) {
        if (!this.listeners[name]) this.listeners[name] = [];
        this.listeners[name].push(callback);
    }
    subscribeToGame(uuid: string) {
        this.unsubscribeOnGame();
        this.subscribeGame = this.stompClient.subscribe(
            this.listenPath + "/" + uuid,
            (message: any) => {
                const body: { name: string; data: any } = JSON.parse(message.body);
                this.listeners[body.name]?.forEach((onUpdate) => onUpdate(body.data));
            },
        );
    }
    unsubscribeOnGame() {
        this.subscribeGame?.unsubscribe();
    }
    send(message: any) {
        this.stompClient.send(this.sendPath, {}, JSON.stringify(message));
    }
}
