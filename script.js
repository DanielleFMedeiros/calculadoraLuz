let titular = "Dani";

function selecionarTitular(nome) {
    titular = nome;

    document.getElementById("btnDani").classList.remove("ativo");
    document.getElementById("btnBruno").classList.remove("ativo");

    if (nome === "Dani") {
        document.getElementById("btnDani").classList.add("ativo");
    } else {
        document.getElementById("btnBruno").classList.add("ativo");
    }
}

function calcular() {
    const leituraTotal = parseInt(document.getElementById("leituraTotal").value);
    const leituraAtualPonto1 = parseInt(document.getElementById("leituraAtualPonto1").value);
    const leituraAnteriorPonto1 = parseInt(document.getElementById("leituraAnteriorPonto1").value);
    const valorFatura = parseFloat(document.getElementById("valorFatura").value);

    if (isNaN(leituraTotal) || isNaN(leituraAtualPonto1) || isNaN(leituraAnteriorPonto1) || isNaN(valorFatura)) {
        alert("Por favor, digite valores válidos.");
        return;
    }

    const consumoIndividualPonto1 = leituraAtualPonto1 - leituraAnteriorPonto1;
    const totalKwh = leituraTotal;
    const valorTotalIndividual = valorFatura / totalKwh;

    const totalLeituraIndividualPonto2 = totalKwh - consumoIndividualPonto1;
    const valorPonto1 = consumoIndividualPonto1 * valorTotalIndividual;
    const valorPonto2 = totalLeituraIndividualPonto2 * valorTotalIndividual;

    const segundoTitular = titular === "Dani" ? "Mari" : "Bárbara";

    const resultadoElement = document.getElementById("resultado");

    resultadoElement.innerHTML = `
        <p>Total de KWH: ${totalKwh} KWH</p>
        <p>Valor Total Individual: R$${valorTotalIndividual.toFixed(2)}</p>

        <p>Consumo Individual ${titular}: ${consumoIndividualPonto1.toFixed(2)} Kwh</p>
        <p>Valor a ser pago ${titular}: R$${valorPonto1.toFixed(2)}</p>

        <p>Consumo Individual ${segundoTitular}: ${totalLeituraIndividualPonto2} Kwh</p>
        <p>Valor a ser pago ${segundoTitular}: R$${valorPonto2.toFixed(2)}</p>
    `;
}