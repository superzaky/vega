import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BrowserXhr } from "@angular/http";

@Injectable()
export class ProgressService {
    /*a Subject is like a observable, but it also has a method for pushing a new value into the observable. */
    private uploadProgress: Subject<any>;

    /*We want the client of the service which is our ViewVehicleComponent to get access to the subject via
    this method. And that means that the uploadProgress variable must be private.
    */
    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress) {
        this.uploadProgress.next(progress);
    }

    endTracking() {
        this.uploadProgress.complete();
    }
}

// XMLHttpRequest
// BrowserXhr (Xhr stands for Xml http request)
@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr  {

    //In the constructor we inject our ProgressService
    constructor(private service: ProgressService) {
        /*Because we are extending one of the Angular classes we need to call the constructor of the base class */
        super();
    }

    //override build() method which returns a XMLHttpRequest object
    build(): XMLHttpRequest {
        //we get a XMLHttpRequest object that is build by the base class.
        var xhr: XMLHttpRequest = super.build();

        /*Here is where the magic happens before we return the XMLHttpRequest object. We're gonna subscribe
        on onprogress event of this object. */
        xhr.upload.onprogress = (event) => {
            //here we can track of the upload progress
            this.service.notify(this.createProgress(event));
        };

        xhr.upload.onloadend = () => {
            this.service.endTracking();
        }

        return xhr;
    }

    private createProgress(event) {
        return {
            //total number of bytes for downloading/uploading depending of the event
            total: event.total,
            //event.loaded = number of bytes transfered
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}
