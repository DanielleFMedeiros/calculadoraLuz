
const STORAGE_KEY = "calculadoraLuzHistorico_v1";

let titular = "Dani";
let ultimoCalculo = null;
let idEmEdicao = null;

function selecionarTitular(nome) {
    titular = nome;

    const btnDani = document.getElementById("btnDani");
    const btnKitnet = document.getElementById("btnKitnet");
    const daniSelecionada = nome === "Dani";

    btnDani.classList.toggle("active", daniSelecionada);
    btnKitnet.classList.toggle("active", !daniSelecionada);

    btnDani.setAttribute("aria-pressed", String(daniSelecionada));
    btnKitnet.setAttribute("aria-pressed", String(!daniSelecionada));
}

function reais(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function numero(valor, casas = 0) {
    return Number(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas
    });
}

function formatarData(data) {
    if (!data) return "Não informada";

    const partes = data.split("-");
    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function diasEntreDatas(anterior, atual) {
    if (!anterior || !atual) return null;

    const inicio = new Date(`${anterior}T12:00:00`);
    const fim = new Date(`${atual}T12:00:00`);

    return Math.round((fim - inicio) / 86400000);
}

function obterNomes(opcao) {
    if (opcao === "Dani") {
        return {
            nomeMedidor: "Dani",
            nomeOutro: "Mari"
        };
    }

    return {
        nomeMedidor: "Kitnet",
        nomeOutro: "Apartamento"
    };
}

function definirStatus(mensagem, erro = false) {
    const status = document.getElementById("formStatus");

    status.textContent = mensagem;
    status.classList.toggle("error", erro);
}

function calcular(dadosPreenchidos = null, mostrarAlerta = true) {
    const dados = dadosPreenchidos || {
        titular,
        dataLeituraAnterior: document.getElementById("dataLeituraAnterior").value,
        leituraAnteriorPonto1: document.getElementById("leituraAnteriorPonto1").value,
        dataLeituraAtual: document.getElementById("dataLeituraAtual").value,
        leituraAtualPonto1: document.getElementById("leituraAtualPonto1").value,
        leituraTotal: document.getElementById("leituraTotal").value,
        valorFatura: document.getElementById("valorFatura").value,
        valorCosip: document.getElementById("valorCosip").value
    };

    const camposObrigatorios = [
        ["Data da leitura anterior", dados.dataLeituraAnterior],
        ["Leitura anterior", dados.leituraAnteriorPonto1],
        ["Data da leitura atual", dados.dataLeituraAtual],
        ["Leitura atual", dados.leituraAtualPonto1],
        ["Consumo total da fatura", dados.leituraTotal],
        ["Valor da fatura", dados.valorFatura],
        ["Valor da COSIP", dados.valorCosip]
    ];

    const campoNaoPreenchido = camposObrigatorios.find(([, valor]) =>
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
    );

    if (campoNaoPreenchido) {
        const mensagem = `Preencha o campo: ${campoNaoPreenchido[0]}.`;

        definirStatus(mensagem, true);

        if (mostrarAlerta) alert(mensagem);

        return null;
    }

    const leituraTotal = Number(dados.leituraTotal);
    const leituraAtual = Number(dados.leituraAtualPonto1);
    const leituraAnterior = Number(dados.leituraAnteriorPonto1);
    const valorFaturaInformado = Number(dados.valorFatura);
    const valorCosipInformado = Number(dados.valorCosip);

    if (
        ![
            leituraTotal,
            leituraAtual,
            leituraAnterior,
            valorFaturaInformado,
            valorCosipInformado
        ].every(Number.isFinite)
    ) {
        definirStatus("Confira os números informados.", true);

        if (mostrarAlerta) alert("Confira os números informados.");

        return null;
    }

    if (leituraTotal <= 0) {
        definirStatus("O consumo total deve ser maior que zero.", true);

        if (mostrarAlerta) {
            alert("O consumo total deve ser maior que zero.");
        }

        return null;
    }

    if (leituraAtual < 0 || leituraAnterior < 0) {
        definirStatus("As leituras do medidor não podem ser negativas.", true);

        if (mostrarAlerta) {
            alert("As leituras do medidor não podem ser negativas.");
        }

        return null;
    }

    if (valorFaturaInformado < 0 || valorCosipInformado < 0) {
        definirStatus("A fatura e a COSIP não podem ter valores negativos.", true);

        if (mostrarAlerta) {
            alert("A fatura e a COSIP não podem ter valores negativos.");
        }

        return null;
    }

    const anteriorMs =
        new Date(`${dados.dataLeituraAnterior}T12:00:00`).getTime();

    const atualMs =
        new Date(`${dados.dataLeituraAtual}T12:00:00`).getTime();

    if (
        !Number.isFinite(anteriorMs) ||
        !Number.isFinite(atualMs) ||
        atualMs < anteriorMs
    ) {
        definirStatus(
            "A data da leitura atual deve ser igual ou posterior à data anterior.",
            true
        );

        if (mostrarAlerta) {
            alert(
                "A data da leitura atual deve ser igual ou posterior à data anterior."
            );
        }

        return null;
    }

    // Valores monetários são calculados em centavos inteiros.
    const valorFaturaCentavos = Math.round(valorFaturaInformado * 100);
    const cosipCentavos = Math.round(valorCosipInformado * 100);

    if (cosipCentavos > valorFaturaCentavos) {
        definirStatus(
            "A COSIP não pode ser maior que o valor total da fatura.",
            true
        );

        if (mostrarAlerta) {
            alert("A COSIP não pode ser maior que o valor total da fatura.");
        }

        return null;
    }

    // O consumo individual corresponde à diferença entre as leituras.
    const consumoMedidor = leituraAtual - leituraAnterior;

    if (consumoMedidor < 0) {
        definirStatus(
            "A leitura atual não pode ser menor que a leitura anterior.",
            true
        );

        if (mostrarAlerta) {
            alert("A leitura atual não pode ser menor que a leitura anterior.");
        }

        return null;
    }

    if (consumoMedidor > leituraTotal) {
        definirStatus(
            "O consumo calculado pelo medidor não pode superar o consumo total da fatura.",
            true
        );

        if (mostrarAlerta) {
            alert(
                "O consumo calculado pelo medidor não pode superar o consumo total da fatura."
            );
        }

        return null;
    }

    // O consumo restante pertence à outra pessoa ou imóvel.
    const consumoOutro = leituraTotal - consumoMedidor;

    // Retira a COSIP antes de dividir o valor da energia.
    const valorConsumoCentavos =
        valorFaturaCentavos - cosipCentavos;

    // Divide a energia proporcionalmente ao consumo em kWh.
    const valorMedidorCentavos = Math.round(
        valorConsumoCentavos * consumoMedidor / leituraTotal
    );

    // A outra pessoa recebe o restante, garantindo a soma exata.
    const valorOutroCentavos =
        valorConsumoCentavos - valorMedidorCentavos;

    // Divide a COSIP igualmente. O centavo restante vai para o outro lado.
    const cosipMedidorCentavos = Math.floor(cosipCentavos / 2);

    const cosipOutroCentavos =
        cosipCentavos - cosipMedidorCentavos;

    // Totais individuais em centavos.
    const totalMedidorCentavos =
        valorMedidorCentavos + cosipMedidorCentavos;

    const totalOutroCentavos =
        valorOutroCentavos + cosipOutroCentavos;

    const { nomeMedidor, nomeOutro } =
        obterNomes(dados.titular || titular);

    const dias = diasEntreDatas(
        dados.dataLeituraAnterior,
        dados.dataLeituraAtual
    );

    const resultado = {
        id: dados.id || idEmEdicao || null,
        titular: dados.titular || titular,

        dataLeituraAnterior: dados.dataLeituraAnterior,
        leituraAnteriorPonto1: leituraAnterior,

        dataLeituraAtual: dados.dataLeituraAtual,
        leituraAtualPonto1: leituraAtual,

        leituraTotal,
        consumoMedidor,
        consumoOutro,

        valorFaturaCentavos,
        cosipCentavos,
        valorConsumoCentavos,

        valorMedidorCentavos,
        valorOutroCentavos,

        cosipMedidorCentavos,
        cosipOutroCentavos,

        totalMedidorCentavos,
        totalOutroCentavos,

        nomeMedidor,
        nomeOutro,
        dias,
        salvoEm: dados.salvoEm || null
    };

    ultimoCalculo = resultado;

    desenharResultado(resultado);

    definirStatus(
        idEmEdicao
            ? "Você está editando um registro. Confira os valores e clique em Atualizar registro para salvar as alterações."
            : "Cálculo concluído. Confira os valores antes de salvar no histórico."
    );

    return resultado;
}

function desenharResultado(r) {
    const diferencaCentavos =
        r.totalMedidorCentavos +
        r.totalOutroCentavos -
        r.valorFaturaCentavos;

    const diasTexto = r.dias === 1
        ? "1 dia entre as leituras"
        : `${r.dias} dias entre as leituras`;

    const diferencaClasse = diferencaCentavos === 0 ? "" : "bad";

    document.getElementById("resultado").innerHTML = `
        <h2>Resultado do cálculo</h2>

        <p>
            <strong>Período:</strong>
            ${formatarData(r.dataLeituraAnterior)}
            a
            ${formatarData(r.dataLeituraAtual)}
            (${diasTexto})
        </p>

        <div class="result-grid">
          <article class="result-card">
            <h3>📊 Dados gerais</h3>

            <p>
              <span>Consumo total</span>
              <strong>${numero(r.leituraTotal)} kWh</strong>
            </p>

            <p>
              <span>Valor da fatura</span>
              <strong>${reais(r.valorFaturaCentavos / 100)}</strong>
            </p>

            <p>
              <span>Valor da COSIP</span>
              <strong>${reais(r.cosipCentavos / 100)}</strong>
            </p>

            <p>
              <span>Valor referente ao consumo</span>
              <strong>${reais(r.valorConsumoCentavos / 100)}</strong>
            </p>

            <p>
              <span>Medidor anterior</span>
              <strong>
                ${numero(r.leituraAnteriorPonto1, 2)}
                (${formatarData(r.dataLeituraAnterior)})
              </strong>
            </p>

            <p>
              <span>Medidor atual</span>
              <strong>
                ${numero(r.leituraAtualPonto1, 2)}
                (${formatarData(r.dataLeituraAtual)})
              </strong>
            </p>
          </article>

          <article class="result-card">
            <h3>🏡 ${r.nomeOutro}</h3>

            <p>
              <span>Consumo</span>
              <strong>${numero(r.consumoOutro)} kWh</strong>
            </p>

            <p>
              <span>Valor do consumo</span>
              <strong>${reais(r.valorOutroCentavos / 100)}</strong>
            </p>

            <p>
              <span>COSIP</span>
              <strong>${reais(r.cosipOutroCentavos / 100)}</strong>
            </p>

            <p class="result-total">
              <span>Total ${r.nomeOutro}</span>
              <strong>${reais(r.totalOutroCentavos / 100)}</strong>
            </p>
          </article>

          <article class="result-card">
            <h3>🏠 ${r.nomeMedidor}</h3>

            <p>
              <span>Consumo</span>
              <strong>${numero(r.consumoMedidor)} kWh</strong>
            </p>

            <p>
              <span>Valor do consumo</span>
              <strong>${reais(r.valorMedidorCentavos / 100)}</strong>
            </p>

            <p>
              <span>COSIP</span>
              <strong>${reais(r.cosipMedidorCentavos / 100)}</strong>
            </p>

            <p class="result-total">
              <span>Total ${r.nomeMedidor}</span>
              <strong>${reais(r.totalMedidorCentavos / 100)}</strong>
            </p>
          </article>
        </div>

        <div class="check-row ${diferencaClasse}">
          <span>
            Conferência:
            ${reais((r.totalMedidorCentavos + r.totalOutroCentavos) / 100)}
          </span>

          <span>
            ${
                diferencaCentavos === 0
                    ? "✓ Fecha com a fatura"
                    : `Diferença: ${reais(diferencaCentavos / 100)}`
            }
          </span>
        </div>

        <div class="actions">
          <button type="button" class="primary" onclick="salvarNoHistorico()">
            ${r.id ? "Atualizar registro" : "Salvar no histórico"}
          </button>

          <button type="button" class="secondary" onclick="copiarRelatorio()">
            Copiar relatório
          </button>
        </div>
    `;
}

function obterHistorico() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);

        if (!salvo) return [];

        const dados = JSON.parse(salvo);

        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error("Não foi possível ler o histórico:", erro);
        return [];
    }
}

