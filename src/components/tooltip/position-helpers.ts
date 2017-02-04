export interface ICalculateCenterPositionOptions {
    contentEdge: number;
    contentOffsetEdge: number;
    targetEdge: number;
    targetSize: number;
    contentOffsetSize: number;
}

export interface ICalculateEdgePosition {
    contentEdge: number;
    contentOffsetEdge: number;
    contentOffsetSize: number;
    targetEdge: number;
    targetSize: number;
    positionNearSide: boolean;
}

export function calculateCenteredOffsetPosition(o: ICalculateCenterPositionOptions): number {
    const containerParentOffset: number = o.contentEdge - o.contentOffsetEdge;
    const offsetAdjustedEdge: number = o.targetEdge - containerParentOffset;

    return offsetAdjustedEdge + (o.targetSize - o.contentOffsetSize) / 2;
}

export function calculateEdgeOffsetPosition (o: ICalculateEdgePosition): number {
    const containerEdgeOffset: number = o.contentEdge - o.contentOffsetEdge;
    const nearsideTooltipPosition: number = o.targetEdge - containerEdgeOffset - o.contentOffsetSize;
    const farSideTooltipPosition: number = o.targetEdge - containerEdgeOffset + o.targetSize;

    return o.positionNearSide ? nearsideTooltipPosition : farSideTooltipPosition;
}
