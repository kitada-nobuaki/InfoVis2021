d3.csv("https://kitada-nobuaki.github.io/InfoVis2021/W08/task1.csv")
    .then( data => {
        data.forEach( d => {d.value = +d.value; });
        
        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 400,
            margin: {top:40, right:10, bottom:60, left:100},
            title: 'イチゴの生産量',
            xlabel: '生産量[t]',
            ylabel: '産地'
        };
        
        const Bar_Chart = new BarChart( config );
        Bar_Chart.update(data);

        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                Bar_Chart.update(data);
            });
        
        d3.select('#Descend')
            .on('click', d => {
                data.sort(function(a,b){
                    if(a.value > b.value){
                        return -1;
                    } else{
                        return 1;
                    }
                });
                console.log(data)
                Bar_Chart.update(data);
            });

        d3.select('#Ascend')
            .on('click', d => {
                data.sort(function(a,b){
                    if(a.value < b.value){
                        return -1;
                    } else{
                        return 1;
                    }
                });
                console.log(data)
                Bar_Chart.update(data);
            });
    })
    .catch( error => {
        console.log( error );
    });


class BarChart {

    constructor( config ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:20, left:60},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        }

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

        const title_space = 30;
        self.svg.append('text')
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );
    
        const ylabel_space = 100;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update(data) {
        let self = this;

        const xmin = 0;
        const xmax = d3.max(data, d => d.value);
        self.xscale.domain([xmin-10, xmax+10]);

        self.yscale.domain(data.map(d => d.label));

        self.render(data);
    }

    render(data) {
        let self = this;
    
        self.chart.selectAll("rect").data(data)
            .join("rect")
            .transition().duration(1000)
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
