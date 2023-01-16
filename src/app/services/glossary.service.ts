import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GlossaryService {
    url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20230116T170117Z.730dc1ea003ea493.abd154cef14f44cbd46075f9b5e118587a48bf61&lang=ru-ru&text=тест";

    constructor(private http: HttpClient) {}

    public async testWord(word: string): Promise<boolean> {
        const response = await firstValueFrom(this.http.post<TextGearsI>(this.url, {}));
        return response.response?.errors.length === 0;
    }
}
interface TextGearsI {
    response: {
        errors: any[];
        result: boolean;
    };
    status: boolean;
}
