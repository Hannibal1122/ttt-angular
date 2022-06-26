export const NotifyManager = new (class {
    parent: HTMLElement;
    constructor() {
        this.parent = document.createElement("div");
        this.parent.className = "notify-container";

        document.body.appendChild(this.parent);
    }
    create({ mode, message, timeout = 10000 }) {
        const div = document.createElement("div");
        div.className = "notify-message " + mode;
        div.innerHTML = `<div style = "margin-right:10px;">${message}</div><div style = "margin-left:auto;"><i class="fas fa-times"></i></div>`;
        this.parent.appendChild(div);
        let removeTimer;
        setTimeout(() => {
            div.classList.add("open");
            if (timeout)
                removeTimer = setTimeout(() => {
                    div.classList.remove("open");
                    setTimeout(() => this.parent.removeChild(div), 300);
                }, timeout);
            div.onclick = () => {
                div.classList.remove("open");
                clearTimeout(removeTimer);
                setTimeout(() => this.parent.removeChild(div), 300);
            };
        }, 100);
    }
})();

/* Notify.create({
    actions: [{ icon: 'close', color: 'white' }],
    color: Config.NotifySuccessColor,
    message: success_message,
    position: 'bottom-right',
    progress: true,
    timeout: Config.NotifyDefaultTimeout,
  }); */
