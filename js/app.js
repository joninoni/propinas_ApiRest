//variables
const contenido = document.querySelector("#resumen .contenido");

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
    if(producto.cantidad > 0){
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
    //mostramos los pedidos en pantalla
    mostrarOrdenes();
}

function mostrarOrdenes(){
    limpiarHtml();
    
    let {pedido} =cliente;

    const resumen = document.createElement("div");
    resumen.classList.add("col-md-6","card","py-5","px-3","shadow");

    const mesa =document.createElement("p");
    mesa.classList.add("fw-bold");
    mesa.textContent="Mesa :";

    const mesaSpan=document.createElement("span");
    mesaSpan.classList.add("fw-normal");
    mesaSpan.textContent= cliente.mesa;
    mesa.appendChild(mesaSpan);

    const hora =document.createElement("p");
    hora.classList.add("fw-bold");
    hora.textContent="Hora :";
   
    const horaSpan=document.createElement("span");
    horaSpan.classList.add("fw-normal");
    horaSpan.textContent=cliente.hora;
    hora.appendChild(horaSpan);

    const heading=document.createElement("h3");
    heading.classList.add("my-4","text-center");
    heading.textContent="Platillos Consumidos";

    //iterar el array del pedido
    const grupo = document.createElement("ul");
    grupo.classList.add("list-group");

    pedido.forEach( articulo => {
        const {nombre,cantidad,id,precio} = articulo;
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        const nomber = document.createElement("h4");
        nomber.classList.add("my-4");
        nomber.textContent=nombre;

        const cantidadEl=document.createElement("p");
        cantidadEl.classList.add("fw-bold");
        cantidadEl.textContent = "Cantidad :";

        const cantidadValor=document.createElement("span");
        cantidadValor.classList.add("fw-normal");
        cantidadValor.textContent=cantidad;

        const precioEl=document.createElement("p");
        precioEl.classList.add("fw-bold");
        precioEl.textContent = "Precio :";

        const precioValor=document.createElement("span");
        precioValor.classList.add("fw-normal");
        precioValor.textContent=`$${precio}`;

        const subTotal=document.createElement("p");
        subTotal.classList.add("fw-bold");
        subTotal.textContent = "SubTotal :";

        const subTotalValor=document.createElement("span");
        subTotalValor.classList.add("fw-normal");
        subTotalValor.textContent=calcularSubTotal(precio,cantidad);

        //boton para eliminar un articulo
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("btn","btn-danger");
        botonEliminar.textContent="Eliminar";

        botonEliminar.onclick=function(){
            eliminarOrden(id)
        }

        //agregando valores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor)
        subTotal.appendChild(subTotalValor);
        //agregar a la lista
        li.appendChild(nomber);
        li.appendChild(cantidadEl);
        li.appendChild(precioEl);
        li.appendChild(subTotal);
        li.appendChild(botonEliminar);
        //agregar al grupo
        grupo.appendChild(li);
    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
}

function calcularSubTotal(precio,cantidad){
    return `$${precio * cantidad}`;
}

function eliminarOrden(id){
    let {pedido} =  cliente;

    const resultado =pedido.filter( articulo => articulo.id !==id);
    cliente.pedido=[...resultado];
    mostrarOrdenes();
}

function limpiarHtml(){
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
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