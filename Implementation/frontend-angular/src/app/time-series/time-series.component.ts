import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit {
  time = { hour: 7, minute: 0 }
  time1 = { hour: 9, minute: 0 }
  weekList:any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weeknum:any = [];
  public mapObject: MapComponent;
  form = new FormGroup({
    weekDay: new FormControl(),
    weekNumber: new FormControl()
  });
  constructor(private dataService: DataService) 
  {
    this.mapObject = new MapComponent(dataService)
   }
  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
    this.dataService
    .getTemporalMismatch([this.time.hour,this.time1.hour],this.form.value.weekDay, this.form.value.weekNumber)
    .subscribe((data: any) => {
        console.log(data);
        this.highlight(data.location);
  });
  }
  ngOnInit(): void {
    for(let i=1 ; i<=53 ; i++){
      this.weeknum.push(i);
    }
  }
  highlight(data:any){
    this.mapObject.highlightFeatures(data);
  }

}
