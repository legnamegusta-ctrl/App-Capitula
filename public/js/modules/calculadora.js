// public/js/modules/calculadora.js

// --- VARIÁVEIS DO DOM: CALCULADORA ---
const calcModoRadios = document.getElementsByName('calculadora-modo');
const calcPaginasInput = document.getElementById('calc-paginas');
const calcPrazoFinalDiv = document.getElementById('calc-prazo-final');
const calcPrazoDataInput = document.getElementById('calc-prazo-data');
const calcPaginasDiaDiv = document.getElementById('calc-paginas-dia');
const calcPaginasDiariasInput = document.getElementById('calc-paginas-diarias');
const btnCalcular = document.getElementById('btn-calcular');
const calcResultadoBox = document.getElementById('calc-resultado');
const resultadoTexto = document.getElementById('resultado-texto');
const btnCriarMeta = document.getElementById('btn-criar-meta');

// Importa a função que precisamos do outro módulo
import { abrirModalAdicionarMeta } from './modals.js';


// --- LÓGICA DA CALCULADORA ---
export const setupCalculadoraListeners = () => {
    
    for (const radio of calcModoRadios) {
        radio.addEventListener('change', () => {
            if (radio.value === 'prazo') {
                calcPrazoFinalDiv.classList.remove('hidden');
                calcPaginasDiaDiv.classList.add('hidden');
            } else {
                calcPrazoFinalDiv.classList.add('hidden');
                calcPaginasDiaDiv.classList.remove('hidden');
            }
            calcResultadoBox.classList.add('hidden');
        });
    }

    btnCalcular.addEventListener('click', () => {
        const modo = document.querySelector('input[name="calculadora-modo"]:checked').value;
        const paginas = parseInt(calcPaginasInput.value);
        let resultado = null;
        let tituloMeta = '';
        let tipoMeta = 'paginas';
        let quantidadeMeta = 0;
        let prazoMeta = '';

        if (isNaN(paginas) || paginas <= 0) {
            alert("Por favor, insira um número válido de páginas.");
            return;
        }

        if (modo === 'prazo') {
            const dataFinal = new Date(calcPrazoDataInput.value);
            const hoje = new Date();
            const diffEmTempo = dataFinal.getTime() - hoje.getTime();
            const diffEmDias = Math.ceil(diffEmTempo / (1000 * 60 * 60 * 24));

            if (diffEmDias <= 0) {
                alert("A data final deve ser no futuro.");
                return;
            }

            const paginasPorDia = Math.ceil(paginas / diffEmDias);
            resultado = `Você precisa ler ${paginasPorDia} páginas por dia para terminar em ${diffEmDias} dias.`;

            tituloMeta = `Ler ${paginas} páginas até ${calcPrazoDataInput.value}`;
            quantidadeMeta = paginas;
            prazoMeta = calcPrazoDataInput.value;

        } else if (modo === 'paginas') {
            const paginasDiarias = parseInt(calcPaginasDiariasInput.value);

            if (isNaN(paginasDiarias) || paginasDiarias <= 0) {
                alert("Por favor, insira um número válido de páginas por dia.");
                return;
            }

            const diasParaTerminar = Math.ceil(paginas / paginasDiarias);
            const dataFinal = new Date();
            dataFinal.setDate(dataFinal.getDate() + diasParaTerminar);
            const dataFinalFormatada = dataFinal.toISOString().split('T')[0];

            resultado = `Você terminará o livro em aproximadamente ${diasParaTerminar} dias, no dia ${dataFinalFormatada}.`;

            tituloMeta = `Ler ${paginasDiarias} páginas por dia`;
            quantidadeMeta = paginasDiarias;
            prazoMeta = dataFinalFormatada;
        }

        if (resultado) {
            calcResultadoBox.classList.remove('hidden');
            resultadoTexto.textContent = resultado;
            btnCriarMeta.onclick = () => {
                abrirModalAdicionarMeta(tituloMeta, tipoMeta, quantidadeMeta, prazoMeta);
            };
        }
    });
};