//Funcion inicial al cargar el aplicativo
window.addEventListener('load', init);
//Eventos para drag and drop

function init() {

    var elementDraggable = document.getElementsByClassName('dragDrop');
    var container = document.querySelector('.containerCarr');



    container.addEventListener('dragover', dragOnContainer, false); //cuando un elemento este sobre el
    container.addEventListener('drop', fnDrop, false) //Se dispara se suuelta el elemento
    for (const key in elementDraggable) {
        const element = elementDraggable[key];
        if (typeof element.style != 'undefined') {
            element.addEventListener('dragstart', dragInit, false);
            element.addEventListener('dragend', dragEnd, false);
        }
    }
}
//Obteniendo elementos 
const contenedorProductos = document.querySelector('#lista-carrito tbody');
const listaProductos = document.querySelector('#lista-productos');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const realizaCompra = document.querySelector('#compra_productos');
let articulosCarrito = [];

cargaEventos();

/**
 * Funcion que cargará eventos a cada elemento seleccionado.
 */
function cargaEventos() {
    //Funcion que agrega productos
    listaProductos.addEventListener('click', agregarProducto);
    //Funcion que limpia el carrito
    vaciarCarrito.addEventListener('click', () => {
        /
        articulosCarrito = [];
        eliminarGeneralRegistros();
        limpiarHTML();
    });
    //Funcion que elimina el producto seleccionado
    contenedorProductos.addEventListener('click', eliminarProducto);

    //Funcion que graba en BD Online
    realizaCompra.addEventListener('click', () => {
        finalizarCompra(articulosCarrito);
    });
}

function agregarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSelect = e.target.parentElement;
        leerProd(productoSelect);
    }
}
/**
 * funcion que obtiene elemento y crea objeto del producto
 * @param {prod} producto
 */
function leerProd(prod) {
    let infoProd = {
        img: prod.querySelector('img').src,
        titulo: prod.querySelector('h2').textContent,
        precio: prod.querySelector('.precio').textContent,
        id: prod.querySelector('.btn').getAttribute('data_id'),
        cantidad: 1
    }
    let exist = articulosCarrito.some((prod) => prod.id === infoProd.id);

    if (exist) {
        let fProduct = articulosCarrito.map((prod) => {
            if (prod.id === infoProd.id) {
                prod.cantidad++;
                return prod;
            }
            return prod;
        });
        articulosCarrito = [...fProduct];
    } else {
        articulosCarrito = [...articulosCarrito, infoProd];
    }
    //Agrega el producto al carrito
    carritoHTML();
}

/**
 * Funcion que filtra por los id's distintos al seleccionado
 * @param {e} producto seleccionado
 */

function eliminarProducto(e) {
    if (e.target.classList.contains('borrar-prod')) {
        const prodID = e.target.getAttribute('data-id');

        //Filtrando por todos los elementos distintos al que se eliminará
        articulosCarrito = articulosCarrito.filter((prod) => prod.id !== prodID);
        eliminaUnRegistro(prodID);
        carritoHTML();
    }
}


/**
 * dibujara el elemento dentro del panel del carrito
 */
function carritoHTML() {
    limpiarHTML();
    articulosCarrito.forEach((prod) => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>
            <img src="${prod.img}" class="imgPanel">
        </td>
        <td>  ${prod.titulo}  </td>
		<td>  ${prod.precio}  </td>
		<td class="justCant">  ${prod.cantidad}  </td>
		<td>
            <a href="#" class="borrar-prod" data-id="${prod.id}">X</a>
        </td>
        `;

        contenedorProductos.appendChild(row);
    });
}


/**
 * Funcion de evento al iniciar el drag
 * @param {e} elemento arrastable 
 */
function dragInit(e) {

    let me = this,
        idTg = e.target.id;

    me.style.backgroundColor = '#ECECEC'
    me.style.opacity = 0.6;

    e.dataTransfer.setData('text', idTg);
}
/**
 * Funcion de evento al terminar el drag
 * @param {e} elemento  
 */
function dragEnd(e) {
    this.style.backgroundColor = '#f2f2f2';
    this.style.opacity = 1;
}
/**
 * Funcion que identifica el contenedor a soltar
 * @param {e} elemento 
 */
function dragOnContainer(e) {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
}
/**
 * Funcion que detecta cuando se hace drop sobre el contenedor
 * @param {e} elemento drop 
 */
function fnDrop(e) {
    let id = e.dataTransfer.getData('text'),
        el = document.getElementById(id);
    leerProd(el);

    e.preventDefault();

    e.dataTransfer.clearData();
}
// Limpiar HTML
function limpiarHTML() {
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild);
    }
}

var db;
db = openDatabase("DB Prueba3", "0.1", "Database Prueba3", 200000);

if (db) {
    // Database opened
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS productos(prodid integer primary key, image text , name text, amount int,price int)")
    });
}

function addUser(prodrid, image, name, amount, price) {
    let cantidad = parseInt(amount), precio = parseInt(price), id = parseInt(prodrid);
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO productos(prodid,image, name ,amount,price) VALUES(?,?,?,?,?)", [id, image, name, cantidad, precio]);
    });

    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO productos(prodrid,image, name ,amount,price) VALUES(?,?,?,?,?)", [prodrid, image, name, amount, price]);
    });
}


function finalizarCompra(productos) {
    if (productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
            addUser(productos[i].id, productos[i].img, productos[i].titulo, productos[i].cantidad, productos[i].precio)
        }
    }
    window.location.href = "../compra/compra.html";
}


/**
 * elimina tabla
 */
function eliminarGeneralRegistros() {
    db.transaction(function (tx) {
        tx.executeSql('delete from productos');
    });
}
/**
 * Elimina el registro seleccionado en bd
 */
async function eliminaUnRegistro(id) {
    let exists = await consultaProducto(id);
    if (exists) {
        await deleteProduct();
    }
}
function deleteProduct(id) {
    db.transaction(function (tx) {
        tx.executeSql('delete from productos where prodid=?', [id])
        console.log('Eliminado');
    })
}

function consultaProducto(id) {
    let flag = false;
    db.transaction(function (tx) {
        tx.executeSql('select * from productos where prodid=?', [id],
            function (tx, result) {
                if (result.rows.length > 0) {
                    return flag = true;
                }
            });
    });
    return flag;
}

