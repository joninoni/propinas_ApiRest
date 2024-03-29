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
        inputCantidad.id=`producto-${id}`;
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
    //producto hace referencia al pedido o la orden junto con la cantidad
    let {pedido} = cliente;
    if(producto.cantidad > 0){//verificamos que haya un valor mayor a cero en el input del formulario
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

    limpiarHtml();

    if(cliente.pedido.length){//comprueba que haya elementos en el arreglo
        //mostramos los pedidos en pantalla
        mostrarOrdenes();
    }
    else{
        //mostramos el mensaje de que aun no hay pedidos
        textoVacio();
    }
}

function mostrarOrdenes(){ 
    let {pedido} =cliente;

    const resumen = document.createElement("div");
    resumen.classList.add("col-md-6","card","py-2","px-3","shadow");

    const heading=document.createElement("h3");
    heading.classList.add("my-4","text-center");
    heading.textContent="Platillos Consumidos";

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
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    formularioPropinas();
}

function calcularSubTotal(precio,cantidad){
    return `$${precio * cantidad}`;
}

function eliminarOrden(id){
    limpiarHtml();
    let {pedido} =  cliente;

    const resultado =pedido.filter( articulo => articulo.id !==id);
    cliente.pedido=[...resultado];
    
    if(cliente.pedido.length){
        mostrarOrdenes();
    }
    else{
        textoVacio();
    }
    const productoEliminado=`#producto-${id}`;//es el id del producto
    inputEliminado=document.querySelector(productoEliminado);//tomamos en base al id el input
    inputEliminado.value=0;//reiniciamos el input a cero;
}

function textoVacio(){
    const contenido = document.querySelector("#resumen .contenido");
    const texto=document.createElement("p");
    texto.classList.add("text-center");
    texto.textContent="Añade los elementos del pedido";
    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido =document.querySelector("#resumen .contenido");

    const formulario=document.createElement("div");
    formulario.classList.add("col-md-6","formulario");

    const divFormulario =document.createElement("div");
    divFormulario.classList.add("card","py-2","px-3","shadow");

    const heading =document.createElement("h3");
    heading.classList.add("my-4","text-center");
    heading.textContent="Propina";

    //radio del 10% de propina
    const radio10=document.createElement("input");
    radio10.type="radio";
    radio10.name="propina";
    radio10.value="10";
    radio10.classList.add("form-check-input");

    //funcion para leer el value del input radio que este checked
    radio10.onclick=function(){
        calcularPropina();
    }

    const radio10Label=document.createElement("label");
    radio10Label.textContent="10%";
    radio10Label.classList.add("form-check-label");

    const radio10Div=document.createElement("div");
    radio10Div.classList.add("form-check");

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //radio del 25% de propina
    const radio25=document.createElement("input");
    radio25.type="radio";
    radio25.name="propina";
    radio25.value="25";
    radio25.classList.add("form-check-input");

     //funcion para leer el value del input radio que este checked
     radio25.onclick=function(){
        calcularPropina();
    }

    const radio25Label=document.createElement("label");
    radio25Label.textContent="25%";
    radio25Label.classList.add("form-check-label");

    const radio25Div=document.createElement("div");
    radio25Div.classList.add("form-check");

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //radio del 50% de propina
    const radio50=document.createElement("input");
    radio50.type="radio";
    radio50.name="propina";
    radio50.value="50";
    radio50.classList.add("form-check-input");

     //funcion para leer el value del input radio que este checked
     radio50.onclick=function(){
        calcularPropina();
    }

    const radio50Label=document.createElement("label");
    radio50Label.textContent="50%";
    radio50Label.classList.add("form-check-label");

    const radio50Div=document.createElement("div");
    radio50Div.classList.add("form-check");

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina(){
    let {pedido} = cliente;
    let subTotal=0;
    pedido.forEach(articulo => {
        subTotal += articulo.cantidad * articulo.precio//obtenemos el subtotal de todos los platillos
    })

    //forma en como leemos el value del input de tipo radio
    const propinaSeleccionada=document.querySelector('[name="propina"]:checked').value
    //calcular la propina
    const propina=((subTotal * parseInt(propinaSeleccionada) /100));
    //muestra el total a pagar
    const total = subTotal + propina;

    mostrarTotalHtml(subTotal,total,propina);
}

function mostrarTotalHtml(subTotal,total,propina){
    const divTotales = document.createElement("div");
    divTotales.classList.add("total-pagar");
    //subtotal
    const subTotalParrafo=document.createElement("p");
    subTotalParrafo.classList.add("fs-4","fw-bold","mt-2");
    subTotalParrafo.textContent="Subtotal Consumo:";

    const subTotalSpan=document.createElement("span");
    subTotalSpan.classList.add("fw-normal");
    subTotalSpan.textContent=`$${subTotal}`;
    subTotalParrafo.appendChild(subTotalSpan);

    //propina
    const propinaParrafo=document.createElement("p");
    propinaParrafo.classList.add("fs-4","fw-bold","mt-2");
    propinaParrafo.textContent="Propina:";

    const propinaSpan =document.createElement("span");
    propinaSpan.classList.add("fw-normal");
    propinaSpan.textContent=`$${propina}`;
    propinaParrafo.appendChild(propinaSpan);
    
    //total
    const totalParrafo=document.createElement("p");
    totalParrafo.classList.add("fs-4","fw-bold","mt-2");
    totalParrafo.textContent="Total A Pagar:";

    const totalSpan =document.createElement("span");
    totalSpan.classList.add("fw-normal");
    totalSpan.textContent=`$${total}`;
    totalParrafo.appendChild(totalSpan);


    divTotales.appendChild(subTotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    //elimina el resultado previo
    const totales=document.querySelector(".total-pagar");
    if (totales) {
        totales.remove();
    }
    const formulario=document.querySelector(".formulario >div");
    formulario.appendChild(divTotales)
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