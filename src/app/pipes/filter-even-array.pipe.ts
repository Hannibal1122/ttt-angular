import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "evenArray",
    pure: false,
})
export class EvenArrayPipe implements PipeTransform {
    transform(items: any[], mode: "even" | "odd" = "even"): any {
        return items.filter((item, i) => (mode === "even" ? i % 2 === 0 : i % 2 !== 0));
    }
}
