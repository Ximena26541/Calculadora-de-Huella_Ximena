// 1. Datos: litros de agua por kilo y limite de cada fibra
const LITROS_POR_KG = { algodon: 10000, poliester: 300 };
const LIMITE = { algodon: 10000, poliester: 300 };

// 2. Clase LoteTela: guarda los datos de cada lote
class LoteTela {
    constructor(id, tipoFibra, kilogramos) {
        this.id = id;
        this.tipoFibra = tipoFibra;
        this.kilogramos = kilogramos;
    }

    // Expresion matematica: kilos x litros por kilo
    calcularAgua() {
        return this.kilogramos * LITROS_POR_KG[this.tipoFibra];
    }
}

// 3. Elementos del HTML
const selectFibra = document.getElementById("tipoFibra");
const inputKilos = document.getElementById("kilosTela");
const btnCalcular = document.getElementById("btnCalcular");
const aguaTotal = document.getElementById("aguaTotal");
const historialLotes = document.getElementById("historialLotes");

// 4. Muestra los lotes guardados y el total
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("lotes")) || []; // como lista con los lotes guardados
    historialLotes.innerHTML = "";
    let total = 0;

    historial.forEach(function (datos) {
        const lote = new LoteTela(datos.id, datos.tipoFibra, datos.kilogramos);
        const agua = lote.calcularAgua();
        total += agua;

        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = "Lote " + lote.id + " | " + lote.tipoFibra + " | " + lote.kilogramos + " kg | " + agua + " L";

        // Rojo si se pasa del limite
        if (agua > LIMITE[lote.tipoFibra]) {
            li.classList.add("list-group-item-danger");
        // Verde si no pasa del limite
        } else {
            li.classList.add("list-group-item-success");
        }

        historialLotes.appendChild(li);
    });

    // Total acumulado con textContent
    aguaTotal.textContent = total;
}

// 5. Al dar clic en el boton
btnCalcular.addEventListener("click", function () {
    const kilos = parseFloat(inputKilos.value);
    if (isNaN(kilos) || kilos <= 0) return;

    const historial = JSON.parse(localStorage.getItem("lotes")) || [];
    const lote = new LoteTela(historial.length + 1, selectFibra.value, kilos);

    // Primero la alerta si se pasa del limite
    if (lote.calcularAgua() > LIMITE[lote.tipoFibra]) {
        alert("ALERTA: El lote " + lote.id + " supera el estandar ecologico de agua permitido.");
    }

    // Guardar en LocalStorage
    historial.push(lote);
    localStorage.setItem("lotes", JSON.stringify(historial));

    inputKilos.value = "";
    mostrarHistorial();
});

// 6. Al abrir la pagina, mostrar lo que ya estaba guardado
mostrarHistorial();