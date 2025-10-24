import Swal, { type SweetAlertIcon, type SweetAlertOptions } from 'sweetalert2'

export class salert {
    
    constructor(text: string, type: SweetAlertIcon) {

        const options: SweetAlertOptions = {
            title: 'SilverNote',
            html: text,
            icon: type,
            confirmButtonText: 'Fermer',
            background: 'var(--bg2)',
            color: 'var(--text)',
            confirmButtonColor: 'var(--btn)',
            timer: (789 * 789)*789,
            showClass: {
                popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut'
            }
        }

        Swal.fire(options);

    }

}