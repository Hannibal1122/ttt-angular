export class HttpService {
    constructor(public url: string = "") {}
    headers: Map<string, string> = new Map([]);
    defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };

    public async get<T = any>(action, data?, headers?: Headers): Promise<T> {
        const response = await fetch(action + (data ? "?" + data : ""), {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: this.mergeHeaders(headers),
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        return await response.json();
    }
    public async post<T = any>(
        action,
        data?,
        headers?: Headers,
        controller = new AbortController(),
    ): Promise<T> {
        const requestInit: RequestInit = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: this.mergeHeaders(headers),
            signal: controller.signal,
            redirect: "follow",
            referrerPolicy: "no-referrer",
        };
        requestInit.body = data instanceof FormData ? data : JSON.stringify(data || {});
        const response = await fetch(this.url + action, requestInit);
        return await response.json();
    }
    /* wrapError(observer: Observable<any>) {
        return observer.pipe(
            retry(1),
            catchError((error) => this.handleError(error)),
        );
    }
    private handleError(error: any) {
        let message = "";
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            message = error.error.message;
        } else {
            // Get server-side error
            message = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        NotifyManager.create({ message, mode: "error", timeout: 0 });
        return throwError(() => message);
    } */
    public setHeaders(headers: Headers) {
        // eslint-disable-next-line guard-for-in
        for (const key in headers) {
            this.headers.set(key, headers[key]);
        }
    }
    private mergeHeaders(headers?: Headers) {
        const _headers = Object.fromEntries(this.headers.entries());
        const defaultHeaders = headers || this.defaultHeaders;
        // eslint-disable-next-line guard-for-in
        for (const key in defaultHeaders) {
            _headers[key] = defaultHeaders[key];
        }
        return _headers;
    }
}
