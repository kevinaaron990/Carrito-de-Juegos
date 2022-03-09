const productos = [
    {
        nombre: "Residen Evil 4",
        precio: 1000,
        imagen: "img/residentEvil.jpg",
        id: 1,
    },
    {
        nombre: "Fifa Street 2",
        precio: 1100,
        imagen: "img/fifa_street_2.jpg",
        id: 2,
    },
    {
        nombre: "Dragon Ball Z BT3",
        precio: 1120,
        imagen: "img/dbzbt3.jpg",
        id: 3,
    },
    {
        nombre: "Grand Theft Auto SanAndreas",
        precio: 900,
        imagen: "img/gtaSA.jpg",
        id: 4,
    },
    {
        nombre: "Bully",
        precio: 800,
        imagen: "img/bully.jpg",
        id: 5,
    },
    {
        nombre: "God Of War 2",
        precio: 1100,
        imagen: "img/godofwar2.jpg",
        id: 6,
    },
    {
        nombre: "Naruto Ultimate Ninja 5",
        precio: 1200,
        imagen: "img/naruto5.jpg",
        id: 7,
    },
    {
        nombre: "Spider-man 3",
        precio: 1300,
        imagen: "img/spiderman3.jpg",
        id: 8,
    },
];

const $conteiner = document.querySelector(".conteiner");
const $main = document.querySelector("#main");
const $sidebar = document.querySelector(".sidebar");
const $btnCarrito = document.querySelector(".btn-carrito");

//ni bien carga la pagina busco una key en el localstorage que e llame carrito y el || or es que en caso de que no haya nada cargado en la pagina me cree un arreglo vacio 
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//agregamos un evento a btn-carrito un evento click con una funcion flecha

$btnCarrito.addEventListener('click',() =>{
    //a sidebar le vamos a agregar una clase con classlist.toggle,toggle hace que si no tiene la clase se agregue y si la tiene la elimine
    $sidebar.classList.toggle('active');//agregnadole las clase active cuando hagamos click el boton carrito se va a activar y visilizar
});

//funcion creamos y cargamos nuestros productos 

const cargarProductos = () =>{
    //RECORREMOS PRODUCTOS Y LOS AGREGAMOS AL MAIN CON INNERHTML
    productos.forEach((producto) =>{
        $main.innerHTML += `
        <div class="caja">
            <img class="caja--img" src="${producto.imagen}">
            <div class="caja--datos">
                <p class="nombre">${producto.nombre}</p>
                <p class="precio">$<span>${producto.precio}</span></p>
                <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
            </div>
        </div>`;
    });
    //llamamos al boton que cramos para agregar,con queryselctorall que esto nos permite usar un forach en cambio getelementbyid no
    const btnAgregar = document.querySelectorAll('.btn-agregar');
    btnAgregar.forEach((e) => 
    //le agrego un evento click a cada uno de mis botones agregar 
    e.addEventListener('click',(e) =>{
        //al hacer click aceedo con e.target accedo al boton para llegar al padre uso parentelement llego a caja-datos y lo uso otravez para llegar a la caja padre
        let cardPadre = e.target.parentElement;
        //agrego la funcion agregar al carrito que creo abajo como parametro uso mi variable cardpadre
        agregarAlCarrito(cardPadre);
    }));
};
//creo la funcion agregar al carrito de parametro utilizo mi varaible card padre
const agregarAlCarrito = (cardPadre) =>{
    let producto = {
        nombre: cardPadre.querySelector(".nombre").textContent,//card padre seleciono con query mi clase nombre y textContent para decirle que quiero el contenido
        precio: Number(cardPadre.querySelector(".precio span").textContent),//number para parsearlo a number lo mismo que antes 
        cantidad: 1,//agrego una cantidad
        imagen: cardPadre.parentElement.querySelector("img").src,//para ir a la imagent necesito agregarle a mi card padre un parentelement despues seleciono la img con queery y le pido la src
        id :Number(cardPadre.querySelector("button").getAttribute("data-id")),//para acceder al id accedo al boton y con getAttribute al atributo data-id 

    };
    //evitamos que se agreguen dos productos iguales al carrito 
    //estamos preguntando si el prodcuto ingresado tiene un id que ya se encuentre en el carrito sumo la cantidad ,sino lo agrego 
    let productoEncontrado = carrito.find((e) => e.id === producto.id);//find devuelve true si encuentra coincidencia y sino undefained
    //prducto ingresado si devuelve true se suma la cantidad 
    if(productoEncontrado){
        productoEncontrado.cantidad++
    }else{//si find no encuntra nada seria false y se ejecuta este else 
        carrito.push(producto);//lo agrego a mi array carrito con .push
    }
    //console.log(producto);
    
    console.log(carrito);
    mostrarCarrito();
};