function guardarHistorico(lista) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
        return true;
    } catch (erro) {
        alert(
            "Não foi possível salvar. O armazenamento do navegador pode estar cheio ou indisponível. Exporte o histórico existente e tente novamente."
        );

        console.error("Não foi possível salvar o histórico:", erro);

        return false;
    }
}

function salvarNoHistorico() {
    if (!ultimoCalculo) {
        alert("Calcule a conta antes de salvar.");
        return;
    }

    const diferenca =
        ultimoCalculo.totalMedidorCentavos +
        ultimoCalculo.totalOutroCentavos -
        ultimoCalculo.valorFaturaCentavos;

    if (diferenca !== 0) {
        alert(
            "A conferência não fechou com a fatura. Revise os dados antes de salvar."
        );

        return;
    }

    const resumo = [
        `Período: ${formatarData(ultimoCalculo.dataLeituraAnterior)} a ${formatarData(ultimoCalculo.dataLeituraAtual)}`,
        `Fatura: ${reais(ultimoCalculo.valorFaturaCentavos / 100)}`,
        `Total ${ultimoCalculo.nomeMedidor}: ${reais(ultimoCalculo.totalMedidorCentavos / 100)}`,
        `Total ${ultimoCalculo.nomeOutro}: ${reais(ultimoCalculo.totalOutroCentavos / 100)}`
    ].join("\n");

    if (!confirm(
        `Confirme os dados antes de salvar:\n\n${resumo}\n\nDeseja ${idEmEdicao ? "atualizar este registro" : "salvar no histórico"}?`
    )) {
        return;
    }

    const historico = obterHistorico();
    const agora = new Date().toISOString();

    const registro = {
        ...ultimoCalculo,
        id: idEmEdicao || gerarId(),
        salvoEm: agora
    };

    const indice = historico.findIndex(
        item => item.id === registro.id
    );

    if (indice >= 0) {
        historico[indice] = registro;
    } else {
        historico.unshift(registro);
    }

    if (!guardarHistorico(historico)) return;

    idEmEdicao = null;
    ultimoCalculo = { ...registro };

    renderizarHistorico();

    definirStatus("Conta salva no histórico com sucesso!");

    document.getElementById("calcularBtn").textContent =
        "Calcular divisão";

    desenharResultado(ultimoCalculo);
}

