import { Component } from '@angular/core';
import { VehicleService } from "../../services/vehicle.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [VehicleService]
})
export class AppComponent {
}
