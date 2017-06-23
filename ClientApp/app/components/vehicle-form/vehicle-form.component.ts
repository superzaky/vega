import * as _ from 'underscore'; 
import { Component, OnInit } from '@angular/core';
import { VehicleService } from "../../services/vehicle.service";
import { ToastyService } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/Observable/forkJoin';
import { SaveVehicle, Vehicle } from "../../models/vehicle";

@Component({
    selector: 'app-vehicle-form',
    templateUrl: './vehicle-form.component.html',
    styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
    makes: any[];
    models: any[];
    features: any[];
    vehicle: SaveVehicle = {
        id: 0,
        makeId: 0,
        modelId: 0,
        isRegistered: false,
        features: [],
        contact: {
            name: '',
            email: '',
            phone: ''
        }
    };

    constructor(
        //we use this to read route parameters
        private route: ActivatedRoute,
        //we this to navigate the user to a different page if they pass an invalid id
        private router: Router,
        private vehicleService: VehicleService,
        private toastyService: ToastyService) {

        route.params.subscribe(p => {
            this.vehicle.id = +p['id']; //the "+" sign converts the variable to a number.
        });

    }

    ngOnInit() {
        var sources = [
            this.vehicleService.getMakes(),
            this.vehicleService.getFeatures(),
        ];

        //if it has a value and is "truthy", which means it's not zero.
        if (this.vehicle.id)
            //push new observable into our sources array
            sources.push(this.vehicleService.getVehicle(this.vehicle.id))

        Observable.forkJoin(sources).subscribe(data => {
            this.makes = data[0];
            this.features = data[1];

            if (this.vehicle.id)
                this.setVehicle(data[2]);
        }, err => {
            if (err.status == 404)
                this.router.navigate(['/home']);
        });
    }

    private setVehicle(v: Vehicle) {
        this.vehicle.id = v.id;
        this.vehicle.makeId = v.make.id;
        this.vehicle.modelId = v.model.id;
        this.vehicle.isRegistered = v.isRegistered;
        this.vehicle.contact = v.contact;
        this.vehicle.features = _.pluck(v.features, 'id');
    }

    onMakeChange() {
        //console.log("VEHICLE", this.vehicle);
        var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
        this.models = selectedMake ? selectedMake.models : [];
        delete this.vehicle.modelId;
    }

    onFeatureToggle(featureId, $event) {
        if ($event.target.checked)
            this.vehicle.features.push(featureId);
        else {
            var index = this.vehicle.features.indexOf(featureId);
            //with the splice() method we remove 1 feature object through index
            this.vehicle.features.splice(index, 1);
        }
    }

    submit() {
        this.vehicleService.create(this.vehicle)
            .subscribe(x => console.log(x));
    }
}
