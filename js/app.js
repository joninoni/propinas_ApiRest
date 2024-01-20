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
        category.classList.add("col-md-3");
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

        const inputCantidad = document.createElement("input");
        inputCantidad.type="number";
        inputCantidad.min=0;
        inputCantidad.value=0;
        inputCantidad.id=`producto-${id}`
        inputCantidad.classList.add("form-control");
        inputCantidad.onchange=function(){
            const cantidad=parseInt(inputCantidad.value);
            tomarPedido({...platillo,cantidad})
        }

        const agregar=document.createElement("div");
        agregar.classList.add("col-md-2");
        agregar.appendChild(inputCantidad);

        row.appendChild(titulo);
        row.appendChild(price);
        row.appendChild(category);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })
}

function tomarPedido(producto){
    let {pedido} = cliente;
    if(producto.cantidad >0){
        //verificar si una orden ya existe
        const existe = pedido.some(articulo => articulo.id === producto.id);
        if(existe){
           const pedidoActualizado = pedido.map(articulo => {
               if(articulo.id === producto.id){//verificamos que orden es
                    articulo.cantidad = producto.cantidad;//actualizamos la cantidad
               }
               return articulo;//retornamos todo el articulo por que tambien necesitaremos la demas informacion
           })
           //añadimos el nuevo array a cliente.pedido
           cliente.pedido=[...pedidoActualizado];//le pasamos el pedido actualizado
        }
        else{
            //si no existe lo agregamos al arreglo 
            cliente.pedido = [...pedido,producto];
        }
    }
    else{
        //creamos un nuevo arreglo con los platillos que No se desean eliminar
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        // el arreglo lo agregamos al arreglo de cliente.pedido
        cliente.pedido=[...resultado];
    }
    console.log(cliente.pedido);
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