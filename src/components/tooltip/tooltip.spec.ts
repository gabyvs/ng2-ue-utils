import {
    ComponentFixture,
    TestBed
}                           from '@angular/core/testing';
import { By }               from '@angular/platform-browser';
import { Renderer }         from '@angular/core';
import { Tooltip, ITooltipOptions }          from './tooltip';
import { TooltipService }   from '../../directives/tooltip/tooltip-service';
import * as _ from 'lodash';

import {
    TooltipServiceMock, mockRectGenerator, r, IElementOffsets, mockOffsetGenerator,
    mockTargetElementGenerator
} from './mocks';
import * as helpers from './position-helpers';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Tooltip', () => {
    let fixture: ComponentFixture<Tooltip>;
    let tooltip: Tooltip;
    let tooltipContainerEl,
        tooltipContentEl,
        tooltipPointerEl,
        service,
        renderer;

    const initialize = () => {
        fixture.detectChanges();
        tooltipContainerEl = fixture.debugElement.query(By.css('.ue-tooltip-container')).nativeElement;
        tooltipContentEl = fixture.debugElement.query(By.css('.ue-tooltip-content')).nativeElement;
        tooltipPointerEl = fixture.debugElement.query(By.css('.ue-tooltip-pointer')).nativeElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Tooltip ],
            providers:      [ 
                Renderer,
                { provide: TooltipService, useClass: TooltipServiceMock } 
            ]
        });

        fixture = TestBed.createComponent(Tooltip);
        tooltip = fixture.componentInstance;
        service = TestBed.get(TooltipService);
        renderer = TestBed.get(Renderer);
    });

    it('should initialize element', () => {
        initialize();
        
        expect(tooltip).toBeDefined();
        expect(tooltipContainerEl.classList.length).toBe(1);
        expect(tooltipContentEl.classList.contains('ue-tooltip-content-')).toBe(true);
        expect(tooltipPointerEl.classList.contains('ue-tooltip-pointer-')).toBe(true);
    });
    
    it('should receive tooltip options from the tooltip service and set state on the component', done => {
        const setOptionsSpy = spyOn(tooltip, 'setOptions').and.callThrough();
        const requestAnimationFrameSpy = spyOn(window, 'requestAnimationFrame');
        // const setElementStyleSpy = spyOn(renderer, 'setElementStyle'); // TODO - why can't I spy on this?
        const target: HTMLElement = document.createElement('div');
        const target2: HTMLElement = document.createElement('div');
        const hoverButDisabledOptions: ITooltipOptions = {
            content: 'content',
            enabled: false,
            hovering: true,
            maxWidth: 250,
            placement: 'left',
            target: target,
        };
        const hoverAndEnabledOptions: ITooltipOptions = {
            content: 'more content',
            enabled: true,
            hovering: true,
            maxWidth: 350,
            placement: 'right',
            target: target2,
        };
        const mouseleaveOptions: ITooltipOptions = {
            content: 'content',
            enabled: true,
            hovering: false,
            maxWidth: 250,
            placement: 'left',
            target: undefined,
        };
        let counter: number = 0;
        
        initialize();
        
        service.tooltipOptions.subscribe(
            (options: ITooltipOptions) => {
                counter++;
                switch (counter) {
                    case 1:
                        expect(setOptionsSpy).toHaveBeenCalledWith(undefined);
                        expect(setOptionsSpy).toHaveBeenCalledTimes(1);
                        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
                        // expect(setElementStyleSpy).not.toHaveBeenCalled();
                        expect(_.isEmpty(tooltip.options)).toBe(true);
                        expect(tooltip.showTooltip).toBe(false);
                        expect(tooltip.disabled).toBe(false);
                        break;
                    case 2:
                        expect(tooltip.options).toBe(hoverButDisabledOptions);
                        Object.keys(options).forEach(prop => expect(tooltip.options[prop]).toBe(options[prop]));
                        expect(setOptionsSpy).toHaveBeenCalledTimes(2);
                        expect(setOptionsSpy).toHaveBeenCalledWith(hoverButDisabledOptions);
                        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
                        // expect(setElementStyleSpy).toHaveBeenCalledTimes(1);
                        expect(tooltip.disabled).toBe(true);
                        expect(tooltip.showTooltip).toBe(false);
                        break;
                    case 3:
                        expect(tooltip.options).toBe(hoverAndEnabledOptions);
                        Object.keys(options).forEach(prop => expect(tooltip.options[prop]).toBe(options[prop]));
                        expect(setOptionsSpy).toHaveBeenCalledTimes(3);
                        expect(setOptionsSpy).toHaveBeenCalledWith(hoverAndEnabledOptions);
                        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
                        // expect(setElementStyleSpy).toHaveBeenCalledTimes(2);
                        expect(tooltip.disabled).toBe(false);
                        expect(tooltip.showTooltip).toBe(true);
                        break;
                    case 4:
                        expect(tooltip.options).toBe(mouseleaveOptions);
                        Object.keys(options).forEach(prop => expect(tooltip.options[prop]).toBe(options[prop]));
                        expect(setOptionsSpy).toHaveBeenCalledTimes(4);
                        expect(setOptionsSpy).toHaveBeenCalledWith(mouseleaveOptions);
                        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
                        // expect(setElementStyleSpy).toHaveBeenCalledTimes(3);
                        expect(tooltip.disabled).toBe(false);
                        expect(tooltip.showTooltip).toBe(false);
                        done();
                        break;
                    default: 
                        expect('Should not enter default case').toBeUndefined();
                        break;
                }
            }
        );
        
        service.observer.next(hoverButDisabledOptions);
        service.observer.next(hoverAndEnabledOptions);
        service.observer.next(mouseleaveOptions);
        
    });
    
    it('should properly position the tooltip element in relation to the received target', done => {
        const calculateEdgePositionSpy = spyOn(helpers, 'calculateEdgeOffsetPosition').and.callThrough();
        const calculateCenteredPositionSpy = spyOn(helpers, 'calculateCenteredOffsetPosition').and.callThrough();
        const setNewPositionSpy = spyOn(tooltip, 'setNewPosition');
        spyOn(window, 'requestAnimationFrame').and.callFake(cb => cb()); // execute requestAnimationFrame synchronously
        // const setElementStyleSpy = spyOn(renderer, 'setElementStyle'); // TODO - why can't I spy on this?
        const randomizedRect: ClientRect = mockRectGenerator(r(100), r(100), r(100), r(100));
        const randomizedOffsets: IElementOffsets = mockOffsetGenerator(r(100, true), r(100, true), r(100, true), 
            r(100, true));
        const emissionTarget: HTMLElement = mockTargetElementGenerator(randomizedRect, randomizedOffsets);
        const emissionTop: ITooltipOptions = {
            content: 'content',
            enabled: true,
            hovering: true,
            maxWidth: 250,
            placement: 'top',
            target: emissionTarget
        };
        const emissionBottom: ITooltipOptions = {
            content: 'content',
            enabled: true,
            hovering: true,
            maxWidth: 250,
            placement: 'bottom',
            target: emissionTarget
        };
        const emissionLeft: ITooltipOptions = {
            content: 'content',
            enabled: true,
            hovering: true,
            maxWidth: 250,
            placement: 'left',
            target: emissionTarget
        };
        const emissionRight: ITooltipOptions = {
            content: 'content',
            enabled: true,
            hovering: true,
            maxWidth: 250,
            placement: 'right',
            target: emissionTarget
        };
        let counter: number = 0;
        
        initialize();
        
        service.tooltipOptions.subscribe(
            (options: ITooltipOptions) => {
                counter++;
                switch (counter) {
                    case 1:
                        expect(_.isEmpty(tooltip.options)).toBe(true);
                        expect(tooltip.showTooltip).toBe(false);
                        expect(tooltip.disabled).toBe(false);
                        break;
                    case 2: // emission top
                        expect(options.target).toBe(emissionTarget);
                        expect(calculateEdgePositionSpy).toHaveBeenCalled();
                        expect(calculateCenteredPositionSpy).toHaveBeenCalled();
                        expect(options.target).toBe(emissionTarget);
                        expect(calculateEdgePositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().top,
                            contentOffsetEdge: tooltipContainerEl.offsetTop,
                            contentOffsetSize: tooltipContainerEl.offsetHeight,
                            positionNearSide: true,
                            targetEdge: options.target.getBoundingClientRect().top,
                            targetSize: options.target.offsetHeight
                        });
                        expect(calculateCenteredPositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().left,
                            contentOffsetEdge: tooltipContainerEl.offsetLeft,
                            contentOffsetSize: tooltipContainerEl.offsetWidth,
                            targetEdge: options.target.getBoundingClientRect().left,
                            targetSize: options.target.offsetWidth
                        });
                        expect(setNewPositionSpy).toHaveBeenCalled();
                        calculateCenteredPositionSpy.calls.reset();
                        calculateEdgePositionSpy.calls.reset();
                        break;
                    case 3: // emission bottom
                        expect(options.target).toBe(emissionTarget);
                        expect(calculateEdgePositionSpy).toHaveBeenCalled();
                        expect(calculateCenteredPositionSpy).toHaveBeenCalled();
                        expect(calculateEdgePositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().top,
                            contentOffsetEdge: tooltipContainerEl.offsetTop,
                            contentOffsetSize: tooltipContainerEl.offsetHeight,
                            positionNearSide: false,
                            targetEdge: options.target.getBoundingClientRect().top,
                            targetSize: options.target.offsetHeight
                        });
                        expect(calculateCenteredPositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().left,
                            contentOffsetEdge: tooltipContainerEl.offsetLeft,
                            contentOffsetSize: tooltipContainerEl.offsetWidth,
                            targetEdge: options.target.getBoundingClientRect().left,
                            targetSize: options.target.offsetWidth
                        });
                        expect(setNewPositionSpy).toHaveBeenCalled();
                        calculateCenteredPositionSpy.calls.reset();
                        calculateEdgePositionSpy.calls.reset();
                        break;
                    case 4: // emission left
                        expect(options.target).toBe(emissionTarget);
                        expect(calculateEdgePositionSpy).toHaveBeenCalled();
                        expect(calculateCenteredPositionSpy).toHaveBeenCalled();
                        expect(calculateEdgePositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().left,
                            contentOffsetEdge: tooltipContainerEl.offsetLeft,
                            contentOffsetSize: tooltipContainerEl.offsetWidth,
                            positionNearSide: true,
                            targetEdge: options.target.getBoundingClientRect().left,
                            targetSize: options.target.offsetWidth
                        });
                        expect(calculateCenteredPositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().top,
                            contentOffsetEdge: tooltipContainerEl.offsetTop,
                            contentOffsetSize: tooltipContainerEl.offsetHeight,
                            targetEdge: options.target.getBoundingClientRect().top,
                            targetSize: options.target.offsetHeight
                        });
                        expect(setNewPositionSpy).toHaveBeenCalled();
                        calculateCenteredPositionSpy.calls.reset();
                        calculateEdgePositionSpy.calls.reset();
                        break;
                    case 5: // emission right
                        expect(options.target).toBe(emissionTarget);
                        expect(calculateEdgePositionSpy).toHaveBeenCalled();
                        expect(calculateCenteredPositionSpy).toHaveBeenCalled();
                        expect(calculateEdgePositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().left,
                            contentOffsetEdge: tooltipContainerEl.offsetLeft,
                            contentOffsetSize: tooltipContainerEl.offsetWidth,
                            positionNearSide: false,
                            targetEdge: options.target.getBoundingClientRect().left,
                            targetSize: options.target.offsetWidth
                        });
                        expect(calculateCenteredPositionSpy).toHaveBeenCalledWith({
                            contentEdge: tooltipContainerEl.getBoundingClientRect().top,
                            contentOffsetEdge: tooltipContainerEl.offsetTop,
                            contentOffsetSize: tooltipContainerEl.offsetHeight,
                            targetEdge: options.target.getBoundingClientRect().top,
                            targetSize: options.target.offsetHeight
                        });
                        expect(setNewPositionSpy).toHaveBeenCalled();
                        done();
                        break;
                    default: 
                        expect('Should not enter default case').toBeUndefined();
                        break;
                }
            }
        );
        
        service.observer.next(emissionTop);
        service.observer.next(emissionBottom);
        service.observer.next(emissionLeft);
        service.observer.next(emissionRight);
        
    });
});
