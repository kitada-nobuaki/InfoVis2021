d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W10/task2.csv")
    .then( data => {
        data.forEach( d => { d.pop = +d.pop; d.area = +d.area; });

        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 400,
            margin: {top:40, right:10, bottom:60, left:60},
            title: 'Population density',
            xlabel: 'Population [million people]',
            ylabel: 'Area [ten thousand km^2]'
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(8);

        self.yaxis_group = self.chart.append('g')

        const title_space = 15;
        self.svg.append('text')
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 3)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );
    
        const ylabel_space = 60;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.pop );
        const xmax = d3.max( self.data, d => d.pop );
        self.xscale.domain( [xmin-10, xmax+10] );

        const ymin = d3.min( self.data, d => d.area );
        const ymax = d3.max( self.data, d => d.area );
        self.yscale.domain( [ymin-10, ymax+10] );

        self.render();
    }

    render() {
        let self = this;

        let circles = 
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.pop ) )
            .attr("cy", d => self.yscale( d.area ) )
            .attr("r", 10 );

        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.country}</div>(${d.pop}, ${d.area})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis )

        self.yaxis_group
            .call( self.yaxis );
    }
}
