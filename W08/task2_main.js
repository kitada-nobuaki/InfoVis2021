d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W08/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:20}
        };

        const Line_Chart = new LineChart( config, data );
        Line_Chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    class LineChart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 128,
                margin: config.margin || {top:10, right:10, bottom:20, left:20}
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
                .range([0, self.inner_width]);
           
            self.yscale = d3.scaleLinear()
                .range([0, self.inner_height]);

            self.xaxis = d3.axisBottom( self.xscale )
                .ticks(0);
    
            self.xaxis_group = self.chart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`);
    
            self.yaxis = d3.axisLeft( self.yscale )
                .ticks(0);
    
            self.yaxis_group = self.chart.append('g')
                .attr('transform', `translate(0,0)`);

            self.line = d3.line()
                .x( d => self.xscale(d.x) )
                .y( d => self.yscale(d.y) );

        }
    
        update() {
            let self = this;

            const xmin = d3.min( self.data, d => d.x );
            const xmax = d3.max( self.data, d => d.x );
            self.xscale.domain( [xmin-10, xmax+10] );

            const ymin = d3.min( self.data, d => d.y );
            const ymax = d3.max( self.data, d => d.y );
            self.yscale.domain( [ymin-10, ymax+10] );

            self.render();
        }
    
        render() {
            let self = this;
            
            self.chart.append('path')
                    .attr('d', self.line(self.data))
                    .attr('stroke', 'black')
                    .attr('fill', 'none');

            self.chart.selectAll("circle")
                    .data(self.data)
                    .enter()
                    .append("circle")
                    .attr("cx", d => self.xscale( d.x ) )
                    .attr("cy", d => self.yscale( d.y ) )
                    .attr("r",5);

            self.xaxis_group
                    .call( self.xaxis );
        
            self.yaxis_group
                    .call( self.yaxis );
            
        }
    }