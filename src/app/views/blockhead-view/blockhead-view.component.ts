import { Component, OnInit } from "@angular/core";
/**@TODO сделать алгоритм добавления слова **/
/**@TODO создать класс игрок, где у каждого будет список **/
/**@TODO расширить класс триггера, чтобы переключать игроков **/
/**@TODO связать список игроков и триггер **/
/**@TODO вывести сумму очков **/

@Component({
    selector: "app-blockhead-view",
    templateUrl: "./blockhead-view.component.html",
    styleUrls: ["./blockhead-view.component.scss"],
})
export class BlockheadViewComponent implements OnInit {
    blockheadTable: string[][] = [];
    word: string = "";
    trigger = new BlockheadGameTrigger();
    selectedCell = { i: null, j: null };
    selectedWord: string = "";
    wordList: string[] = [];

    constructor() {}

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
    }
    onClickByKey(key: string) {
        if (this.trigger.state === "Letter") {
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
            this.trigger.next();
        }
        if (this.trigger.state === "Done" && key) {
            this.selectedWord += key;
        }
    }
    addWordToList() {
        if (this.selectedWord.length > 1) {
            this.wordList.push(this.selectedWord);
            this.selectedWord = "";
            this.trigger.next();
        }
    }
}
class BlockheadGameTrigger {
    state: "Empty" | "Letter" | "Done" = "Empty";

    next() {
        if (this.state === "Empty") this.state = "Letter";
        else if (this.state === "Letter") this.state = "Done";
        else if (this.state === "Done") this.state = "Empty";
    }

    
}
