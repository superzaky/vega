import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

/*We're not using curly braces because this is the proper way to import auth0-lock*/
// Avoid name not found warnings
import Auth0Lock from 'auth0-lock';

@Injectable()
export class AuthService {
    profile: any;

    // Configure Auth0
    lock = new Auth0Lock('HjR3rU2tPV4zJO2fr52sfsk9SR9m7Ze8', 'vegaproject3.auth0.com', {});

    constructor() {
        this.profile = JSON.parse(localStorage.getItem('profile'));

        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem('token', authResult.accessToken);

            this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
                if (error)
                    throw error;

                console.log(profile);
                localStorage.setItem('profile', JSON.stringify(profile));
                this.profile = profile;
            });
        });
    }

    public login() {
        // Call the show method to display the widget.
        this.lock.show();
    }

    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'token'
        return tokenNotExpired('token');
    }

    public logout() {
        // Remove token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        this.profile = null;
    }
}