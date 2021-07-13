import paper from "paper";
import { SixPetalFlowerHexagon, WindowedHexagon } from "../shapes/Hexagons";

/**
 * Bee hive point centers.
 * @param bounds
 * @param size
 * @param loose
 * @returns
 */
const generateBeeHivePoints = (
  bounds: paper.Size,
  radius: number,
  loose = false
) => {
  // hit test region to make sure a given tile is fully contained
  const container = new paper.Rectangle(new paper.Point(0, 0), bounds);
  // for a given point, compute a bounding box used to figure if it is
  // fully contained
  const isContained = (centerOfTile: paper.Point) => {
    const offset = new paper.Point(-radius, -radius);
    const size = new paper.Size(radius * 2, radius * 2);
    // make sure we are in container bounds
    const boundingBox = new paper.Rectangle(centerOfTile.add(offset), size);
    return container.contains(boundingBox);
  };
  // these are circubscribed polygons, so the radius is a bit 'big'
  // figure the 'real' tiling width by taking a 'plumb line'
  // this is a point that you 'offset' each tile
  const staggerOffset = new paper.Point(0, radius)
    .rotate(-60, new paper.Point(0, 0))
    .add(new paper.Point(0, radius));
  const xOffset = new paper.Point(staggerOffset.x * 2, 0);
  const yOffset = new paper.Point(0, staggerOffset.y * 2);

  // and this is the buffer where we keep the points found
  const points = new Array<paper.Point>();

  // start from the center, this will generate the best looking tiling
  // for the largest variety of bounds
  const center = new paper.Point(bounds.width / 2, bounds.height / 2);

  // now grow the center line in the positive direction until we are out of bounds
  const centerLinePoints = new Array<paper.Point>();
  // cursor
  let at = center;
  while (isContained(at)) {
    centerLinePoints.push(at);
    at = at.add(xOffset);
  }
  // at this point we have grown to the right -- now grow to the left
  // and now we have a full center line
  at = center.subtract(xOffset);
  while (isContained(at)) {
    centerLinePoints.push(at);
    at = at.subtract(xOffset);
  }
  points.push(...centerLinePoints);

  // may only be one point for small tilings
  if (points.length === 0) return [center];

  // and offset line starts with a stagger from the center
  const staggerLinePoints = new Array<paper.Point>();
  const staggerStart = (at = center.add(staggerOffset));
  // add in the positive direction
  while (isContained(at)) {
    staggerLinePoints.push(at);
    at = at.add(xOffset);
  }
  // and the negative direction
  at = staggerStart.subtract(xOffset);
  while (isContained(at)) {
    staggerLinePoints.push(at);
    at = at.subtract(xOffset);
  }

  // at this point we've figure out how far we need to go in X -- now we figure Y
  // this will be symmetric for the center line so we can get it in one loop
  at = centerLinePoints[0].add(yOffset);
  while (isContained(at)) {
    // in both directions
    const currentOffset = at.subtract(centerLinePoints[0]);
    points.push(...centerLinePoints.map((p) => p.add(currentOffset)));
    points.push(...centerLinePoints.map((p) => p.subtract(currentOffset)));
    at = at.add(yOffset);
  }

  // stagger rows -- this isn't quite as symmetrical as the center line
  // so run in two loops
  at = staggerLinePoints[0];
  while (isContained(at)) {
    // in both directions
    const currentOffset = at.subtract(staggerLinePoints[0]);
    points.push(...staggerLinePoints.map((p) => p.add(currentOffset)));
    at = at.add(yOffset);
  }
  // and now the negative direction, pre-offset so we don't double up
  at = staggerLinePoints[0].subtract(yOffset);
  while (isContained(at)) {
    // in both directions
    const currentOffset = at.subtract(staggerLinePoints[0]);
    // yes -- this is add -- the offset is negative
    points.push(...staggerLinePoints.map((p) => p.add(currentOffset)));
    at = at.subtract(yOffset);
  }

  // stack across rows and columns, staggering every other row by half a width
  return points;
};

export const sidePanel = (scope: paper.PaperScope) => {
  scope.project.clear();
  // undersized by 10
  const red = new scope.Color("red");
  const green = new scope.Color("green");
  const radius = 60;
  const border = 1;
  const bounds = new paper.Size(740, 320);
  //const bounds = new paper.Size(90, 90);
  const tilesAt = generateBeeHivePoints(bounds, radius);

  // at each one of our tiles -- draw our shape
  tilesAt.forEach((at) => {
    const trap = new SixPetalFlowerHexagon(at, radius - border, 0.6, 0.2);
    trap.strokeColor = green;
  });

  // and a cut out frame
  const frame = new paper.Shape.Rectangle(new paper.Point(0, 0), bounds);
  frame.strokeColor = red;
};
