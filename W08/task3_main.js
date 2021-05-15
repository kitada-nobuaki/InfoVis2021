d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W08/task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });
        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 400,
        };
        
        const Pie_Chart = new PieChart( config, data );
        Pie_Chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    class PieChart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 128,
                radius: config.radius || Math.min( config.width, config.height ) / 2
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
                .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);


            self.pie = d3.pie()
                .value( d => d.value );

            self.arc = d3.arc()
                .innerRadius(self.config.radius/2)
                .outerRadius(self.config.radius);

            self.color = d3.scaleOrdinal()
                .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099"]);
        }
    
        update() {
            let self = this;
            self.render();
        }
    
        render() {
            let self = this;
            self.chart.selectAll('pie')
                .data( self.pie(self.data) )
                .enter()
                .append('path')
                .attr('d', self.arc)
                .attr('fill', d => self.color(d.index))
                .attr('stroke', 'white')
                .style('stroke-width', '2px');

            self.chart.selectAll('text')
                .data( self.pie(self.data) )
                .enter()
                .append('text')
                .attr("fill", "black")
                .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
                .attr("dy", "5px")
                .attr("font", "10px")
                .attr("text-anchor", "middle")
                .text(d => d.data.label);
        }
    }
    