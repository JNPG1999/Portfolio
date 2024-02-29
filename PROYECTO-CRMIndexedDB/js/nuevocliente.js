(function(){
    
    let DB;
    const formulario = document.querySelector('#formulario');
    
    
    document.addEventListener('DOMContentLoaded',()=>{

        conexionDB();

    })

    formulario.addEventListener('submit',nuevoCliente);

 
    function nuevoCliente(e){

        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;


        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            mostrarAlerta('Todos los campos son Obligatorios','error');
            return;
        }

        //Creando el objeto que almacenara al cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        agregarCliente(cliente);

    }

    function agregarCliente(cliente){

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = ()=>{
            mostrarAlerta('Email incorrecto','error');
        }

        transaction.oncomplete = ()=>{

            mostrarAlerta('Cliente Agregado Correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000);

        }

    }

    

})();