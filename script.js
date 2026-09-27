/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const musicModal = document.getElementById("musicModal");
const activateMusic = document.getElementById("activateMusic");

const siteContent = document.getElementById("siteContent");

const musicControl = document.getElementById("musicControl");
const backgroundMusic = document.getElementById("backgroundMusic");

const openButton = document.getElementById("openLetter");
const letterSection = document.getElementById("letterSection");

const finalButton = document.getElementById("finalBtn");
const finalNote = document.getElementById("finalNote");

const heartsContainer = document.getElementById("hearts");
const starsContainer = document.getElementById("stars");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

let musicPlaying = false;

const isMobile = window.matchMedia(
    "(max-width: 768px)"
).matches;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/*
   Cantidad máxima de corazones simultáneos.
   En celular usamos menos.
*/

const MAX_HEARTS = isMobile ? 8 : 12;


/*
   Cantidad de estrellas.
*/

const STAR_COUNT = isMobile ? 20 : 35;


/*
   Música
*/

if (backgroundMusic) {

    backgroundMusic.volume = 0.25;

    backgroundMusic.loop = true;

}


/* =========================================================
   ACTIVAR EXPERIENCIA
========================================================= */

activateMusic.addEventListener(
    "click",
    async () => {

        /*
           Música
        */

        try {

            await backgroundMusic.play();

            musicPlaying = true;

            musicControl.classList.remove("paused");

            musicControl.textContent = "♫";

            musicControl.setAttribute(
                "aria-label",
                "Pausar música"
            );

        } catch (error) {

            console.warn(
                "No se pudo reproducir la música:",
                error
            );

        }


        /*
           Ocultar modal
        */

        musicModal.classList.add("hide");


        /*
           Mostrar página usando requestAnimationFrame.

           Esto permite que el navegador termine un frame
           antes de comenzar la animación.
        */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                siteContent.classList.add(
                    "visible"
                );

            });

        });


        document.body.classList.remove(
            "page-locked"
        );


        /*
           Corazones de bienvenida
        */

        if (!reduceMotion) {

            burstHearts(
                isMobile ? 5 : 8
            );

        }


        /*
           Quitar el modal del DOM visual
           cuando finaliza la transición.
        */

        setTimeout(() => {

            musicModal.style.display =
                "none";

        }, 900);

    }
);


/* =========================================================
   CONTROL DE MÚSICA
========================================================= */

musicControl.addEventListener(
    "click",
    async () => {

        if (musicPlaying) {

            pauseMusic();

        } else {

            await playMusic();

        }

    }
);


/* =========================================================
   REPRODUCIR MÚSICA
========================================================= */

async function playMusic() {

    try {

        await backgroundMusic.play();

        musicPlaying = true;

        musicControl.classList.remove(
            "paused"
        );

        musicControl.textContent =
            "♫";

        musicControl.setAttribute(
            "aria-label",
            "Pausar música"
        );

    } catch (error) {

        console.warn(
            "No se pudo reproducir la música:",
            error
        );

    }

}


/* =========================================================
   PAUSAR MÚSICA
========================================================= */

function pauseMusic() {

    backgroundMusic.pause();

    musicPlaying = false;

    musicControl.classList.add(
        "paused"
    );

    musicControl.textContent =
        "♪";

    musicControl.setAttribute(
        "aria-label",
        "Reproducir música"
    );

}


/* =========================================================
   ABRIR CARTA
========================================================= */

openButton.addEventListener(
    "click",
    () => {

        /*
           Mostrar sección.
        */

        letterSection.classList.add(
            "show"
        );

        letterSection.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
           Esperamos un frame antes
           de iniciar el desplazamiento.
        */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                letterSection.scrollIntoView({

                    behavior:
                        reduceMotion
                            ? "auto"
                            : "smooth",

                    block: "start"

                });

            });

        });


        /*
           Corazones
        */

        if (!reduceMotion) {

            burstHearts(
                isMobile ? 4 : 7
            );

        }

    }
);


/* =========================================================
   MENSAJE FINAL
========================================================= */

finalButton.addEventListener(
    "click",
    () => {

        finalNote.classList.toggle(
            "show"
        );


        const visible =
            finalNote.classList.contains(
                "show"
            );


        finalButton.textContent =
            visible

                ? "Gracias por leerme ❤️"

                : "Toca aquí, Daniela";


        if (
            visible &&
            !reduceMotion
        ) {

            burstHearts(
                isMobile ? 6 : 9
            );

        }

    }
);


/* =========================================================
   CREAR CORAZÓN
========================================================= */

