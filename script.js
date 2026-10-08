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

    const leituraTotal = parseFloat(
        document.getElementById("leituraTotal").value
    );

    const leituraAtualPonto1 = parseFloat(
        document.getElementById("leituraAtualPonto1").value
    );

    const leituraAnteriorPonto1 = parseFloat(
        document.getElementById("leituraAnteriorPonto1").value
    );

    const valorFatura = parseFloat(
        document.getElementById("valorFatura").value
    );

    const valorCosip = parseFloat(
        document.getElementById("valorCosip").value
    );

    // Verificação dos campos
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

    // =========================
    // CONSUMO
    // =========================

    // Consumo da kitnet
    const consumoKitnet =
        leituraAtualPonto1 - leituraAnteriorPonto1;

    // Consumo do apartamento
    const consumoApartamento =
        leituraTotal - consumoKitnet;

    // Verificação
    if (consumoKitnet < 0) {
        alert("A leitura atual da kitnet não pode ser menor que a leitura anterior.");
        return;
    }

    if (consumoApartamento < 0) {
        alert("O consumo da kitnet não pode ser maior que o consumo total da fatura.");
        return;
    }

    // =========================
    // VALORES
    // =========================

    // Retira a COSIP da conta
    const valorConsumo =
        valorFatura - valorCosip;

    // Valor de cada kWh considerando apenas a parte de consumo
    const valorPorKwh =
        valorConsumo / leituraTotal;

    // Valor referente ao consumo de cada imóvel
    const valorConsumoKitnet =
        consumoKitnet * valorPorKwh;

    const valorConsumoApartamento =
        consumoApartamento * valorPorKwh;

    // =========================
    // COSIP
    // =========================

    // Divide a COSIP igualmente
    const cosipKitnet =
        valorCosip / 2;

    const cosipApartamento =
        valorCosip / 2;

    // =========================
    // TOTAL DE CADA UM
    // =========================

    const valorKitnet =
        valorConsumoKitnet + cosipKitnet;

    const valorApartamento =
        valorConsumoApartamento + cosipApartamento;

    // =========================
    // NOMES
    // =========================

    const nomeApartamento =
        titular === "Dani" ? "Dani" : "Apartamento";

    // =========================
    // RESULTADO
    // =========================

    const resultadoElement =
        document.getElementById("resultado");

    resultadoElement.innerHTML = `
        <h2>Resultado</h2>

        <p>
            <strong>Consumo total:</strong>
            ${leituraTotal.toFixed(0)} kWh
        </p>

        <p>
            <strong>Consumo da Kitnet:</strong>
            ${consumoKitnet.toFixed(0)} kWh
        </p>

        <p>
            <strong>Consumo do ${nomeApartamento}:</strong>
            ${consumoApartamento.toFixed(0)} kWh
        </p>

        <hr>

        <p>
            <strong>Valor da fatura:</strong>
            R$ ${valorFatura.toFixed(2)}
        </p>

        <p>
            <strong>Valor da COSIP:</strong>
            R$ ${valorCosip.toFixed(2)}
        </p>

        <p>
            <strong>Valor referente ao consumo:</strong>
            R$ ${valorConsumo.toFixed(2)}
        </p>

        <hr>

        <h3>🏡 Kitnet</h3>

        <p>
            Consumo: ${consumoKitnet.toFixed(0)} kWh
        </p>

        <p>
            Consumo: R$ ${valorConsumoKitnet.toFixed(2)}
        </p>

        <p>
            COSIP: R$ ${cosipKitnet.toFixed(2)}
        </p>

        <p>
            <strong>💰 Total Kitnet: R$ ${valorKitnet.toFixed(2)}</strong>
        </p>

        <hr>

        <h3>🏠 ${nomeApartamento}</h3>

        <p>
            Consumo: ${consumoApartamento.toFixed(0)} kWh
        </p>

        <p>
            Consumo: R$ ${valorConsumoApartamento.toFixed(2)}
        </p>

        <p>
            COSIP: R$ ${cosipApartamento.toFixed(2)}
        </p>

        <p>
            <strong>💰 Total ${nomeApartamento}: R$ ${valorApartamento.toFixed(2)}</strong>
        </p>

        <hr>

        <p>
            <strong>Conferência:</strong>
            R$ ${(valorKitnet + valorApartamento).toFixed(2)}
        </p>
    `;
}
