// Using D3 Library to import data from URL

let selectedValue = undefined;

const jsonData = d3.json('./samples.json');

function init() {
    jsonData.then(function(data) {
        let sampleNames = data.names.map(function(element) {
            return element
        });
        dropdownMenu(sampleNames);
        });
    };

function dropdownMenu(sampleNames) {
    let dropdown = d3.select('#selDataset').attr('name', 'name-list')
    let options = dropdown.selectAll("option")
  .data(sampleNames)
  .enter()
  .append("option");

  options.text(function(d) {
    return d;
  })
  .attr("value", function(d) {
    return d;
  });

};



function optionChanged(value) {
    selectedValue = value
    barchart()
    bubblechart()
    demographics(selectedValue)
};


function demographics(selectedValue) {
    d3.json('./samples.json').then(function(data) {
        let metadata = data.metadata[0]
        console.log(metadata)

  

        function schema1(w){
            d3.json(url).then((data)=>{
                var meta=data.metadata;
                var array=meta.filter(element=>element.id==w);
                var result=array[0];
                //retrive the sample metadata html code block
                var display=d3.select('#sample-metadata');
                //reset
                display.html('');
                //apend for key value pairs
                Object.entries(result).forEach(([key,value])=> {
                    display.append('h6').text(`${key.toUpperCase()}:${value}`);
                });
    
    })
    
}

console.log(jsonData)

function barchart() {
    jsonData.then(data => {
        const bardata = data.samples.filter(x => x.id === selectedValue)[0]
        let yvar = bardata.otu_ids.slice(0,10)
        let yitem = yvar.map(item => 'OTU ' + item)
        let sorted = yitem.sort(function sortFunction(a, b) {
            return a - b;
          });
        const config = [{
            x: bardata.sample_values.slice(0,10),
            y: sorted.reverse(),
            type: 'bar',
            orientation: 'h',
            text: bardata.otu_labels.slice(0,10)
        }];

        const layout = {
            title: 'Top 10 OTUs Found in the Subject',
            xaxis: {title: 'Number of OTU'},
            yaxis: {title: 'OTU ID'}
        };
    
        Plotly.newPlot('bar', config, layout)
    });

};


function bubblechart() {
    jsonData.then(data => {
        const bubbledata = data.samples.filter(x => x.id === selectedValue)[0]
        const bubbleconfig = [{
            x: bubbledata.otu_ids,
            y: bubbledata.sample_values,
            text: bubbledata.otu_labels,
            mode: 'markers',
            marker: {
                size: bubbledata.sample_values,
                color: bubbledata.otu_ids,
                }}]
        const bubblelayout = {
            title: 'OTU per Sample',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of OTU'},
            automargin: true
        }
    Plotly.newPlot('bubble', bubbleconfig, bubblelayout)
    })
}





init()
