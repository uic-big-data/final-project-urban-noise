import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { DataService } from '../data.service';
import { Image as ImageLayer, Tile as TileLayer, Vector } from 'ol/layer';
import { Point } from 'ol/geom'
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { TileJSON } from 'ol/source'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Circle, Style, Icon } from 'ol/style';
import {
  Draw,
  Select,
  Translate,
  defaults as defaultInteractions,
} from 'ol/interaction';
import * as d3 from 'd3';
import GeometryType from 'ol/geom/GeometryType';
import { shiftKeyOnly, click } from 'ol/events/condition';
import Polygon from 'ol/geom/Polygon';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectControlValueAccessor } from '@angular/forms';
import { DetailsComponent } from '../details/details.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  context = this;
  map: any;
  closeResult = '';
  data: any = [];
  that = this;
  currMismatchData: any;
  currMatchData: any;
  selectInteraction: any;
  vectorSource: any;
  features: any = [];
  time = { hour: 7, minute: 0 }
  time1 = { hour: 9, minute: 0 }
  weekList: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weeknum: any = [];
  resulttext: any;
  soundName: any;
  form = new FormGroup({
    weekDay: new FormControl(),
    weekNumber: new FormControl()
  });
  public detailsObject: DetailsComponent;
  constructor(private dataService: DataService) {
    this.detailsObject = new DetailsComponent();
  }
  ngAfterViewInit(): void {
    this.dataService
      .getSensorPoints()
      .subscribe((data: any) => {
        this.data = data;
        this.plotSensorPoints();
      });
    for (let i = 15; i <= 53; i++) {
      this.weeknum.push(i);
    }
  }
  plotSensorPoints(): void {
    var i;
    for (i = 0; i < this.data.length; i++) {
      //console.log(this.data[i]);
      var iconFeature = new Feature({
        id: this.data[i].sensor_id,
        geometry: new Point(fromLonLat([this.data[i].longitude, this.data[i].latitude]))
      });
      iconFeature.setId(this.data[i].sensor_id);
      this.features.push(iconFeature);
    }
    //console.log(this.features);
    this.vectorSource = new VectorSource({
      features: this.features
    });
    const vectorLayer = new Vector({
      source: this.vectorSource,
      style: new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'blue' })
        })
      })
    });
    const tileLayer = new TileLayer({
      source: new OSM({
        url: 'https://s.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
      }),
    });
    const drawingSource = new VectorSource({ wrapX: false });
    let draw = new Draw({
      source: drawingSource,
      type: GeometryType.POLYGON,
    });
    this.selectInteraction = new Select();
    var selectedFeatures = this.selectInteraction.getFeatures();
    const translate = new Translate({
      features: this.selectInteraction.getFeatures(),
    });
    this.map = new Map({
      layers: [tileLayer, vectorLayer],
      target: 'map',
      view: new View({
        maxZoom: 15,
        center: transform([-73.99629, 40.72951], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13,
      }),
    });
    this.map.on("click", (e: any) => {
      this.map.forEachFeatureAtPixel(e.pixel, (feature: any, layer: any) => {
        this.getMatchAndMismatch(feature.getId());
      })
    });
    this.map.addInteraction(this.selectInteraction);
    var drawingLayer = new Vector({
      source: drawingSource,
    });
    this.map.addLayer(drawingLayer);
    this.map.addInteraction(draw);
    this.map.addInteraction(this.selectInteraction);
    draw.on('drawstart',(e:any)=>{
      selectedFeatures.clear();
      selectedFeatures.setActive(true);
    }
    );
    
    draw.on('drawend', (e)=> {
      this.map.removeInteraction(draw);
      this.map.addInteraction(this.selectInteraction);
      this.map.addInteraction(translate);
      selectedFeatures.clear();
      delaySelectActivate();
      var selectedFeaturesIds = [];
      var polygon = e.feature.getGeometry();
      var features = vectorLayer.getSource().getFeatures();
      for (var i = 0; i < features.length; i++) {
        var activeFeature = features[i].getGeometry()?.getExtent();
        if (
          polygon &&
          activeFeature &&
          polygon.intersectsExtent(activeFeature)
        ) {
          selectedFeatures.push(features[i]);
          selectedFeaturesIds.push(features[i].getId());}
      }
      this.getMismatchForGeometry(selectedFeaturesIds);
    });
    
    translate.on('translateend', (event)=> {
      selectedFeatures.clear();
      var selectedFeaturesIds = [];
      let polygon: any = drawingLayer
        .getSource()
        .getFeatures()[0]
        .getGeometry();
      let features: any = vectorLayer.getSource().getFeatures();
      for (var i = 0; i < features.length; i++) {
        if (polygon.intersectsExtent(features[i].getGeometry().getExtent())) {
          selectedFeatures.push(features[i]);
            selectedFeaturesIds.push(features[i].getId());} 
      }
      this.getMismatchForGeometry(selectedFeaturesIds);
    });
    function delaySelectActivate() {
      setTimeout(()=> {
        //this.selectedFeatures.setActive(true);
      }, 300);
    }
  }
  getMismatchForGeometry(features: any){
    this.dataService.getMismatchChart({"sensor": features}).subscribe((data:any)=>{
      this.plotBarPlotForID(data.match, data.mismatch, 0, "");
    })
  }

  getMatchAndMismatch(id: any) {
    this.dataService
      .getSensorIdmismatch(id)
      .subscribe((data: any) => {
        this.plotBarPlotForID(data.match_count, data.mimatch_count, id, data.sound);
      });

  }
  plotBarPlotForID(match: any, mismatch: any, sensor_id: any, sound:any) {
    let d = [
      {
        sensor_id: sensor_id,
        type: "Match",
        count: match
      }, {
        sensor_id: sensor_id,
        type: "Mismatch",
        count: mismatch
      }
    ]
    this.detailsObject.drawBars(d, sound);
  }
  submit() {
    this.resulttext = '';
    console.log(this.form.value);
    this.dataService
      .getTemporalMismatch([this.time.hour, this.time1.hour], this.form.value.weekDay, this.form.value.weekNumber)
      .subscribe((data: any) => {
        console.log(data);
        this.highlightFeatures(data.sensors, data.prediction_according_to_week);
      });
  }
  highlightFeatures(sensors: any, sound: any) {
    this.resulttext = "The sensors where the mismatches are:"
    //console.log(this.features);
    let features = this.features;
    for (let i = 0; i < features.length; i++) {
      let id = features[i].getId();
      for (let j = 0; j < sensors.length; j++) {
        if (id == sensors[j]) {
          this.resulttext += sensors[j].toString() + ",";
          console.log("HI");
          this.selectInteraction.getFeatures().push(features[i]);
          this.selectInteraction.dispatchEvent({
            type: 'select',
            selected: [features[i]],
            deselected: []
          });
        }
      }
    }
    this.soundName = sound;
  }
}
