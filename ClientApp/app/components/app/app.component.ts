import { Component } from '@angular/core';
import { VehicleService } from "../../services/vehicle.service";
import { PhotoService } from "../../services/photo.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [VehicleService, PhotoService]
})
export class AppComponent {
}
