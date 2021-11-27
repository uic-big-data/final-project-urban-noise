import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsComponent } from './details/details.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailsComponent,
    TimeSeriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule 
  ],
  providers: [DataService],
  bootstrap: [AppComponent, TimeSeriesComponent]
})
export class AppModule { }
