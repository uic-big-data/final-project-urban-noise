import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { DataService } from '../data.service';
import { Image as ImageLayer, Tile as TileLayer, Vector } from 'ol/layer';
import {Point} from 'ol/geom'
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { TileJSON}from 'ol/source'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Circle, Style,Icon } from 'ol/style';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import {
  Draw,
  Select,
  Translate,
  defaults as defaultInteractions,
} from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { shiftKeyOnly, click } from 'ol/events/condition';
import Polygon from 'ol/geom/Polygon';
//import { copyFileSync } from 'fs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  context = this;
  constructor(private dataService: DataService) {
  }

  ngAfterViewInit(): void {
    this.dataService
    .getSensorPoints()
    .subscribe((data: any) => {
      this.plotSensorPoints(data);
    });
  }
   plotSensorPoints(data: any):void{
    var i;
    const features = [];
    for (i = 0; i < data.length; i++) {
      console.log(data[i]);
      var iconFeature = new Feature({
        id: data[i].sensor_id,
        geometry: new Point(fromLonLat([data[i].longitude, data[i].latitude]))
    });
    iconFeature.setId( data[i].sensor_id);
    features.push(iconFeature);
    }
    const vectorSource = new VectorSource({
      features: features
    });
    const vectorLayer = new Vector({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({color: 'blue'})
        })
      })
    });
    const tileLayer = new TileLayer({
      source: new OSM({
        url: 'https://s.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
      }),
    });
    const map = new Map({
      layers: [tileLayer,vectorLayer],
      target: 'map',
      view: new View({
        maxZoom: 15,
        center: transform([-73.99629,40.72951], 'EPSG:4326', 'EPSG:3857'),  
        zoom: 13,
      }),
    });
    function startMismacthComponent(id:any){
      //context.dataService.
    }
    map.on('click', function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      startMismacthComponent(feature?.getId());
    });
  }
}
