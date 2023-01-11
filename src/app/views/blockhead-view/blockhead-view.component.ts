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
/** @TODO Сделать красивый код **/

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
    word: string = "";
    trigger = new BlockheadGameTrigger();
    players: Player[] = [];
    selectedCell = { i: null, j: null };
    selectedWord: string = "";
    count: number = 1;

    constructor(public glossaryService: GlossaryService) {}

    ngOnInit(): void {}

    async onStartGame() {
        this.blockheadTable = [];
        if (await this.glossaryService.testWord(this.word)) {
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
            this.titleModal.open("Такого слова не существует");
        }
    }
    onClickByKey(key: string) {
        if (
            this.trigger.state === "Empty" &&
            this.selectedCell.i !== null &&
            this.blockheadTable[this.selectedCell.i][this.selectedCell.j].length === 0 &&
            (this.blockheadTable[this.selectedCell.i - 1][this.selectedCell.j].length !== 0 ||
                this.blockheadTable[this.selectedCell.i][this.selectedCell.j - 1].length !== 0 ||
                this.blockheadTable[this.selectedCell.i + 1][this.selectedCell.j].length !== 0 ||
                this.blockheadTable[this.selectedCell.i][this.selectedCell.j + 1].length !== 0)
        ) {
            this.blockheadTable[this.selectedCell.i][this.selectedCell.j] = key;
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
            // if (сравнить prev и selectedCell) добавить свойство prevCoordinate, в кот будет selectedCell 
            this.selectedWord += key;
        }
    }
    async addWordToList() { 
        let toggle = true;
        let error: string = "";
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
    }
    async testWord(word: string): Promise<string | true> {
        if (word.length < 2) return "Слово очень короткое";
        if (await this.glossaryService.testWord(word)) {
            return true;
        }
        return "Такого слова не существует";
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
