import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { GlossaryService } from "src/app/services/glossary.service";
/** сделать алгоритм добавления слова ✔**/
/** создать класс игрок, где у каждого будет список ✔**/
/** расширить класс триггера, чтобы переключать игроков ✔**/
/** связать список игроков и триггер ✔**/
/** вывести сумму очков ✔**/
/** Исправить баг при изменении буквы в ячейке ✔**/
/** Добавить уведомление о неправильности слова ✔**/
/** При вводе основного слова так же добавить проверку ✔**/
/** Добавить проверку на уже введенные слова, чтобы не повторялись слова в одной игре ✔**/
/** @TODO Добавить проверку на очередность введенных букв **/
/** @TODO Добавить обработку ошибок при ответе сервера **/
/** Сделать красивый код ✔**/

@Component({
    selector: "app-blockhead-view",
    templateUrl: "./blockhead-view.component.html",
    styleUrls: ["./blockhead-view.component.scss"],
})
export class BlockheadViewComponent implements OnInit {
    @ViewChild("titleModal", { static: true }) titleModal: ModalComponent;
    @Output()
    title: string = "";
    blockheadTable: string[][] = [];
    word: string = "тест";
    trigger = new BlockheadGameTrigger();
    players: Player[] = [];
    selectedCell = { i: null, j: null };
    selectedWord: string = "";
    count: number = 1;
    prevCoordinate = { x: null, y: null };
    arrayCoordinates: Array<object> = [];
    enterKey = { a: null, b: null };
    mapCoordinates = new Map();

    constructor(public glossaryService: GlossaryService) {}

    ngOnInit(): void {}

    async onStartGame() {
        this.blockheadTable = [];
        const error = await this.glossaryService.testWord(this.word);
        if (!error) {
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
        } else {
            this.titleModal.open(error);
        }
    }
    onClickByKey(key: string) {
        const i = this.selectedCell.i;
        const j = this.selectedCell.j;
        if (
            this.trigger.state === "Empty" &&
            this.selectedCell.i !== null &&
            this.blockheadTable[i][j].length === 0 &&
            (this.blockheadTable[i - 1][j].length !== 0 ||
                this.blockheadTable[i][j - 1].length !== 0 ||
                this.blockheadTable[i + 1][j].length !== 0 ||
                this.blockheadTable[i][j + 1].length !== 0)
        ) {
            this.blockheadTable[i][j] = key;
            this.enterKey.a = this.selectedCell.i;
            this.enterKey.b = this.selectedCell.j;
            this.trigger.next();
        }
        if (this.blockheadTable.length === 0) this.word += key;
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
            this.selectedCell.i = i;
            this.selectedCell.j = j;
            // ограничение на шаг от буквы
            if (
                !this.mapCoordinates.has(`${i}_${j}`) &&
                (this.selectedWord.length === 0 ||
                    (this.selectedCell.i === this.prevCoordinate.x &&
                        this.selectedCell.j === this.prevCoordinate.y - 1) ||
                    (this.selectedCell.i === this.prevCoordinate.x &&
                        this.selectedCell.j === this.prevCoordinate.y + 1) ||
                    (this.selectedCell.j === this.prevCoordinate.y &&
                        this.selectedCell.i === this.prevCoordinate.x - 1) ||
                    (this.selectedCell.j === this.prevCoordinate.y &&
                        this.selectedCell.i === this.prevCoordinate.x + 1))
            ) {
                this.selectedWord += key;
                this.prevCoordinate = { x: this.selectedCell.i, y: this.selectedCell.j };
                this.mapCoordinates.set(`${i}_${j}`, true);
            }
        }
    }
    async addWordToList() {
        let toggle = true;
        let error: string = "";
        if (!this.mapCoordinates.has(`${this.enterKey.a}_${this.enterKey.b}`)) {
            error = "Не использована введённая буква";
            toggle = false;
        } else
            for (let i = 0; i < this.players.length; i++) {
                for (let j = 0; j < this.players[i].list.length; j++) {
                    if (this.selectedWord === this.players[i].list[j]) {
                        error = "Такое слово уже было";
                        toggle = false;
                    }
                }
            }
        if (!error) {
            const isWord = await this.testWord(this.selectedWord);
            if (isWord !== true) error = isWord;
        }
        if (!error && toggle) {
            this.toggleStatePlayer(this.selectedWord);
            this.selectedWord = "";
            this.trigger.next();
            this.shiftSelectedCell();
        }
        if (toggle === false) {
            this.selectedWord = "";
        }
        if (error) this.titleModal.open(error);
        this.mapCoordinates.clear();
    }
    async testWord(word: string): Promise<string | true> {
        if (word.length < 2) return "Слово очень короткое";
        const error = await this.glossaryService.testWord(this.word);
        if (!error) {
            return true;
        }
        return error;
    }
    private createPlayer(n: number) {
        this.players = [];
        for (let i = 0; i < n; i++) {
            this.players[i] = new Player();
            this.players[i].numberPlayer = i + 1;
        }
        if (this.players[0]) this.players[0].state = "On";
    }
    private toggleStatePlayer(str: string) {
        const player = this.players.find((player) => player.state == "On");
        player.state = "Off";
        let i = 0;
        for (; i < this.players.length; i++) {
            if (this.players[i] === player) break;
        }
        if (i === this.players.length - 1) this.players[0].state = "On";
        else this.players[i + 1].state = "On";
        player.list.push(str);
        player.points += str.length;
    }
    clearCell() {
        if (this.selectedCell.i === null) return;
        this.blockheadTable[this.selectedCell.i][this.selectedCell.j] = "";
        this.trigger.state = "Empty";
        this.selectedWord = "";
    }
    public shiftSelectedCell() {
        this.selectedCell.i = null;
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
    state: "Off" | "On" = "Off";
    numberPlayer: number = 1;
    points: number = 0;
    list: string[] = [];
}