function gerarId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return `conta-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function textoRelatorio(r) {
    return [
        "RELATÓRIO DE DIVISÃO DA CONTA DE LUZ",
        `Período: ${formatarData(r.dataLeituraAnterior)} a ${formatarData(r.dataLeituraAtual)}`,
        `Duração do período: ${r.dias} dias`,
        `Consumo total: ${numero(r.leituraTotal)} kWh`,
        `Medidor anterior: ${numero(r.leituraAnteriorPonto1, 2)} (${formatarData(r.dataLeituraAnterior)})`,
        `Medidor atual: ${numero(r.leituraAtualPonto1, 2)} (${formatarData(r.dataLeituraAtual)})`,
        `Consumo ${r.nomeMedidor}: ${numero(r.consumoMedidor)} kWh`,
        `Consumo ${r.nomeOutro}: ${numero(r.consumoOutro)} kWh`,
        `Valor da fatura: ${reais(r.valorFaturaCentavos / 100)}`,
        `Valor da COSIP: ${reais(r.cosipCentavos / 100)}`,
        `Valor referente ao consumo: ${reais(r.valorConsumoCentavos / 100)}`,
        "",
        `${r.nomeOutro}:`,
        `Consumo: ${numero(r.consumoOutro)} kWh`,
        `Valor do consumo: ${reais(r.valorOutroCentavos / 100)}`,
        `COSIP: ${reais(r.cosipOutroCentavos / 100)}`,
        `Total ${r.nomeOutro}: ${reais(r.totalOutroCentavos / 100)}`,
        "",
        `${r.nomeMedidor}:`,
        `Consumo: ${numero(r.consumoMedidor)} kWh`,
        `Valor do consumo: ${reais(r.valorMedidorCentavos / 100)}`,
        `COSIP: ${reais(r.cosipMedidorCentavos / 100)}`,
        `Total ${r.nomeMedidor}: ${reais(r.totalMedidorCentavos / 100)}`,
        "",
        `Conferência: ${reais((r.totalMedidorCentavos + r.totalOutroCentavos) / 100)}`,
        `Diferença para a fatura: ${reais((r.totalMedidorCentavos + r.totalOutroCentavos - r.valorFaturaCentavos) / 100)}`
    ].join("\n");
}

async function copiarRelatorio(id = null) {
    const registro = id
        ? obterHistorico().find(item => item.id === id)
        : ultimoCalculo;

    if (!registro) {
        alert("Faça um cálculo ou selecione um registro primeiro.");
        return;
    }

    const texto = textoRelatorio(registro);

    try {
        await navigator.clipboard.writeText(texto);
        definirStatus("Relatório copiado para a área de transferência!");
    } catch (erro) {
        const area = document.createElement("textarea");

        area.value = texto;
        document.body.appendChild(area);
        area.select();

        const copiou = document.execCommand("copy");

        area.remove();

        if (copiou) {
            definirStatus("Relatório copiado para a área de transferência!");
        } else {
            alert(texto);
        }
    }
}

function renderizarHistorico() {
    const historico = obterHistorico().sort((a, b) => {
        const dataA = a.dataLeituraAtual || "";
        const dataB = b.dataLeituraAtual || "";

        return dataB.localeCompare(dataA) ||
            String(b.salvoEm || "").localeCompare(String(a.salvoEm || ""));
    });

    const container = document.getElementById("historico");

    document.getElementById("historyCount").textContent =
        `${historico.length} ${historico.length === 1 ? "registro" : "registros"}`;

    if (historico.length === 0) {
        container.innerHTML =
            '<div class="empty-state">📒 Ainda não há contas salvas. Faça um cálculo e clique em <strong>Salvar no histórico</strong>.</div>';

        return;
    }

    container.innerHTML = historico.map(r => {
        const periodo =
            `${formatarData(r.dataLeituraAnterior)} → ${formatarData(r.dataLeituraAtual)}`;

        return `
          <article class="history-item">
            <div class="history-top">
              <div>
                <p class="history-period">${escaparHTML(periodo)}</p>
                <p class="history-meta">
                  ${escaparHTML(r.nomeMedidor)} + ${escaparHTML(r.nomeOutro)}
                  · ${numero(r.leituraTotal)} kWh no total
                </p>
              </div>

              <strong>${reais(r.valorFaturaCentavos / 100)}</strong>
            </div>

            <div class="history-values">
              <div class="history-value">
                <span>Total ${escaparHTML(r.nomeMedidor)}</span>
                <strong>${reais(r.totalMedidorCentavos / 100)}</strong>
              </div>

              <div class="history-value">
                <span>Total ${escaparHTML(r.nomeOutro)}</span>
                <strong>${reais(r.totalOutroCentavos / 100)}</strong>
              </div>

              <div class="history-value">
                <span>Consumo do medidor</span>
                <strong>${numero(r.consumoMedidor)} kWh</strong>
              </div>
            </div>

            <div class="history-buttons">
              <button type="button" class="small" onclick="verRegistro('${r.id}')">
                Ver relatório
              </button>

              <button type="button" class="small" onclick="editarRegistro('${r.id}')">
                Editar
              </button>

              <button type="button" class="small" onclick="copiarRelatorio('${r.id}')">
                Copiar
              </button>

              <button type="button" class="small danger" onclick="excluirRegistro('${r.id}')">
                Excluir
              </button>
            </div>
          </article>
        `;
    }).join("");
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function verRegistro(id) {
    const registro = obterHistorico().find(item => item.id === id);

    if (!registro) return;

    idEmEdicao = null;
    ultimoCalculo = registro;

    desenharResultado(registro);

    definirStatus(
        `Visualizando o registro de ${formatarData(registro.dataLeituraAtual)}.`
    );

    document.getElementById("resultado").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function editarRegistro(id) {
    const registro = obterHistorico().find(item => item.id === id);

    if (!registro) return;

    idEmEdicao = registro.id;

    selecionarTitular(registro.titular);

    document.getElementById("dataLeituraAnterior").value =
        registro.dataLeituraAnterior;

    document.getElementById("leituraAnteriorPonto1").value =
        registro.leituraAnteriorPonto1;

    document.getElementById("dataLeituraAtual").value =
        registro.dataLeituraAtual;

    document.getElementById("leituraAtualPonto1").value =
        registro.leituraAtualPonto1;

    document.getElementById("leituraTotal").value =
        registro.leituraTotal;

    document.getElementById("valorFatura").value =
        (registro.valorFaturaCentavos / 100).toFixed(2);

    document.getElementById("valorCosip").value =
        (registro.cosipCentavos / 100).toFixed(2);

    document.getElementById("calcularBtn").textContent =
        "Recalcular registro";

    document.getElementById("resultado").innerHTML = "";

    ultimoCalculo = null;

    definirStatus(
        "Registro carregado para edição. Faça o cálculo novamente e salve para atualizar."
    );

    document.getElementById("form-title").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function excluirRegistro(id) {
    const registro = obterHistorico().find(item => item.id === id);

    if (!registro) return;

    const confirmar = confirm(
        `Excluir o registro do período ${formatarData(registro.dataLeituraAnterior)} a ${formatarData(registro.dataLeituraAtual)}? Esta ação não pode ser desfeita.`
    );

    if (!confirmar) return;

    const novoHistorico = obterHistorico().filter(
        item => item.id !== id
    );

    if (!guardarHistorico(novoHistorico)) return;

    if (idEmEdicao === id) {
        idEmEdicao = null;
        ultimoCalculo = null;

        document.getElementById("resultado").innerHTML = "";

        document.getElementById("calcularBtn").textContent =
            "Calcular divisão";
    }

    renderizarHistorico();
    definirStatus("Registro excluído.");
}

function limparFormulario() {
    if (
        idEmEdicao &&
        !confirm(
            "Você está editando um registro. Deseja cancelar a edição e limpar o formulário?"
        )
    ) {
        return;
    }

    [
        "dataLeituraAnterior",
        "leituraAnteriorPonto1",
        "dataLeituraAtual",
        "leituraAtualPonto1",
        "leituraTotal",
        "valorFatura",
        "valorCosip"
    ].forEach(id => {
        document.getElementById(id).value = "";
    });

    idEmEdicao = null;
    ultimoCalculo = null;

    document.getElementById("resultado").innerHTML = "";

    document.getElementById("calcularBtn").textContent =
        "Calcular divisão";

    definirStatus("Campos limpos. O histórico salvo foi mantido.");
}

function exportarHistorico() {
    const historico = obterHistorico();

    if (historico.length === 0) {
        alert("Ainda não há registros para exportar.");
        return;
    }

    const conteudo = JSON.stringify({
        app: "Calculadora de Luz",
        versao: 1,
        exportadoEm: new Date().toISOString(),
        registros: historico
    }, null, 2);

    const blob = new Blob(
        [conteudo],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
        `backup-calculadora-luz-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    definirStatus("Backup exportado. Guarde o arquivo em um local seguro.");
}