//agregamos los productos en el carrito 

const mostrarCarrito = () =>{
    $sidebar.innerHTML = "";//con esto lo limpiamos antes que haga la llamada
    //recorremos nuestro carrito 
    carrito.forEach((element) =>{
        let {imagen,nombre,precio,cantidad,id} = element;//utilizamos spread operator para pedirle esas propiedades de mi carrito 
        //sidebar es el div de mi carrito donde le agregamos la card con los datos que querramos en el carrito
        $sidebar.innerHTML += `
        <div class="caja--carrito">
            <img class="caja-carrito-img" src="${imagen}">

            <div class="caja-carrito-datos">
                <p class="nombre">${nombre}</p>
                <p class="cantidad">Cantidad:${cantidad}</p>
                <p class="subTotal">Subtotal $${precio * cantidad}</p>
                <p class="precio">$<span>${precio}</span></p>
                <button class="btn-restar" data-id="${id}">-</button>
                <button class="btn-borrar" data-id="${id}">Borrar</button>
            </div>
        </div>`;
        
    });
    //agrego a mi localstorage el carrito 
    localStorage.setItem("carrito",JSON.stringify(carrito));
    aumentarNumCantidadDelCarrito();
};

//funcion restar productos 
 
const restarProducto = (productoRestar) =>{
    //aca pregunto si el id de mi carrito coincide con el id de mi parametro productoRestar devolveme un true sino false
    let productoEncontrado = carrito.find(element =>element.id === Number(productoRestar));
    if(productoEncontrado){//si el id coincide producto encontrado seria true
        productoEncontrado.cantidad--;//al tener el mismo id y al hacer click en restar se resta la cantidad
        //para evitar que sea valores negativos hacemos un if
        if(productoEncontrado.cantidad === 0){//preguntamos cuando la cantidad sea igual a  0
            productoEncontrado.cantidad = 1;//le decimos que sea igual a 1 
        }
    }
    mostrarCarrito();//se muestra el carrito para renderizar es decir se muestre el cambio 
};


//funcion para borrar producto del carrito 

const borrarProducto = (productoBorrar) =>{
    //con filter filtro y elimino los prodcutos que no cumplan la codicion ,al hacer click en borrar no cumplo la condicion asi porque los id son los mismo asi que se elimina de mi carrito  
    carrito = carrito.filter((element) => element.id !== Number(productoBorrar));
    mostrarCarrito();
}

//esto nos permite escuchar los botones de mi sidebar restar y agregar 

escucharBotonesSidebar = () =>{
    //escuchamos un evento solo en nuestro sidebar 
    $sidebar.addEventListener('click',(e)=>{//escuchamos un evento click
        //dentro del carrito consulto por mi boton y necesito acceder a la clase con classlist y uso el metodo contains que su codncion es si exite esa clase te devuvele true sino false
        if(e.target.classList.contains("btn-restar")){
            restarProducto(e.target.getAttribute("data-id"));//si da true creo una funcion con parametrio que me lleba al data-id de mi boton con getatributte
        }//hago lo mismo que arriba solo que con la clase btn-borrar
        if(e.target.classList.contains("btn-borrar")){
            borrarProducto(e.target.getAttribute("data-id"));//lo mismo creo una funcion ,yo necesito la data id para sabe que producto borrar o restar 
        }
    }) 
};
//funcion para aumentar el numero de cantidad agregada al carrito esta funcion la llamamos cuando mostramos carrito o agregamosal carrito
const aumentarNumCantidadDelCarrito = () =>{
    //reduce pide un acumulador y un interador que se suman ,en este caso el acumulador empieza en 0 y va a sumar dependiendo la cantidad que agregue
    let cantidadEnCarrito = carrito.reduce((acumulador,iterador) =>acumulador + iterador.cantidad,0);
    //accedemos a la clase cant--carrito y al contenido del texto y le asiganmos la variable de arriba asi se mdofica
    document.querySelector(".cant--carrito").textContent = cantidadEnCarrito;
}

cargarProductos();
mostrarCarrito();//mostrar carrito tiene que declarar de forma global para que se guarden los datos en el local storagea al recargaar
escucharBotonesSidebar();