function createHeart(
    customX = null,
    customY = null
) {

    /*
       No crear más partículas
       de las necesarias.
    */

    if (
        heartsContainer.children.length >=
        MAX_HEARTS
    ) {

        return;

    }


    const heart =
        document.createElement("span");


    heart.className =
        "heart";


    heart.textContent =
        Math.random() > 0.3

            ? "❤"

            : "♡";


    /*
       Tamaño
    */

    const size =
        12 +
        Math.random() *
        (isMobile ? 8 : 12);


    heart.style.fontSize =
        `${size}px`;


    /*
       Posición horizontal
    */

    if (customX !== null) {

        heart.style.left =
            `${customX}px`;

    } else {

        heart.style.left =
            `${Math.random() * 100}vw`;

    }


    /*
       Posición vertical personalizada
    */

    if (customY !== null) {

        const bottom =
            Math.max(
                0,
                window.innerHeight -
                customY
            );


        heart.style.bottom =
            `${bottom}px`;

    }


    /*
       Duración
    */

    const duration =
        7 +
        Math.random() *
        3;


    heart.style.animationDuration =
        `${duration}s`;


    /*
       Añadir al DOM
    */

    heartsContainer.appendChild(
        heart
    );


    /*
       Eliminar justo cuando termina
       la animación.

       Es más eficiente que usar
       un setTimeout por corazón.
    */

    heart.addEventListener(

        "animationend",

        () => {

            heart.remove();

        },

        {
            once: true
        }

    );

}


/* =========================================================
   EXPLOSIÓN DE CORAZONES
========================================================= */

function burstHearts(
    amount = 6
) {

    if (reduceMotion) {

        return;

    }


    const x =
        window.innerWidth / 2;


    const y =
        window.innerHeight *
        0.72;


    let index = 0;


    function createNextHeart() {

        if (
            index >= amount
        ) {

            return;

        }


        /*
           Si ya hay demasiados,
           detener la explosión.
        */

        if (
            heartsContainer.children.length >=
            MAX_HEARTS
        ) {

            return;

        }


        const offsetX =
            x +
            (
                Math.random() -
                0.5
            ) *
            180;


        const offsetY =
            y +
            (
                Math.random() -
                0.5
            ) *
            60;


        createHeart(
            offsetX,
            offsetY
        );


        index++;


        /*
           requestAnimationFrame evita
           disparar demasiadas operaciones
           simultáneamente.
        */

        requestAnimationFrame(
            createNextHeart
        );

    }


    createNextHeart();

}


/* =========================================================
   CREAR ESTRELLAS
========================================================= */

function createStars() {

    if (reduceMotion) {

        return;

    }


    /*
       DocumentFragment permite crear todas las
       estrellas antes de insertarlas en pantalla.
       Esto evita múltiples repintados.
    */

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < STAR_COUNT;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );


        star.className =
            "star";


        star.style.left =
            `${Math.random() * 100}vw`;


        star.style.top =
            `${Math.random() * 100}vh`;


        star.style.animationDelay =
            `${Math.random() * 2.5}s`;


        star.style.animationDuration =
            `${
                2.2 +
                Math.random() *
                2.5
            }s`;


        fragment.appendChild(
            star
        );

    }


    starsContainer.appendChild(
        fragment
    );

}


/* =========================================================
   CORAZONES AUTOMÁTICOS
========================================================= */

let automaticHeartInterval = null;


function startAutomaticHearts() {

    if (
        automaticHeartInterval ||
        reduceMotion
    ) {

        return;

    }


    automaticHeartInterval =
        setInterval(
            () => {

                /*
                   Solo crearlos si:

                   1. La página está visible.
                   2. La pestaña está activa.
                   3. No hay demasiados corazones.
                */

                if (
                    siteContent.classList.contains(
                        "visible"
                    ) &&

                    !document.hidden &&

                    heartsContainer.children.length <
                    MAX_HEARTS
                ) {

                    createHeart();

                }

            },

            /*
               Antes eran 1200 ms.
               Ahora 2400 ms.
            */

            isMobile
                ? 3000
                : 2400

        );

}


/* =========================================================
   PAUSAR EFECTOS SI CAMBIA DE PESTAÑA
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
           Los corazones automáticos
           ya comprueban document.hidden.

           Esto evita trabajo innecesario
           mientras la pestaña está oculta.
        */

        if (document.hidden) {

            return;

        }

    }
);


/* =========================================================
   EVITAR ANIMACIONES PESADAS DURANTE RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    /*
                       Aquí podrías recalcular
                       elementos si fuera necesario.
                    */

                },
                150
            );

    },

    {
        passive: true
    }

);


/* =========================================================
   INICIALIZAR
========================================================= */

createStars();

startAutomaticHearts();