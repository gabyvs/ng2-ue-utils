import { Injectable } from '@angular/core';
import { IGAEventProps } from './gtm';

/**
 * Mock implementation of GTMService. All functions are provided as Jasmin spies.
 */
@Injectable()
export class GTMServiceMock {

    public registerPageTrack = jasmine.createSpy('registerPageTrack').and.callFake(
        (path: string) => {
            // Do nothing
        }
    );

    public registerEventTrack = jasmine.createSpy('registerEventTrack').and.callFake(
        (properties: IGAEventProps) => {
            // Do nothing
        }
    );

    public registerUserVisibleError = jasmine.createSpy('registerUserVisibleError').and.callFake(
        (errorMessage: string, pagePathName: string) => {
            // Do nothing
        }
    );

    public registerSPAEvent = jasmine.createSpy('registerSPAEvent').and.callFake(
        (properties: IGAEventProps) => {
            // Do nothing
        }
    );

    public registerClientCall = jasmine.createSpy('registerClientCall').and.callFake(
        (responseCode: number, path: string, responseTime: number) => {
            // Do nothing
        }
    );

    public updateGtmContext = jasmine.createSpy('updateGtmContext').and.callFake(
        (orgName?: string, uuid?: string, email?: string) => {
            // Do nothing
        }
    );

}
