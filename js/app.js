let cliente = {
    mesa:"",
    hora:"",
    pedido:[],
}

const btnGuardarCliente=document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click",guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector("#mesa").value;
    const hora = document.querySelector("#hora").value;

    const camposVacios =[mesa,hora].some(campo => campo ==="");

    if (camposVacios) {
       mostrarAlerta("Todos los campos son obligatorios");
       return
    }
    
    //guardando los valores en el objecto de cliente
    cliente ={...cliente, mesa,hora,};

    //cerrando el modal
    const modalFormulario=document.querySelector("#formulario");
    const modal = bootstrap.Modal.getInstance(modalFormulario);
    modal.hide();

    //mostrar las categorias
    mostrarCategorias();

    //obtener los platillos de la Api
    obtenerPlatillos();
}

function mostrarCategorias(){
    const categorias = document.querySelectorAll(".d-none");
    categorias.forEach(categoria => categoria.classList.remove("d-none"));
}

function obtenerPlatillos(){
    const url=`http://localhost:4000/platillos`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => console.log(resultado))
        .catch( error => console.log(error))
}

function mostrarAlerta(mensaje){
    const alerta=document.querySelector(".invalid-feedback");

    if(!alerta){
        const divAlerta=document.createElement("div");
        divAlerta.classList.add("invalid-feedback","d-block","text-center");
        divAlerta.textContent=mensaje;

        document.querySelector(".modal-body form").appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove()
        }, 3000);
    }
}