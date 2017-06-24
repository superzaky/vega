import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from "../models/vehicle";
@Injectable()
export class VehicleService {

    constructor(private http: Http) { }

    getFeatures() {
        return this.http.get('http://localhost:5000/api/features')
            .map(res => res.json());
    }

    getMakes() {
        return this.http.get('http://localhost:5000/api/makes')
            .map(res => res.json());
    }

    create(vehicle) {
        return this.http.post('/api/vehicles', vehicle)
            .map(res => res.json());
    }

    getVehicle(id) {
        return this.http.get('http://localhost:5000/api/vehicles/' + id)
            .map(res => res.json());
    }

    update(vehicle: SaveVehicle) {
        return this.http.put('/api/vehicles/' + vehicle.id, vehicle)
            .map(res => res.json());
    }

    delete(id) {
        return this.http.delete('/api/vehicles/' + id)
            .map(res => res.json());
    }
}
