// Global variables
let data = []
let tempData = []
let width = 1000
let height = 600

// Draw chart with given data
const draw = ({data}) => {
  console.log(data, width, height)
}

// Resize
const resizeHandler = () => {
  width = window.innerWidth
  height = window.innerHeight
  draw({data: tempData})
}

// Draw the barchart
const transformData = (newData) => {
  // Assign global data variable
  data = newData
 
  // Declare tempData to work with
  tempData = structuredClone(newData)

  // Create a resizeHandler event with d3
  d3.select(window).on('resize.updatesvg', resizeHandler)

  // Initial draw by calling resizeHandler
  resizeHandler()
}

// Parse data from csv file
d3.csv("/Data.csv").then(transformData)