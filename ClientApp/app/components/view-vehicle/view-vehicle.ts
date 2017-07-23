import { ToastyService } from 'ng2-toasty';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from "../../services/photo.service";
import { ProgressService } from "../../services/progress.service";

@Component({
    templateUrl: 'view-vehicle.html',
    styleUrls: ['./view-vehicle.css']
})
export class ViewVehicleComponent implements OnInit {
    /*In order to link this field with the template variable #fileInput we need to decorate this with the viewchild decorator. */
    @ViewChild('fileInput') fileInput: ElementRef; //fileInput is of type ElementRef, because we're referencing one of the DOM elements.
    vehicle: any;
    vehicleId: number;
    photos: any[];
    progress: any;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private toasty: ToastyService,
        private progressService: ProgressService,
        private photoService: PhotoService,
        private vehicleService: VehicleService) {

        route.params.subscribe(p => {
            this.vehicleId = +p['id'];
            if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
                router.navigate(['/vehicles']);
                return;
            }
        });
    }

    ngOnInit() {
        this.photoService.getPhotos(this.vehicleId)
            .subscribe(photos => this.photos = photos);

        this.vehicleService.getVehicle(this.vehicleId)
            .subscribe(
            v => this.vehicle = v,
            err => {
                if (err.status == 404) {
                    this.router.navigate(['/vehicles']);
                    return;
                }
            });
    }

    delete() {
        if (confirm("Are you sure?")) {
            this.vehicleService.delete(this.vehicle.id)
                .subscribe(x => {
                    this.router.navigate(['/vehicles']);
                });
        }
    }

    uploadPhoto() {
        var nativeElement: HTMLInputElement = this.fileInput.nativeElement;

        /*Before uploading the file to the server we want to subscribe to our ProgressService*/
        this.progressService.uploadProgress
            .subscribe(progress => {
                console.log(progress);
                // Set the progress to this.progress first
                // before Angular has a chance to monkey patch
                this.zone.run(() => {
                    this.progress = progress;
                });
            },
            //set the progress field to null
            null,
            //for the completion of the observable
            () => { this.progress = null });

        this.photoService.upload(this.vehicleId, nativeElement.files[0])
            .subscribe(photo => {
                this.photos.push(photo);
            });
    }
}
