// Step 1: Make a D3.json call to the samples.json file in order to print out the results
// d3.json("samples.json").then((data)=>{
//     console.log(data["names"])
//     data["names"].forEach((sample) => {
//         d3.select("#selDataset")
//           .append("option")
//           .text(sample)
//           .property("value", sample);
//       });
// })

// function optionChanged(parameter){
//     console.log(parameter)
// }

function buildMetadata(input) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == input);
      var result= resultsarray[0]
      d3.select("#sample-metadata").html("");
      Object.entries(result).forEach(([key, value]) => {
        d3.select("#sample-metadata").append("div").text(`${key}: ${value}`);
      });

      // BONUS: Build the Gauge Chart
    
    });
  }


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;


    // Build a Bubble Chart using the sample data
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
      };

      var DataBubble = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", DataBubble, LayoutBubble);
//  Pie Chart
    
var pie_data =[
    {
      labels:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      values:values.slice(0,10).reverse(),
      type:"pie",
    }
  ];

  var pieLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

 Plotly.newPlot("pie", pie_data, pieLayout);
    //  Bar Chart
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, barLayout);
  });
}

  
 
function init() {
  // Grab a reference to the dropdown select element
  d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data["names"];
    sampleNames.forEach((sample) => {
    d3.select("#selDataset")
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

