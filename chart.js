// Global variables
let data = []
let tempData = []
let chartBox = {}
let col_rel = {}
let binding = {"labels": 0,"values": 1,"groups": 2}
let width = 0
let height = 0

// Draw chart with given data
const draw = ({data}) => {
  removeSvg()
  
  // Declare main svg to draw our chart inside it
  console.log(width, height)
  var mainSvg = d3
    .select("#chart-wrapper")
    .append("svg")
    .attr("class", "mainSvg")
    .attr("width", width)
    .attr("height", height)

  var dataValues = data.map(e=>e[col_rel["values"]])
  var minData = d3.min(data.map(e=>e[col_rel["values"]]))
  var maxData = d3.max(data.map(e=>e[col_rel["values"]]))
  console.log(minData, maxData, dataValues)
  var xScale = d3.scaleLinear().domain([minData,maxData]).range([0,width])
  var xAxix = mainSvg
    .append("g")
    .attr("class", "xAxis")
    .attr("id", "xAxis")
    .attr("transform", `translate(${0}, ${height})`)
    .call(d3.axisBottom(xScale))

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

// Draw the barchart
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