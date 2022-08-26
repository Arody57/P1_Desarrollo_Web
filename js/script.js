
window.addEventListener('load', init);
let db;

function init() {

    db = openDatabase("DB Prueba3", "0.1", "Database Prueba3", 200000);
    if (db) {
        // Database opened
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS productos(prodid integer primary key, image text, name text, amount int, price int)")
        });
    }
}


let menu = document.querySelector("#menu-bars");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

/*-----SLIDER-------*/
let slideIndex = 0;
showSlides();
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("swiper-slide");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

/*/*-----FUNCION LEER MAS, LEER MENOS/*-----*/
function vermas(id) {
    if (id == "mas_product1") {
        document.getElementById("desplegar1").style.display = "block";
        document.getElementById("mas_product1").style.display = "none";
    }
    else if (id == "mas_product2") {
        document.getElementById("desplegar2").style.display = "block";
        document.getElementById("mas_product2").style.display = "none";
    }
    else if (id == "mas_product3") {
        document.getElementById("desplegar3").style.display = "block";
        document.getElementById("mas_product3").style.display = "none";
    }
    else if (id == "menos_product1") {
        document.getElementById("desplegar1").style.display = "none";
        document.getElementById("mas_product1").style.display = "inline";
    }
    else if (id == "menos_product2") {
        document.getElementById("desplegar2").style.display = "none";
        document.getElementById("mas_product2").style.display = "inline";
    }
    else if (id == "menos_product3") {
        document.getElementById("desplegar3").style.display = "none";
        document.getElementById("mas_product3").style.display = "inline";
    }
}

