﻿import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PhotoService {

    constructor(private http: Http) { }

    upload(vehicleId, photo) {
        //this is one of the native JavaScript objects
        var formData = new FormData();
        formData.append('file', photo);
        //we are using template strings in Typescript for example: `/api/vehicles/${vehicleId}/photos`
        return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData)
            .map(res => res.json());
    }
}
