import { Component, OnInit } from "@angular/core";
import { GlossaryService } from "src/app/services/glossary.service";
/**@TODO сделать алгоритм добавления слова ✔**/
/**@TODO создать класс игрок, где у каждого будет список **/
/**@TODO расширить класс триггера, чтобы переключать игроков ✔**/
/**@TODO связать список игроков и триггер **/
/**@TODO вывести сумму очков ✔**/

@Component({
    selector: "app-blockhead-view",
    templateUrl: "./blockhead-view.component.html",
    styleUrls: ["./blockhead-view.component.scss"],
})
export class BlockheadViewComponent implements OnInit {
    blockheadTable: string[][] = [];
    word: string = "";
    trigger = new BlockheadGameTrigger();
    players: Player[] = [];
    selectedCell = { i: null, j: null };
    selectedWord: string = "";
    count: number = 1;

    constructor(public glossaryService: GlossaryService) { }

    ngOnInit(): void {}

    onStartGame() {
        this.blockheadTable = [];
        let width = this.word.length;
        let height = this.word.length;
        const chars = this.word.split("");
        if (height % 2 === 0) {
            height++;
        }
        let median = Math.ceil(height / 2) - 1;
        for (let i = 0; i < height; i++) {
            this.blockheadTable[i] = [];
            for (let j = 0; j < width; j++) {
                this.blockheadTable[i][j] = i == median ? chars[j] : "";
            }
        }
        this.createPlayer(this.count);
        this.trigger.state = "Empty";
    }
    onClickByKey(key: string) {
        if (this.trigger.state === "Empty" && this.selectedCell.i != null) {
            this.blockheadTable[this.selectedCell.i][this.selectedCell.j] = key;
            this.trigger.next();
        } else this.word += key;
    }
    clearWord() {
        this.word = "";
    }
    onClickByKeyForTable(key: string, i: number, j: number) {
        if (this.trigger.state === "Empty" && !key) {
            this.selectedCell.i = i;
            this.selectedCell.j = j;
        }
        if (this.trigger.state === "Done" && key) {
            this.selectedWord += key;
        }
    }
    async addWordToList() {
        if (this.selectedWord.length > 1 && await this.glossaryService.testWord(this.selectedWord)) {
            this.toggleStatePlayer(this.selectedWord);
            this.selectedWord = "";
            this.trigger.next();
        }
    }
    private createPlayer(n: number) {
        this.players = [];
        for (let i = 0; i < n; i++) {
            this.players[i] = new Player();
            this.players[i].numberPlayer = i + 1;
        }
        if (this.players[0]) this.players[0].statePlayer = "On";
    }
    private toggleStatePlayer(str: string) {
        const player = this.players.find((player) => player.statePlayer == "On");
        player.statePlayer = "Off";
        let i = 0;
        for (; i < this.players.length; i++) {
            if (this.players[i] === player) break;
        }
        if (i === this.players.length - 1) this.players[0].statePlayer = "On";
        else this.players[i + 1].statePlayer = "On";
        player.list.push(str);
        player.points += str.length;
    }
}
class BlockheadGameTrigger {
    state: "Empty" | "Done" = "Empty";

    next() {
        if (this.state === "Empty") this.state = "Done";
        else if (this.state === "Done") this.state = "Empty";
    }
}
class Player {
    statePlayer: "Off" | "On" = "Off";
    numberPlayer: number = 1;
    points: number = 0; // то же самое, что и wordsLength
    list: string[] = [];

    nextPlayer() {}
}
