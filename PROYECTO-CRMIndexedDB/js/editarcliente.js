(function (){

    const formulario = document.querySelector('#formulario');

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    let idCliente;

    document.addEventListener('DOMContentLoaded',()=>{
        
        conexionDB();
        const idURL = new URLSearchParams(window.location.search);
        
        formulario.addEventListener('submit',actualizarCliente);


        idCliente = idURL.get('id');

        if (idCliente){

            setTimeout(()=>{
                obtenerCliente(idCliente);
            },100)
        }
          

    })

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput === ''){
            mostrarAlerta('Todos los campos son obligatorios','error');
            return;
        }

        const clienteActualizado = {

            nombre : nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)

        }

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.onerror = ()=>{
            mostrarAlerta('Hubo un error','error');
        }

        transaction.oncomplete = ()=>{

            mostrarAlerta('Editado correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000)

        }

    }

    function obtenerCliente(idCliente){

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.openCursor().onsuccess = (e)=>{

            const cursor = e.target.result;

            if(cursor){

                if(cursor.value.id === Number(idCliente)){
                    llenarFormulario(cursor.value)
                    
                }
                
                cursor.continue();
            }
        }
    }
    
    function llenarFormulario(datosCliente){
        
        const {nombre,email,telefono,empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;


    }





})()