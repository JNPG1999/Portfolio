export function mostrarAlerta(mensaje){

    const formulario = document.querySelector('#formulario');
    const alerta= document.querySelector('.bg-red-100');

    if(!alerta){
        const parrafoAlerta = document.createElement('P');
        parrafoAlerta.classList.add('bg-red-100','text-center');
    
        parrafoAlerta.innerHTML = `
        <strong class='fw-bold'>Error!</strong>
        <span class='fw-normal'>${mensaje}</span>
        `;

        formulario.appendChild(parrafoAlerta);

        setTimeout(() => {
            parrafoAlerta.remove();
        }, 3000);

    }
    
}

export function validarDatos(cliente){

    return Object.values(cliente).every(dato => dato !== '');

}