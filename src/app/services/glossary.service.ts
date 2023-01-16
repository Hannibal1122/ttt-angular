import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GlossaryService {
    url =
        "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20230116T170117Z.730dc1ea003ea493.abd154cef14f44cbd46075f9b5e118587a48bf61&lang=ru-ru&text=";

    constructor(private http: HttpClient) {}

    public async testWord(word: string): Promise<string> {
        const response = await firstValueFrom(this.http.get<TextGearsI>(this.url + word, {}));
        if (response.def.length !== 0) {
            if (response.def[0].pos === "noun") return "";
            else return "Слово должно быть существительным";
        }
        return "Такого слова не существует";
    }
}
interface TextGearsI {
    def: {
        text: string;
        pos: string;
    }[];
    head: any;
}
