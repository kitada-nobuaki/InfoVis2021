d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W06/w06_task.csv")
    .then( data => {
        data.forEach( d => { d.pop = +d.pop; d.area = +d.area; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:50}
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
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
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

        self.title = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", 0 )
            .attr("text-anchor", "middle")
            .attr("font-size", "13pt")
            .attr("font-weight", "bold")
            .text("Title");

        self.xlabel = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", self.inner_height + self.config.margin.top)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("X Label");
        
        self.ylabel = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .append("text")
            .attr("fill", "black")
            .attr("x", -(self.inner_height / 2))
            .attr("y", -(self.config.margin.left / 2))
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("Y Label");

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
            .attr('transform', `translate(0,0)`);

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

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.pop ) )
            .attr("cy", d => self.yscale( d.area ) )
            .attr("r", d => d.r );

        self.chart
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${self.yscale( d.pop )}, ${self.yscale( d.area )})`);
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
