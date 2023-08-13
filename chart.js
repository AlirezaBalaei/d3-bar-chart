// Global variables
let data = []
let tempData = []
let chartBox = {}
let col_rel = {}
let binding = {"labels": 0,"values": 1,"groups": 2}
let width = 0
let height = 0

// Configs
let config = {
  xAxis : {
    label : {color : "#6497b1"},
    tick: {color: "#03396c"}
  }
}
// Draw chart with given data
const draw = ({data}) => {
  removeSvg()
  
  // Declare main svg to draw our chart inside it
  var mainSvg = d3
    .select("#chart-wrapper")
    .append("svg")
    .attr("class", "mainSvg")
    .attr("width", width)
    .attr("height", height)
  
  // Resolution Scales
  var resolutionScale = d3.scaleLinear().domain([0,1000*600]).range([0,1]).clamp(true)(width*height)
  var resolutionScaleX = d3.scaleLinear().domain([0,600]).range([0,1]).clamp(true)(width)
  var resolutionScaleY = d3.scaleLinear().domain([0,1000]).range([0,1]).clamp(true)(height)

  var dataValues = data.map(e=>e[col_rel["values"]])
  var minData = d3.min(data.map(e=>e[col_rel["values"]]))
  var maxData = d3.max(data.map(e=>e[col_rel["values"]]))
  
  // Y Axis
  var YAxisHeight = height * 0.90
  var YAxisWidth = 0
  YAxisMargin = {}
  YAxisMargin.top = (height - YAxisHeight) / 2
  YAxisMargin.left = 20 * resolutionScaleX
  var dataLabels = data.map(e=>e[col_rel["labels"]])
  var yScale = d3.scaleBand().domain(dataLabels).range([0, YAxisHeight])
  var y_axis = d3.axisLeft().scale(yScale).tickSizeInner(0).tickSizeOuter(0)
  var yAxis = mainSvg
    .append("g")
    .attr("id", "yAxis")
    .call(y_axis)
  var yAxisLabel = yAxis
    .selectAll("text")
    .attr("fill", config.xAxis.label.color)
    .attr("font-size", 20 * resolutionScale)
    .attr("font-family", "Plus Jakarta Sans")
  var yAxisLine = yAxis
    .selectAll("line,path")
    .attr("stroke", config.xAxis.tick.color)
    .attr("stroke-width", 0.3)
  yAxis
    .attr("transform", function(){
      yAxisWidth = this.getBBox().width + YAxisMargin.left
      return `translate(${this.getBBox().width + YAxisMargin.left},${YAxisMargin.top})`
    })

  // X Axis
  var XAxisWidth = width * 0.95
  var xScale = d3.scaleLinear().domain([parseFloat(minData),parseFloat(maxData)]).range([0,XAxisWidth-yAxisWidth])
  var x_axis = d3.axisBottom().scale(xScale).tickSizeInner(0).tickSizeOuter(0)
  var xAxis = mainSvg
    .append("g")
    .attr("class", "xAxis")
    .attr("id", "xAxis")
    .call(x_axis)
    .attr("transform", function(){
      return `translate(${yAxisWidth}, ${YAxisHeight+YAxisMargin.top})`
    })
  var xAxisLabel = xAxis
    .selectAll("text")
    .attr("fill", config.xAxis.label.color)
    .attr("font-size", 20 * resolutionScale)
    .attr("font-family", "Plus Jakarta Sans")
  // Move first and last label inside
  xAxisLabel
    .attr("transform", function(d,i){
      var labeWidth = this.getBBox().width
      var tx = 0
      if(i == xAxisLabel.size() - 1)
        tx = - labeWidth/2
      if(i == 0)
        tx = labeWidth / 2
      return `translate(${tx},${0})`
    })

    
  var xAxisLine = xAxis
    .selectAll("line,path")
    .attr("stroke", config.xAxis.tick.color)
    .attr("stroke-width", 0.3)
}

const removeSvg = () => {
  d3.select("#chart-wrapper").selectAll("*").remove()
}
// Resize
const resizeHandler = (event) => {
  if(event){
    width = event.currentTarget.innerWidth
    height = event.currentTarget.innerHeight
  } else { // First time
    width = window.innerWidth
    height = window.innerHeight
  }
  draw({data: tempData})
}

const transformData = (newData) => {
  // Assign global data variable
  data = newData
 
  // Declare tempData to work with
  tempData = structuredClone(newData)

  // Create col_rel to refer the data easier
  Object.keys(binding).forEach(
    e => col_rel[e] = tempData.columns[binding[e]]
  )

  // Create a resizeHandler event with d3
  d3.select(window).on('resize.updatesvg', resizeHandler)

  // Initial draw by calling resizeHandler
  resizeHandler()
}

// Parse data from csv file
d3.csv("/Data.csv").then(transformData)