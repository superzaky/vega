import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BrowserXhr } from "@angular/http";

@Injectable()
export class ProgressService {
    uploadProgress: Subject<any> = new Subject();
    downloadProgress: Subject<any> = new Subject();
}

// XMLHttpRequest
// BrowserXhr (Xhr stands for Xml http request)
@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr  {
    /*a Subject is like a observable, but it also has a method for pushing a new value into the observable. */
    uploadProgress: Subject<any> = new Subject();
    downloadProgress: Subject<any> = new Subject();

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
        xhr.onprogress = (event) => {
            //here we can track of the download progress
            this.service.downloadProgress.next(this.createProgress(event));
        };

        xhr.upload.onprogress = (event) => {
            //here we can track of the upload progress
            this.service.uploadProgress.next(this.createProgress(event));
        };

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
