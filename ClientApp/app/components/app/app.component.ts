import { Component } from '@angular/core';
import { FeatureService } from "../../services/feature.service";
import { MakeService } from "../../services/make.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MakeService, FeatureService]
})
export class AppComponent {
}
