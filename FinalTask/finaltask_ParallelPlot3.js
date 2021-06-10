class ParallelPlot3{

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            cscale: config.cscale
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

        self.dimensions = ['wins','strikeout'];

        self.yscale = {};
        var i;
        for (i in self.dimensions) {
            self.na = self.dimensions[i];
            self.yscale[self.na] = d3.scaleLinear()
                .range([self.inner_height, 0]);
        }

        self.xscale = d3.scalePoint()
            .range( [0, self.inner_width] )
            .padding(0.5);


    }

    update() {
        let self = this;

        self.cvalue = d => d.league;

        var i;
        for (i in self.dimensions) {
            self.na = self.dimensions[i];
            self.yscale[self.na].domain( d3.extent(self.data, function(d) { return +d[self.na]; }) )
        }

        self.xscale.domain(self.dimensions);

        self.render();
    }
    
    render() {

        let self = this;

        // Draw the lines
        self.chart.selectAll("path")
            .data(self.data)
            .join("path")
            .attr("d",  function(d) {return d3.line()(self.dimensions.map(function(p) { return [self.xscale(p), self.yscale[p](d[p])]; }));})
            .style("fill", "none")
            .style("stroke", d => self.config.cscale( self.cvalue(d) ))
            .style("opacity", 0.5)

        self.chart.selectAll("myAxis")
            .data(self.dimensions).enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + self.xscale(d) + ")"; })
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(self.yscale[d])); })
            .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "black")

    }

}