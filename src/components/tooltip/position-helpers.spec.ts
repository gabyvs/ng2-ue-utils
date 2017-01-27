
import {
    ICalculateCenterPositionOptions, calculateCenteredOffsetPosition,
    ICalculateEdgePosition, calculateEdgeOffsetPosition
} from './position-helpers';
declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('position helpers', () => {
    it('calculateCenteredOffsetPosition', () => {
        const standard: ICalculateCenterPositionOptions = {
            contentEdge: 50,
            contentOffsetEdge: 20, // contentOffsetParent is offset 30px from window edge
            contentOffsetSize: 50,
            targetEdge: 180,
            targetSize: 150
        };
        const contentBiggerThanTarget: ICalculateCenterPositionOptions = {
            contentEdge: -50,
            contentOffsetEdge: -80, // contentOffsetParent is offset 30px from window edge, in this case off screen to the left
            contentOffsetSize: 150,
            targetEdge: 180,
            targetSize: 50
        };
        expect(calculateCenteredOffsetPosition(standard)).toBe(200);
        expect(calculateCenteredOffsetPosition(contentBiggerThanTarget)).toBe(100);
    });
    it('calculateEdgeOffsetPosition', () => {
        const standardNearSide: ICalculateEdgePosition = {
            contentEdge: 50,
            contentOffsetEdge: 20, // contentOffsetParent is offset 30px from window edge
            contentOffsetSize: 50,
            positionNearSide: true,
            targetEdge: 180,
            targetSize: 150
        };
        const standardFarSide: ICalculateEdgePosition = {
            contentEdge: 50,
            contentOffsetEdge: 20, // contentOffsetParent is offset 30px from window edge
            contentOffsetSize: 50,
            positionNearSide: false,
            targetEdge: 180,
            targetSize: 150
        };
        expect(calculateEdgeOffsetPosition(standardNearSide)).toBe(100);
        expect(calculateEdgeOffsetPosition(standardFarSide)).toBe(300);
    });
});
