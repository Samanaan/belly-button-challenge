const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const data = d3.json(url);
console.log(data);

optionChanged ("940")

function optionChanged (value) {
  // Fetch the JSON data and console log it
  d3.json(url).then(function(data) {
    console.log("data",data);
    console.log("value",value);
    
    //--------------------------------------------------
    // Object filter
    //--------------------------------------------------

    //Filter setup (works!) value = the patient id
    var filteredObject = data.samples.find(function(obj) {
      return obj.id === value;
    });
    // log the object that corresponds to the patient id
    console.log(filteredObject);


    //Filter setup for the patients metadata (note value has to be changed to int)
    var filteredObjectMetadata = data.metadata.find(function(obj) {
      return obj.id === parseInt(value);
    });
    // log the object that corresponds to the patient id.
    console.log(filteredObjectMetadata);
    

    //--------------------------------------------------
    // For bar graph
    //--------------------------------------------------
    //initialize a variable to store data once sorted.
    var sortedData = {
      id: filteredObject.id,
      otu_ids: [],
      sample_values: [],
      otu_labels: []
    };
    
    // data in descending order on index
    var sortedIndices = filteredObject.sample_values
      .map(function(_, index) { return index; })
      .sort(function(a, b) {
        return filteredObject.sample_values[b] - filteredObject.sample_values[a];
      });
    
    //sort data in descending order on index
    sortedIndices.forEach(function(index) {
      sortedData.otu_ids.push(filteredObject.otu_ids[index]);
      sortedData.sample_values.push(filteredObject.sample_values[index]);
      sortedData.otu_labels.push(filteredObject.otu_labels[index]);
    });
    // console log sorted Data to check if it has been correctly sorted
    console.log(sortedData);

    // Trace for the OTUs Data
    let trace1 = {
      x: sortedData.sample_values.slice(0, 10).reverse(),
      y: sortedData.otu_ids.slice(0, 10).reverse(),
      text: sortedData.otu_ids.slice(0, 10).reverse(),
      labels: sortedData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    
    console.log(trace1);

    // Data trace array
    let traceData = [trace1];

    // Apply the group barmode to the layout
    let layout = {
      title: "top 10 OTUs",
      yaxis: { type: 'category',
                title: {
                  text: 'OTU ID'
                }},
      xaxis:{title: { text: 'Sample Values' }},
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'ascending',
      }]
    };

    console.log(traceData);
    Plotly.newPlot("bar", traceData, layout);

    //--------------------------------------------------
    // For bubble plot
    //--------------------------------------------------
    // Create a trace for the bubble plot
    let trace2 = {
      x: sortedData.otu_ids,
      y: sortedData.sample_values,
      text: sortedData.otu_labels,
      mode: 'markers',
      marker: {
        color: sortedData.otu_ids,
        size: sortedData.sample_values
      }
    };

    //treat as an array and create the bubble plot.
    let traceData2 = [trace2]
    Plotly.newPlot("bubble", traceData2);

    //--------------------------------------------------
    // For metedata list
    //--------------------------------------------------
    var filteredArrayMetadata = Object.entries(filteredObjectMetadata).map(function([key, value]) {
      return key + ":" + value;
    });
    console.log(filteredArrayMetadata)

    var myList = document.getElementById("sample-metadata");
    var fontSize = "10px";
    //Clear list
    myList.innerHTML = "";
    filteredArrayMetadata.forEach(function(item) {
      var li = document.createElement("li");
      li.textContent = item;
      li.style.fontSize = fontSize; 
      myList.appendChild(li);
      });
    });

};

//------------------------------------------
// id List for the dropdown
//------------------------------------------
//initialize the array that will be passed to the 'testFunction' in my html
var globalArray;

function fetchData(callback) {
  d3.json(url).then(function(data) {
    var myArray = Object.values(data.samples).map(obj => obj.id);
    callback(myArray);
  }).catch(function(error) {
    console.error("Error retrieving data:", error);
    callback([]);
  });
}

fetchData(function(myArray) {
  // check if myArray is has the correct data
  console.log(myArray);

  // Call function 'testFunction' to run inside the call (see the index.html)
  testFunction(myArray);
});