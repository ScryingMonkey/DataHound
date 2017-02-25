
// import d3
// var script = document.createElement('script');
// script.type = "text/javascript";
// script.src = "https://d3js.org/d3.v4.min.js";
// document.head.appendChild(script);

function getData(axis){
    // import data and reshape for presentation   
    return new Promise(function(resolve, reject){
        d3.csv(axis.dataPath, function(data) {
        var returnData = [];
        console.log('>> returnData.length 1: '+returnData.length);                
        console.log('>> importing data from '+axis.dataPath);
        data.forEach(function(d) {
            d[axis.y] = +d[axis.y];
            d[axis.x] = axis.parseTime(d[axis.x]); // time
            returnData.push(d);     
        });
        console.log('>> returnData.length 2: '+returnData.length);
        console.log(data[0]);  
        console.log(data);  
        if(returnData.length>0){
            resolve(returnData);
        } else {
            reject("ERROR! Promise failed.");
        }
    });  
  });  
}

function drawChart(dataPath, data, axis, dims) {          
    // create scales and ranges
    var x = d3.scaleTime().range([0, dims.WIDTH]);
    var y = d3.scaleLinear().range([dims.HEIGHT,0]);
    // Define the scale
    console.log('>> Define the scale');    
    var valueline = d3.line()
        .x(function(d) {return x(d[axis.x]); })
        .y(function(d) {return y(d[axis.y]); });
    // Create d3 pallete
    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin 
    console.log('>> Create d3 pallete');
    var svg = d3.select('#visualisation').append('svg')
        .attr('width', dims.WIDTH + dims.MARGINS.left + dims.MARGINS.right)
        .attr('height', dims.HEIGHT + dims.MARGINS.top + dims.MARGINS.bottom)
        .append('g')
        .attr('transform', 
            'translate('+ dims.MARGINS.left +','+ dims.MARGINS.top +')');
    // Scale the range of the data 
    console.log('>> Scale the range of the data');    
    x.domain(d3.extent(data, function(d) { return d[axis.x]; }));
    y.domain([0, d3.max(data, function(d) { return d[axis.y]; })]);
    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline);
    // Create Axis
    console.log('>> Create Axis');
    // Add the X Axis
    svg.append('g')
        .attr('transform', 'translate(0,'+ dims.HEIGHT +')')
        .call(d3.axisBottom(x));
    // Add the Y axis
    svg.append('g')
        .call(d3.axisLeft(y));
    console.log('>> Chart Created');    
}



// var axis = {
//     dataPath: '/BTCPriceData.csv',
//     x: 'time', // time
//     y: 'average', // data
//     parseTime: d3.timeParse('%Y-%m-%d %I:%M:%S') // parses y data
// };
var axis = {
    dataPath: '/test.csv',
    x: 'year', // time
    y: 'sale', // data
    parseTime: d3.timeParse('%Y') // parses y data
};
var dims = {
    x: { max: 220, min: 150 },
    y: { max: 2005, min: 2000 },
    MARGINS: { top:20, right:20, bottom:30, left:50 },
    WIDTH: 960-50-20,
    // function() { return 960 - this.MARGINS.left - this.MARGINS.right; },
    HEIGHT: 500-20-30,
    // function() { return 500 - this.MARGINS.top - this.MARGINS.bottom; }
}

// pull in data
var data = [];
data = getData(axis);
// after data has resolved, draw chart with data
data.then(function(data){
    console.log('data after then... ');
    console.log(data);
    console.log('axis after then... ');
    console.log(axis);
    drawChart(this.dataPath,data, axis, dims);
}, function(failMsg){
    console.log('data after catch... ');
    console.log(data); 
    console.log('>> FAIL!!!');
    console.log(failMsg);
});