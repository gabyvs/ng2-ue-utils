import { Component } from '@angular/core';

/**
 * Showing an animation of dots when it is necessary to show that something it is still being loaded.
 * It is intended to be used only in small sections of a page.
 *
 * ### Simple Example
 *
 * ```
 * <loading-dots></loading-dots>
 * ```
 *
 * ### Example for altering the size of the dots
 *
 * ```
 * <loading-dots [style.font-size]="'54px'"></loading-dots>
 * ```
 */
@Component({
    selector: 'loading-dots',
    styles: [`
        @-webkit-keyframes opacity {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        @-moz-keyframes opacity {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        .loading-dots-container {
            text-align: center;
        }
        .loading-dots {
            text-align: center;
            //margin: 100px 0 0 0;
            //font-size: larger;
        }
        .loading-dots span {
            -webkit-animation-name: opacity;
            -webkit-animation-duration: 1s;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-name: opacity;
            -moz-animation-duration: 1s;
            -moz-animation-iteration-count: infinite;
        }
        .loading-dots span:nth-child(2) {
            -webkit-animation-delay: 100ms;
            -moz-animation-delay: 100ms;
        }
        .loading-dots span:nth-child(3) {
            -webkit-animation-delay: 300ms;
            -moz-animation-delay: 300ms;
        }
    `],
    template: `
        <div class="loading-dots-container">
            <span class="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        </div>
    `
})
export class LoadingDots {}
