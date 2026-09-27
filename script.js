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

let musicPlaying = false;


/* =====================================
   CONFIGURACIÓN DEL MP3
===================================== */

// Volumen de 0 a 1.
// 0.35 = 35%
backgroundMusic.volume = 0.35;

// Repetir automáticamente.
backgroundMusic.loop = true;


/* =====================================
   ACTIVAR EXPERIENCIA
===================================== */

activateMusic.addEventListener("click", async () => {

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


    /* Ocultar modal */

    musicModal.classList.add("hide");


    /* Mostrar página */

    siteContent.classList.add("visible");

    document.body.classList.remove(
        "page-locked"
    );


    /* Corazones iniciales */

    burstHearts(18);


    /* Eliminar modal después de animación */

    setTimeout(() => {

        musicModal.style.display = "none";

    }, 950);

});


/* =====================================
   CONTROL FLOTANTE DE MÚSICA
===================================== */

musicControl.addEventListener("click", async () => {

    if (musicPlaying) {

        /* PAUSAR */

        backgroundMusic.pause();

        musicPlaying = false;

        musicControl.classList.add(
            "paused"
        );

        musicControl.textContent = "♪";

        musicControl.setAttribute(
            "aria-label",
            "Reproducir música"
        );

    } else {

        /* REPRODUCIR */

        try {

            await backgroundMusic.play();

            musicPlaying = true;

            musicControl.classList.remove(
                "paused"
            );

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

    }

});


/* =====================================
   ABRIR CARTA
===================================== */

openButton.addEventListener("click", () => {

    letterSection.classList.add("show");

    letterSection.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(() => {

        letterSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 120);


    burstHearts(16);

});


/* =====================================
   MENSAJE FINAL
===================================== */

finalButton.addEventListener("click", () => {

    finalNote.classList.toggle("show");


    finalButton.textContent =
        finalNote.classList.contains("show")

            ? "Gracias por leerme ❤️"

            : "Toca aquí, Daniela";


    burstHearts(24);

});


/* =====================================
   CORAZONES
===================================== */

function createHeart(
    customX = null,
    customY = null
) {

    const heart =
        document.createElement("span");


    heart.className = "heart";


    heart.textContent =
        Math.random() > 0.25
            ? "❤"
            : "♡";


    const size =
        12 + Math.random() * 18;


    heart.style.fontSize =
        `${size}px`;


    heart.style.left =
        customX !== null

            ? `${customX}px`

            : `${Math.random() * 100}vw`;


    if (customY !== null) {

        heart.style.bottom =
            `${window.innerHeight - customY}px`;

    }


    const duration =
        6 + Math.random() * 5;


    heart.style.animationDuration =
        `${duration}s`;


    heart.style.opacity =
        `${0.25 + Math.random() * 0.45}`;


    heartsContainer.appendChild(heart);


    setTimeout(() => {

        heart.remove();

    }, duration * 1000);

}


/* =====================================
   EXPLOSIÓN DE CORAZONES
===================================== */

function burstHearts(amount = 12) {

    const x =
        window.innerWidth / 2;


    const y =
        window.innerHeight * 0.72;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        setTimeout(() => {

            const offsetX =
                x +
                (Math.random() - 0.5) *
                220;


            const offsetY =
                y +
                (Math.random() - 0.5) *
                80;


            createHeart(
                offsetX,
                offsetY
            );

        }, i * 60);

    }

}


/* =====================================
   ESTRELLAS
===================================== */

function createStars() {

    const total =
        Math.min(

            80,

            Math.floor(
                window.innerWidth / 14
            )

        );


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const star =
            document.createElement("span");


        star.className = "star";


        star.style.left =
            `${Math.random() * 100}vw`;


        star.style.top =
            `${Math.random() * 100}vh`;


        star.style.animationDelay =
            `${Math.random() * 2.5}s`;


        star.style.animationDuration =
            `${
                1.8 +
                Math.random() * 2.8
            }s`;


        starsContainer.appendChild(star);

    }

}


/* =====================================
   CORAZONES AUTOMÁTICOS
===================================== */

setInterval(() => {

    if (
        siteContent.classList.contains(
            "visible"
        )
    ) {

        createHeart();

    }

}, 1200);


/* Crear estrellas */

createStars();