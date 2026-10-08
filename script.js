let titular = "Dani";

function selecionarTitular(nome) {
    titular = nome;

    document.getElementById("btnDani").classList.remove("ativo");
    document.getElementById("btnKitnet").classList.remove("ativo");

    if (nome === "Dani") {
        document.getElementById("btnDani").classList.add("ativo");
    } else {
        document.getElementById("btnKitnet").classList.add("ativo");
    }
}

function calcular() {
    const leituraTotal = parseFloat(document.getElementById("leituraTotal").value);
    const leituraAtualPonto1 = parseFloat(document.getElementById("leituraAtualPonto1").value);
    const leituraAnteriorPonto1 = parseFloat(document.getElementById("leituraAnteriorPonto1").value);
    const valorFatura = parseFloat(document.getElementById("valorFatura").value);
    const valorCosip = parseFloat(document.getElementById("valorCosip").value);

    if (
        isNaN(leituraTotal) ||
        isNaN(leituraAtualPonto1) ||
        isNaN(leituraAnteriorPonto1) ||
        isNaN(valorFatura) ||
        isNaN(valorCosip)
    ) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const consumoPonto1 = leituraAtualPonto1 - leituraAnteriorPonto1;

    if (consumoPonto1 < 0) {
        alert("A leitura atual não pode ser menor que a leitura anterior.");
        return;
    }

    const consumoPonto2 = leituraTotal - consumoPonto1;

    if (consumoPonto2 < 0) {
        alert("O consumo do primeiro ponto não pode ser maior que o consumo total.");
        return;
    }

    const valorConsumo = valorFatura - valorCosip;

    if (valorConsumo < 0) {
        alert("A COSIP não pode ser maior que o valor da fatura.");
        return;
    }

    const valorPorKwh = valorConsumo / leituraTotal;

    const valorPonto1 = consumoPonto1 * valorPorKwh;
    const valorPonto2 = consumoPonto2 * valorPorKwh;

    const cosipCada = valorCosip / 2;

    const totalPonto1 = valorPonto1 + cosipCada;
    const totalPonto2 = valorPonto2 + cosipCada;

    let nomePonto1;
    let nomePonto2;

    if (titular === "Dani") {
        nomePonto1 = "Mari";
        nomePonto2 = "Dani";
    } else {
        nomePonto1 = "Kitnet";
        nomePonto2 = "Bruno";
    }

    document.getElementById("resultado").innerHTML = `
        <h2>Resultado</h2>

        <p><strong>Consumo total:</strong> ${leituraTotal.toFixed(0)} kWh</p>

        <p><strong>Consumo da ${nomePonto1}:</strong> ${consumoPonto1.toFixed(0)} kWh</p>

        <p><strong>Consumo do ${nomePonto2}:</strong> ${consumoPonto2.toFixed(0)} kWh</p>

        <p><strong>Valor da fatura:</strong> R$ ${valorFatura.toFixed(2)}</p>

        <p><strong>Valor da COSIP:</strong> R$ ${valorCosip.toFixed(2)}</p>

        <p><strong>Valor referente ao consumo:</strong> R$ ${valorConsumo.toFixed(2)}</p>

        <hr>

        <h3>🏡 ${nomePonto1}</h3>

        <p><strong>Consumo:</strong> ${consumoPonto1.toFixed(0)} kWh</p>

        <p>Valor do consumo: R$ ${valorPonto1.toFixed(2)}</p>

        <p>COSIP: R$ ${cosipCada.toFixed(2)}</p>

        <p><strong>💰 Total ${nomePonto1}: R$ ${totalPonto1.toFixed(2)}</strong></p>

        <hr>

        <h3>🏠 ${nomePonto2}</h3>

        <p><strong>Consumo:</strong> ${consumoPonto2.toFixed(0)} kWh</p>

        <p>Valor do consumo: R$ ${valorPonto2.toFixed(2)}</p>

        <p>COSIP: R$ ${cosipCada.toFixed(2)}</p>

        <p><strong>💰 Total ${nomePonto2}: R$ ${totalPonto2.toFixed(2)}</strong></p>

        <hr>

        <p><strong>Conferência: R$ ${(totalPonto1 + totalPonto2).toFixed(2)}</strong></p>
    `;
}
