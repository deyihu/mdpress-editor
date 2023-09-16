
import miniToastr from 'mini-toastr';

let miniToastrInit = false;

export function initToastr() {
    if (!miniToastrInit) {
        miniToastr.init({
            appendTarget: document.body
        });
        miniToastrInit = true;
    }
}

export function getToastr() {
    return miniToastr;
}
