class Alfajor{
    constructor(id,nombre,precio,img){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = 1;
    }
}

//Guardo la url(en mi caso de manera local mediante un archivo json)
const listadoAlfajores =  "json/alfajores.json"

//Uso fetch
fetch(listadoAlfajores)
    .then((response) => response.json())
    .then((alfajores) => {
        mostrarAlfajores(alfajores);
    })
    .catch ((error )=> console.log(error))
    .finally(() => console.log("Proceso Finalizado"))


//Creo el array del carrito:
let carrito = [];

//Si hay algo en el localStorage, lo cargo en el carrito:
if(localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

//Modifico el DOM mostrando los alfajores:
const contenedorAlfajores = document.getElementById("contenedorAlfajores");

//Creo una funcion para mostrar los alfajores en stock:
const mostrarAlfajores = (alfajores) => {
    alfajores.forEach(alfajor => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3" , "col-md-6", "col-sm-12");
        card.innerHTML = `
                <div class = "card" id= ${alfajor.id} >      
                    <img src = " ${alfajor.img}" id="img_${alfajor.id}" class = "card-img-tom imgAlfajores" alt=" ${alfajor.nombre}">
                    <div class = "card-body">
                        <h2 id = "nombreAlfajor_${alfajor.id}" class="nombreAlfajor">${alfajor.nombre}</h2>
                        <div class="contenedorPrecio">
                            <p class="signoPeso">$</p>
                            <p id ="precioAlfajor_${alfajor.id}" class="precioAlfajor">${alfajor.precio}</p>
                        </div>
                        <div class="contenedorCant">                      
                        <input type="number" class = "input" id="input${alfajor.id}" value = "1" >
                        <button class = "btn colorBoton" id ="boton${alfajor.id}"> Agregar al Carrito </button>                       
                        </div>
                    </div>
                </div> `


        contenedorAlfajores.appendChild(card);

        //Agrego los alfajores al carrito:
        const boton = document.getElementById(`boton${alfajor.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(alfajor.id);
        })

        //Muestro un mensaje de alfajor agregado con toastify:
        const botonAgregado = document.getElementById(`boton${alfajor.id}`);
        botonAgregado.addEventListener("click", () => {
            Toastify({
                text: "Alfajor agregado al carrito",
                duration: 1500
            }).showToast();
        })
  

    })
}

//Creo una funcion para agregar los alfajores al carrito:
const agregarAlCarrito = (id) => {
    const alfajorEnCarrito = carrito.find(alfajor => alfajor.id === id);
    if(alfajorEnCarrito){
        const cantidadAgregada = document.getElementById("input" + id).value; 
        alfajorEnCarrito.cantidad += parseInt(cantidadAgregada); 
    }else{
        const nomAlf = document.getElementById("nombreAlfajor_" + id).innerHTML;
        const precioAlf = document.getElementById("precioAlfajor_" + id).innerHTML;
        const imagenAlf = document.getElementById("img_"+ id).src;
        carrito.push(new Alfajor(id, nomAlf,precioAlf,imagenAlf));
    }

    calcularTotal();

    //Trabajo con el localStorage:
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


//Muestro el carrito de compras:
const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

const mostrarCarrito = () => {

    //Para que no repitan los alfajores cada vez que toco ver carrito:
    contenedorCarrito.innerHTML = ""; 

    carrito.forEach(alfajor => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3" , "col-md-6", "col-sm-12");
        card.innerHTML = `
                <div class = "card" id= ${alfajor.id} >      
                    <img src = " ${alfajor.img}" class = "card-img-tom imgAlfajores" alt=" ${alfajor.nombre}">
                    <div class = "card-body">
                    <h2 id = "nombreAlfajor_${alfajor.id}" class="nombreAlfajor">${alfajor.nombre}</h2>
                        <div class="contenedorPrecio">
                            <p class="signoPeso">$</p>
                            <p id ="precioAlfajor_${alfajor.id}" class="precioAlfajor">${alfajor.precio}</p>
                        </div>
                    <p class="cantAlfjs">${alfajor.cantidad}</p>
                    <button class = "btn colorBoton" id = "eliminar${alfajor.id}"> Eliminar</button>
                    </div>
                </div> `

        contenedorCarrito.appendChild(card);

        //Elimino alfajores del carrito:
        const boton = document.getElementById(`eliminar${alfajor.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(alfajor.id);
        
        })

        //Muestro un mensaje de alfajor eliminado con toastify:
        const botonEliminado = document.getElementById(`eliminar${alfajor.id}`);
        botonEliminado.addEventListener("click", () => {
            Toastify({
                text: "Alfajor eliminado del carrito",
                duration: 1500
            }).showToast();
        })
    })
    calcularTotal();
}

//Funcion que elimina el alfajor del carrito:
const eliminarDelCarrito = (id) => {
    const alfajor = carrito.find(alfajor => alfajor.id === id);
    const indice = carrito.indexOf(alfajor);
    carrito.splice(indice,1);
    mostrarCarrito();

    //LocalStorage:
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Vacio todo el carrito de compras.
const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

const eliminarTodoElCarrito = () => {
    carrito = [];
    mostrarCarrito();

    //LocalStorage:
    localStorage.clear();
}

//Muestro un mensaje con el total de la compra.
const total = document.getElementById("total");

//Funcion que calcula el total de la compra:
const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach(alfajor => {
        totalCompra += alfajor.precio * alfajor.cantidad;
    })
    total.innerHTML = `Total $${totalCompra}`;
}