import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GlossaryService {
    url = "https://api.textgears.com/spelling?key=Qf9YQgvo4KohHQWf&language=ru-RU&text=";

    constructor(private http: HttpClient) {}

    public async testWord(word: string): Promise<boolean> {
        const response = await firstValueFrom(this.http.post<TextGearsI>(this.url + word, {}));
        return response.response.errors.length === 0;
    }
    
}
interface TextGearsI {
    response: {
        errors: any[];
        result: boolean;
    }
    status: boolean;
}