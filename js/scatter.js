'use strict'

function scatter(data, selector = '#scatter') {

    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = {
        left: 10,
        right: 10,
        top: 10,
        bottom: 70
    }

    // responsive width & height
    const svgWidth = 1200 //parseInt(d3.select(selector).style('width'), 10)
    const svgHeight = svgWidth

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right


    // add SVG

    d3.select(`${selector} svg`).remove();

    const svg = d3.select(selector)
    .append('svg')
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const metrics = ['Generosity', 'Learning', 'Attention', 'Emotion', 'Risk Tolerance', 'Decision Making', 'Effort', 'Fairness', 'Focus']
    let selectData = metrics.map(d => { return { "text": d } })

    let groups = Array.from(new Set(data.map(d => d.group)))
    groups = groups.sort((a, b) => a > b ? 1 : -1)

    var dropdown_div = body.append('div').attr('class', 'container')

    // Select X-axis Variable
    let x_select = dropdown_div.append('div').attr('class','dropdown')
    var span = x_select.append('span')
        .text('X-Axis: ')
    var yInput = x_select.append('select')
        .attr('id', 'xSelect')
        .on('change', xChange)
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    // Select Y-axis Variable
    let y_select = dropdown_div.append('div').attr('class', 'dropdown')
    var span = y_select.append('span')
        .text('Y-Axis: ')
    var yInput = y_select.append('select')
        .attr('id', 'ySelect')
        .on('change', yChange)
        .selectAll('option')
        .data(selectData)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text; })

    ////////////////////////////////////
    //////////////scales////////////////
    ////////////////////////////////////

    // time scale for X axis
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([-4, 4])

    // abritrary Y scale for health metrics
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([-4, 4])

    //band scale
    const legend = d3.scaleBand()
        .range([0, width])
        .domain(groups)

    // colour scales for all lines and legend
    const colorScale = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeTableau10)

    ////////////////////////////////////
    ///////////////axis/////////////////
    ////////////////////////////////////

    // X Axis 
    const xAxis = d3.axisBottom(xScale)

    // X gridline
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", 'scatter-grid')
        .attr("id", "scatter-x-axis")
        .call(xAxis.tickSizeInner(-height))

    // Y Axis
    const yAxis = d3.axisLeft(yScale)

    // Y gridline
    svg.append("g")
        .attr("class", 'scatter-grid')
        .attr("id", "scatter-y-axis")
        .call(yAxis.tickSize(-width))


    // Circles
    var circles = svg.selectAll('.scatter-balls')
        .data(data)
        .join('circle')
        .attr('cx', function (d) { return xScale(d['Generosity']) })
        .attr('cy', function (d) { return yScale(d['Learning']) })
        .attr('r', '10')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', function (d, i) { return colorScale(d['group']) })
        .attr('class', 'scatter-balls')

    function yChange() {
        var value = this.value // get the new y value
        d3.selectAll('.scatter-balls') // move the circles
            .transition().duration(500)
            .delay(function (d, i) { return i * 10 })
            .attr('cy', function (d) { return yScale(d[value]) })
    }

    function xChange() {
        var value = this.value // get the new x value
        d3.selectAll('.scatter-balls') // move the circles
            .transition().duration(500)
            .delay(function (d, i) { return i * 10 })
            .attr('cx', function (d) { return xScale(d[value]) })
    }
}