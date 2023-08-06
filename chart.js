// Global variables
let data = []
let tempData = []
let chartBox = {}
let col_rel = {}
let binding = {"labels": 0,"values": 1,"groups": 2}
let width = 0
let height = 0

// Configs
config = {}
config.xAxis = {}
config.xAxis.label = {}
config.xAxis.label.color = "#03396c"

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
  
  // X Axis
  var XAxisWidth = width * 0.90
  XAxisMargin = {}
  XAxisMargin.left = (width - XAxisWidth) / 2
  XAxisMargin.bottom = 20 * resolutionScaleY
  var xScale = d3.scaleLinear().domain([parseFloat(minData),parseFloat(maxData)]).range([0,width * .9])
  var x_axis = d3.axisBottom().scale(xScale).tickSize(20 * resolutionScaleY)
  var xAxis = mainSvg
    .append("g")
    .attr("class", "xAxis")
    .attr("id", "xAxis")
    .call(x_axis)
    .attr("transform", function(){
      return `translate(${XAxisMargin.left}, ${height - this.getBBox().height - XAxisMargin.bottom})`
    })
  var xAxisLabel = xAxis
    .selectAll("text")
    .attr("fill", config.xAxis.label.color)
    .attr("font-size", 20 * resolutionScale)

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