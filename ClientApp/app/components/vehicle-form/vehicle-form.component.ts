import { Component, OnInit } from '@angular/core';
import { VehicleService } from "../../services/vehicle.service";
import { ToastyService } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-vehicle-form',
    templateUrl: './vehicle-form.component.html',
    styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
    makes: any[];
    models: any[];
    features: any[];
    vehicle: any = {
        features: [],
        contact: {}
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
        this.vehicleService.getVehicle(this.vehicle.id)
            .subscribe(v => {
                this.vehicle = v;
            }, err => {
                if (err.status == 404)
                    this.router.navigate(['/home']);
            });

        this.vehicleService.getMakes().subscribe(makes => {
            this.makes = makes;
            //console.log("MAKES", this.makes);
        });

        this.vehicleService.getFeatures().subscribe(features => {
            this.features = features;
        });
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
