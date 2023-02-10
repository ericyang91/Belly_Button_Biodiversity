// Using D3 Library to import data from URL

let selectedId = undefined;

const jsonData = d3.json('./samples.json');

function init() {
    jsonData.then(function(data) {
        let sampleNames = data.names.map(function(element) {
            return element
        });
        optionChanged(sampleNames[0])
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
    selectedId = value
    barchart()
    bubblechart()
    demographics()
};

function demographics() {
    jsonData.then(data => {
        const metadata = data.metadata.filter(x => {
            return x.id === Number(selectedId)
        })[0]
        let block = d3.select('#sample-metadata')
        block.html('');
        Object.entries(metadata).forEach(([key, value]) => {
            block.append('h6').text(`${key.toUpperCase()}:${value}`)
        })
    })
}


function barchart() {
    jsonData.then(data => {
        const bardata = data.samples.filter(x => x.id === selectedId)[0]
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
        const bubbledata = data.samples.filter(x => x.id === selectedId)[0]
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
