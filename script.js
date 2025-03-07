function calcular() {
    // Obtenha os valores dos campos de entrada
    const leituraTotalAtual = parseInt(document.getElementById("leituraTotalAtual").value);
    const leituraTotalAnterior = parseInt(document.getElementById("leituraTotalAnterior").value);
    const leituraAtualPonto1 = parseInt(document.getElementById("leituraAtualPonto1").value);
    const leituraAnteriorPonto1 = parseInt(document.getElementById("leituraAnteriorPonto1").value);
    const valorFatura = parseFloat(document.getElementById("valorFatura").value);

    // Verificar se os valores fornecidos são válidos
    if (isNaN(leituraTotalAtual) || isNaN(leituraTotalAnterior) || isNaN(leituraAtualPonto1) || isNaN(leituraAnteriorPonto1) || isNaN(valorFatura)) {
        alert("Por favor, digite valores numéricos válidos.");
        return;
    }

    // Calcular a leitura atual do ponto 2
    const leituraAtualPonto2 = Math.max(0, leituraTotalAtual - leituraAnteriorPonto1);

    // Calcular o total de KWH
    const totalKwh = leituraTotalAtual - leituraTotalAnterior;

    // Calcular o consumo individual do ponto 1
    const consumoIndividualPonto1 = leituraAtualPonto1 - leituraAnteriorPonto1;

    // Calcular o valor total individual
    const valorTotalIndividual = valorFatura / totalKwh;

    // Calcular o total leitura individual do ponto 2
    const totalLeituraIndividualPonto2 = totalKwh - consumoIndividualPonto1;

    // Calcular o valor do ponto 1
    const valorPonto1 = consumoIndividualPonto1 * valorTotalIndividual;

    // Calcular o valor do ponto 2
    const valorPonto2 = totalLeituraIndividualPonto2 * valorTotalIndividual;

    // Exibir os resultados
    const resultadoElement = document.getElementById("resultado");
    resultadoElement.innerHTML = `
        <p>Total de KWH: ${totalKwh} KWH</p>
        <p>Valor Total Individual: R$${valorTotalIndividual.toFixed(2)}</p>
        <p>Consumo Individual Jueci/Bruno: ${consumoIndividualPonto1.toFixed(2)} Kwh</p>
        <p>Valor a ser pago Jueci/Bruno: R$${valorPonto1.toFixed(2)}</p>
        <p>Consumo Individual Mari/Bárbara: ${totalLeituraIndividualPonto2} Kwh</p>
        <p>Valor a ser pago Mari/Bárbara: R$${valorPonto2.toFixed(2)}</p>
    `;
}
