// create variables for needed page elements
var dropdownMenu = d3.select("#selDataset");
var sampleMeta = d3.select("#sample-metadata");

//function to update demographics info
function updatedemo(meta) {
    sampleMeta.html('')
    sampleMeta.append('div').text(`id: ${meta.map(m => m.id)}`)
    sampleMeta.append('div').text(`ethnicity: ${meta.map(m => m.ethnicity)}`)
    sampleMeta.append('div').text(`gender: ${meta.map(m => m.gender)}`)
    sampleMeta.append('div').text(`age: ${meta.map(m => m.age)}`)
    sampleMeta.append('div').text(`location: ${meta.map(m => m.location)}`)
    sampleMeta.append('div').text(`bbtype: ${meta.map(m => m.bbtype)}`)
    sampleMeta.append('div').text(`wfreq: ${meta.map(m => m.wfreq)}`)
}

//function to update plots
function optionChanged(id) {
    d3.json("data/samples.json").then(function(data) {

    //create needed data points
    var samples = data.samples;
    var metadata = data.metadata;
    var currentid = id
    var currentsamples = samples.filter(s => {return +s.id === +currentid}).sort((a, b) => a.sample_values - b.sample_values);
    var currentmeta = metadata.filter(s => {return +s.id === +currentid});
    var svals = currentsamples.map(s => s.sample_values)[0];
    var sids = currentsamples.map(s => s.otu_ids)[0];
    var sidsc = sids.map(s => `OTU ${+s}`);
    var slbls = currentsamples.map(s => s.otu_labels)[0];

    // update demographics
    updatedemo(currentmeta);

    //update plots
    Plotly.restyle('bar', "x", [svals.slice(0,10).reverse()]);
    Plotly.restyle('bar', "y", [sidsc.slice(0,10).reverse()]);
    Plotly.restyle('bar', "text", [slbls.slice(0,10).reverse()]);
    
    Plotly.restyle('bubble', "x", [svals]);
    Plotly.restyle('bubble', "y", [sids]);
    Plotly.restyle('bubble', "text", [slbls]);
    Plotly.restyle('bubble', "marker.color", [sids]);
    Plotly.restyle('bubble', "marker.size", [svals]);
    
    Plotly.restyle('gauge', "value", [currentmeta.map(v => +v.wfreq)[0]]);
})};

// read in data
d3.json("data/samples.json").then(function(data) {
    // get needed data from object
    var ids = data.names.sort((a,b) => a - b);
    // make dropdown
    ids.forEach(e => {
        dropdownMenu.append('option').attr('value',e).text(e)
    });
    // create needed data points
    var samples = data.samples;
    var metadata = data.metadata;
    var currentid = ids.slice(0,1);
    var currentsamples = samples.filter(s => {return +s.id === +currentid}).sort((a, b) => a.sample_values - b.sample_values);
    var currentmeta = metadata.filter(s => {return +s.id === +currentid});
    var svals = currentsamples.map(s => s.sample_values)[0];
    var sids = currentsamples.map(s => s.otu_ids)[0];
    var sidsc = sids.map(s => `OTU ${+s}`);
    var slbls = currentsamples.map(s => s.otu_labels)[0];

    // create demographics 
    updatedemo(currentmeta);
    
    // create plots
    // bar chart
    var trace1 = {
        x: svals.slice(0,10).reverse(),
        y: sidsc.slice(0,10).reverse(),
        text: slbls.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      };
    
    var barData = [trace1];
    var layout1 = {
        barmode: 'group',
        margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
        }
    };

    Plotly.newPlot("bar", barData, layout1);

    // bubble chart
    var trace2 = {
        x: sids,
        y: svals,
        text: slbls,
        mode: 'markers',
        marker: {
          color: sids,
          size: svals
        }
      };
    var bubbleData = [trace2];
    var layout2 = {
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bubble", bubbleData, layout2);

    // gauge chart
    var trace3 = {
        type: "indicator",
        mode: "gauge+number",
        value: currentmeta.map(v => +v.wfreq)[0],
        title: { text: "Scrubs per Week" },
        gauge: {
            axis: { range: [0, 9]},
            bar: { color: "darkblue" },
            steps: [
              { range: [0, 1], color: "#c5ceb7" },
              { range: [1, 2], color: "#b6c5a8" },
              { range: [2, 3], color: "#96b288" },
              { range: [3, 4], color: "#6d9960" },
              { range: [4, 5], color: "#4d8743" },
              { range: [5, 6], color: "#3e7e36" },
              { range: [6, 7], color: "#2a7526" },
              { range: [7, 8], color: "#0a6a14" },
              { range: [8, 9], color: "#195315" }
            ]
          }
    }

    var gaugeData = [trace3];
    
    var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, layout3);
});