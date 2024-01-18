const cliente = {
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