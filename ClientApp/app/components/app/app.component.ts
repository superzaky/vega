import { Component } from '@angular/core';
import { MakeService } from "../../services/make.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MakeService]
})
export class AppComponent {
}
