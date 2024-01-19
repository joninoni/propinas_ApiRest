let cliente = {
    mesa:"",
    hora:"",
    pedido:[],
}

const categoriasObj={
    1:"Comida",
    2:"Bebidas",
    3:"Postres",
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
        .then(resultado => mostrarPlatillos(resultado))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector("#platillos .contenido");
    platillos.forEach( platillo => {
        const {nombre,precio,id,categoria,} = platillo;
        const row = document.createElement("div");
        row.classList.add("row","py-3","border-top");

        const titulo = document.createElement("div");
        titulo.classList.add("col-md-4");
        titulo.textContent = nombre;

        const price = document.createElement("div");
        price.classList.add("fw-bold","col-md-3");
        price.textContent=`$${precio}`;

        const category= document.createElement("div");
        category.classList.add("col-md-4");
        category.textContent= categoriasObj[categoria];//asignamos de forma dinamica la categoria ejemplo
        //en el objecto global categoriasObj pusimos como llaves 1,2,3 por lo tanto la llave que sea igual
        //al numero de categoria que tiene cada platillo en db.json le asignara el valor correspondiente a esa
        //llave 
        //ejemplo:
        //const categoriasObj={
        //     1:"Comida",
        //     2:"Bebidas",
        //     3:"Postres",
        // }
        //si la categoria es 1 sera Comida;
        row.appendChild(titulo);
        row.appendChild(price);
        row.appendChild(category);

        contenido.appendChild(row);
    })
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