// Valores del DOM
const boton = document.querySelector('#convertButton');
const resultado = document.querySelector('#result');
// Para el desafío utilicé una API local, los valores pueden no ser precisos
const apiUrl = ('./assets/js/mindicador.json');
let data;
let myChart;

async function getValorMoneda(){
    const res = await fetch(apiUrl);
    data = await res.json();
    return data
}
getValorMoneda();
// El Valor NT es el texto del catch
const convertirValor = function(){
    const montos = document.querySelector('#amountInput').value;
    const monedaSelect = document.querySelector('#currencySelect').value;
    try{
        const valorConvertido = montos / data[monedaSelect].valor;
        resultado.textContent = `El valor es $${valorConvertido.toFixed(2)}`;
    }catch(e){
        resultado.textContent = `Hubo un error en la conversión`;
    }
}
boton.addEventListener('click', convertirValor);
// Grafico, me guíe principalmente por la guía y clase, pero también la documentación
async function getAndCreateDataToChart(moneda = 'dolar') {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const valores = await res.json();
    const ultimosDias = valores.serie.slice(0, 10).reverse();
    const labels = ultimosDias.map(dia => {
        const fecha = new Date(dia.fecha);
        const diaMesAno = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return diaMesAno;
    });
    const data = ultimosDias.map(dia => dia.valor);
    const datasets = [{
        label: `Últimos 10 días de ${moneda}`,
        borderColor: "green",
        data,
    }];
    return { labels, datasets };
}
// Render de la gráfica
async function renderGrafica(moneda) {
    const data = await getAndCreateDataToChart(moneda);
    const config = {
        type: "line",
        data: {
            labels: data.labels,
            datasets: data.datasets,
        },
};
    if (myChart) {
        myChart.destroy();
    }
    const ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, config);
}
renderGrafica();
currencySelect.addEventListener('change', (e) => {
    renderGrafica(e.target.value);
});