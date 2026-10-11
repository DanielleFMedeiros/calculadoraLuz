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


    // Verifica se todos os campos foram preenchidos
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


    // ==========================================
    // CONSUMO DO MEDIDOR INFORMADO
    // ==========================================

    const consumoMedidor =
        leituraAtualPonto1 - leituraAnteriorPonto1;


    if (consumoMedidor < 0) {
        alert("A leitura atual não pode ser menor que a leitura anterior.");
        return;
    }


    // ==========================================
    // CONSUMO DO OUTRO LADO
    // ==========================================

    const consumoOutro =
        leituraTotal - consumoMedidor;


    if (consumoOutro < 0) {
        alert(
            "O consumo do medidor não pode ser maior que o consumo total da fatura."
        );
        return;
    }


    // ==========================================
    // VALOR DA ENERGIA SEM COSIP
    // ==========================================

    const valorConsumo =
        valorFatura - valorCosip;


    if (valorConsumo < 0) {
        alert("A COSIP não pode ser maior que o valor total da fatura.");
        return;
    }


    // ==========================================
    // VALOR POR kWh
    // ==========================================

    const valorPorKwh =
        valorConsumo / leituraTotal;


    // ==========================================
    // VALORES DE CADA CONSUMO
    // ==========================================

    const valorMedidor =
        consumoMedidor * valorPorKwh;

    const valorOutro =
        consumoOutro * valorPorKwh;


    // ==========================================
    // COSIP DIVIDIDA 50% / 50%
    // ==========================================

    const cosipCada =
        valorCosip / 2;


    // ==========================================
    // NOMES
    // ==========================================

    let nomeMedidor;
    let nomeOutro;

    if (titular === "Dani") {

        // Medidor informado = Dani
        nomeMedidor = "Dani";

        // Restante = Mari
        nomeOutro = "Mari";

    } else {

        // Medidor informado = Kitnet
        nomeMedidor = "Kitnet";

        // Restante = Apartamento
        nomeOutro = "Apartamento";
    }


    // ==========================================
    // TOTAIS
    // ==========================================

    const totalMedidor =
        valorMedidor + cosipCada;

    const totalOutro =
        valorOutro + cosipCada;


    // ==========================================
    // RESULTADO
    // ==========================================

    document.getElementById("resultado").innerHTML = `

        <h2>Resultado</h2>

        <p>
            <strong>Consumo total:</strong>
            ${leituraTotal.toFixed(0)} kWh
        </p>

        <p>
            <strong>Consumo da ${nomeMedidor}:</strong>
            ${consumoMedidor.toFixed(0)} kWh
        </p>

        <p>
            <strong>Consumo do ${nomeOutro}:</strong>
            ${consumoOutro.toFixed(0)} kWh
        </p>

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

        <h3>
            🏡 ${nomeOutro}
        </h3>

        <p>
            <strong>Consumo:</strong>
            ${consumoOutro.toFixed(0)} kWh
        </p>

        <p>
            Valor do consumo:
            R$ ${valorOutro.toFixed(2)}
        </p>

        <p>
            COSIP:
            R$ ${cosipCada.toFixed(2)}
        </p>

        <p>
            <strong>
                💰 Total ${nomeOutro}:
                R$ ${totalOutro.toFixed(2)}
            </strong>
        </p>

        <hr>

        <h3>
            🏠 ${nomeMedidor}
        </h3>

        <p>
            <strong>Consumo:</strong>
            ${consumoMedidor.toFixed(0)} kWh
        </p>

        <p>
            Valor do consumo:
            R$ ${valorMedidor.toFixed(2)}
        </p>

        <p>
            COSIP:
            R$ ${cosipCada.toFixed(2)}
        </p>

        <p>
            <strong>
                💰 Total ${nomeMedidor}:
                R$ ${totalMedidor.toFixed(2)}
            </strong>
        </p>

        <hr>

        <p>
            <strong>
                Conferência:
                R$ ${(totalMedidor + totalOutro).toFixed(2)}
            </strong>
        </p>
    `;
}
