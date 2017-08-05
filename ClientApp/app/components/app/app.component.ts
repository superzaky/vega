import { Component } from '@angular/core';
import { VehicleService } from "../../services/vehicle.service";
import { PhotoService } from "../../services/photo.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AuthService, VehicleService, PhotoService]
})
export class AppComponent {
}
