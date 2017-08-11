import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from "../models/vehicle";
import { AuthHttp } from "angular2-jwt/angular2-jwt";
@Injectable()
export class VehicleService {
    private readonly vehiclesEndpoint = '/api/vehicles';

    constructor(private http: Http) { }
    //constructor(private http: Http, private authHttp: AuthHttp) { }

    getFeatures() {
        return this.http.get('http://localhost:5000/api/features')
            .map(res => res.json());
    }

    getMakes() {
        return this.http.get('http://localhost:5000/api/makes')
            .map(res => res.json());
    }

    create(vehicle) {
        //return this.authHttp.post(this.vehiclesEndpoint, vehicle)
        return this.http.post(this.vehiclesEndpoint, vehicle)
            .map(res => res.json());
    }

    getVehicle(id) {
        return this.http.get('http://localhost:5000/api/vehicles/' + id)
            .map(res => res.json());
    }

    getVehicles(filter) {
        return this.http.get('http://localhost:5000/api/vehicles' + '?' + this.toQueryString(filter))
            .map(res => res.json());
    }

    toQueryString(obj) {
        var parts = [];
        for (var property in obj) {
            var value = obj[property];
            if (value != null && value != undefined)
                parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
        }

        return parts.join('&');
    }

    update(vehicle: SaveVehicle) {
        // return this.authHttp.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle)
        return this.http.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle)
            .map(res => res.json());
    }

    delete(id) {
        // return this.authHttp.delete(this.vehiclesEndpoint + '/' + id)
        return this.http.delete(this.vehiclesEndpoint + '/' + id)
            .map(res => res.json());
    }
}
