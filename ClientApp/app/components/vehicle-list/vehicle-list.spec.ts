import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VehicleListComponent } from "./vehicle-list";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { KeyValuePair, Contact } from "../../models/vehicle";
import { VehicleService } from "../../services/vehicle.service";


describe('BannerComponent (inline template)', () => {

    let comp: VehicleListComponent;
    let fixture: ComponentFixture<VehicleListComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    let componentVehicleService: VehicleService; // the actually injected service
    let vehicleService: VehicleService; // the TestBed injected service

    let vehicleServiceStub: {
        vehicle: {
            id: number;
            model: KeyValuePair;
            make: KeyValuePair;
            isRegistered: boolean;
            features: KeyValuePair[];
            contact: Contact;
            lastUpdate: string;
        }
    };

    beforeEach(() => {
        // stub UserService for test purposes
        vehicleServiceStub = {
            vehicle: {
                "id": 1,
                "model": {
                    "id": 1,
                    "name": "Make1-ModelA"
                },
                "make": {
                    "id": 1,
                    "name": "Make1"
                },
                "isRegistered": true,
                "contact": {
                    "name": "name",
                    "email": "email",
                    "phone": "phone"
                },
                "lastUpdate": "2017-06-28T12:08:31.6434971",
                "features": [
                    {
                        "id": 1,
                        "name": "Feature1"
                    },
                    {
                        "id": 2,
                        "name": "Feature2"
                    },
                    {
                        "id": 3,
                        "name": "Feature3"
                    }
                ]
            }
        };

        TestBed.configureTestingModule({
            declarations: [VehicleListComponent], // declare the test component
            imports: [RouterModule.forRoot([]), FormsModule],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: VehicleService, useValue: vehicleServiceStub }
            ]
        });

        fixture = TestBed.createComponent(VehicleListComponent);

        comp = fixture.componentInstance; // VehicleListComponent test instance

        // VehicleService actually injected into the component
        vehicleService = fixture.debugElement.injector.get(VehicleService);
        componentVehicleService = vehicleService;
        // VehicleService from the root injector
        vehicleService = TestBed.get(VehicleService);

        // query for the title <h2> by CSS element selector
        de = fixture.debugElement.query(By.css('h2'));
        el = de.nativeElement;
    });

    it('should display original title', () => {
        expect(el.textContent).toEqual("Vehicles");
    });
});