function importarHistorico(event) {
    const arquivo = event.target.files && event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
        try {
            const dados = JSON.parse(leitor.result);

            const registros = Array.isArray(dados)
                ? dados
                : dados.registros;

            if (
                !Array.isArray(registros) ||
                !registros.every(registroValido)
            ) {
                throw new Error("Formato inválido");
            }

            const atual = obterHistorico();

            const mapa = new Map(
                atual.map(registro => [registro.id, registro])
            );

            registros.forEach(registro => {
                const id = registro.id || gerarId();

                mapa.set(id, { ...registro, id });
            });

            const unidos = Array.from(mapa.values());

            const confirmar = confirm(
                `O arquivo contém ${registros.length} registro(s). Eles serão adicionados ao histórico atual; registros com o mesmo ID serão substituídos. Continuar?`
            );

            if (!confirmar) return;

            if (!guardarHistorico(unidos)) return;

            renderizarHistorico();

            definirStatus(
                `${registros.length} registro(s) importado(s) com sucesso.`
            );
        } catch (erro) {
            alert(
                "Não foi possível importar esse arquivo. Selecione um backup JSON exportado por esta calculadora."
            );

            console.error("Erro ao importar backup:", erro);
        } finally {
            event.target.value = "";
        }
    };

    leitor.readAsText(arquivo);
}

function registroValido(r) {
    return r &&
        typeof r === "object" &&
        typeof r.dataLeituraAnterior === "string" &&
        typeof r.dataLeituraAtual === "string" &&
        Number.isFinite(Number(r.leituraTotal)) &&
        Number.isFinite(Number(r.valorFaturaCentavos)) &&
        Number.isFinite(Number(r.cosipCentavos)) &&
        Number.isFinite(Number(r.totalMedidorCentavos)) &&
        Number.isFinite(Number(r.totalOutroCentavos)) &&
        typeof r.nomeMedidor === "string" &&
        typeof r.nomeOutro === "string";
}

function inicializar() {
    selecionarTitular("Dani");
    renderizarHistorico();
}

document.addEventListener("DOMContentLoaded", inicializar);
