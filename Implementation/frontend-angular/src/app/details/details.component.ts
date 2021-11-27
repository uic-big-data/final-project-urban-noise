import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  drawBars(data:any){
    var node = document.getElementsByTagName('figure')[0]; //Removing the previous node on the screen
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    console.log(data);
    let svg: any;
     let margin = 50;
     let width = 400 - margin * 2;
    let height = 300 - margin * 2;
    svg = d3
    .select('figure#bar')
    .append('svg')
    .attr('width', width + margin * 2)
    .attr('height', height + margin * 2)
    .append('g')
    .attr('transform', 'translate(' +margin + ',' + margin + ')');
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d:any) => d.type))
      .padding(0.1);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(13,0)')
      .style('text-anchor', 'end');
    const y = d3.scaleLinear().domain([0, 30]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y)).append('text');
    svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.type))
      .attr('y', (d: any) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => height - y(d.count))
    svg
      .selectAll('text.bar')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar')
      .attr('text-anchor', 'right')
      .attr('x', (d: any) => x(d.type))
      .attr('y', (d: any) => y(d.count))
}
}
