d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W08/task1.csv")
    .then( data => {
        data.forEach( d => {d.value = +d.value; });
        
        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 300,
            margin: {top:40, right:10, bottom:60, left:120}
        };
        
        const Bar_Chart = new BarChart( config, data );
        Bar_Chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
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
            .range([0, self.inner_width]);
           
        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);
        
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        
        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.yaxis_group = self.chart.append('g');
        

    }

    update() {
        let self = this;

        const xmin = 0;
        const xmax = d3.max(self.data, d => d.value);
        self.xscale.domain([xmin-10, xmax+10]);

        self.yscale.domain(self.data.map(d => d.label));

        self.render();
    }

    render() {
        let self = this;
        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())
            .each(d => console.log(d))

        

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}
