let input_data;
let scatter_plot;
let scatter_plot2;
let scatter_plot3;
let bar_chart;
let filter = [];

d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/FinalTask/FinalTask.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.win = +d.win;
            d.hits = +d.hits;
            d.walks = +d.walks;
            d.strikeout = +d.strikeout;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['Central','Pacific']);

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'hits',
            ylabel: 'win',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        scatter_plot2 = new ScatterPlot2( {
            parent: '#drawing_region_scatterplot2',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'walks',
            ylabel: 'win',
            cscale: color_scale
        }, input_data );
        scatter_plot2.update();

        scatter_plot3 = new ScatterPlot3( {
            parent: '#drawing_region_scatterplot3',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'strikeout',
            ylabel: 'win',
            cscale: color_scale
        }, input_data );
        scatter_plot3.update();

        paralle_plot = new ParallelPlot( {
            parent: '#drawing_region_parallelplot',
            width: 256,
            height: 400,
            margin: {top:30, right:10, bottom:50, left:30},
            cscale: color_scale
        }, input_data );
        paralle_plot.update();

        paralle_plot2 = new ParallelPlot2( {
            parent: '#drawing_region_parallelplot2',
            width: 256,
            height: 400,
            margin: {top:30, right:10, bottom:50, left:30},
            cscale: color_scale
        }, input_data );
        paralle_plot2.update();

        paralle_plot3 = new ParallelPlot3( {
            parent: '#drawing_region_parallelplot3',
            width: 256,
            height: 400,
            margin: {top:30, right:10, bottom:50, left:30},
            cscale: color_scale
        }, input_data );
        paralle_plot3.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'League',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
        scatter_plot2.data = input_data;
        scatter_plot3.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.league ) );
        scatter_plot2.data = input_data.filter( d => filter.includes( d.league ) );
        scatter_plot3.data = input_data.filter( d => filter.includes( d.league ) );
    }
    scatter_plot.update();
    scatter_plot2.update();
    scatter_plot3.update();
}