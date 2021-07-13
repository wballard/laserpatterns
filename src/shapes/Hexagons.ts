import paper from "paper";

/**
 * A simple hexagon at a point with a size.
 */
export class Hexagon extends paper.Path.RegularPolygon {
  constructor(center: paper.Point, radius: number) {
    super(center, 6, radius);
  }
}

/**
 * A wedge of a hexagon. Looks like good old Trivial Pursuit.
 */
export class HexagonWedge extends paper.Path {
  constructor(center?: paper.Point, radius = 1) {
    if (center instanceof paper.Point) {
      // build up the triangular segments starting from the center
      const seed = center.add(new paper.Point(radius, 0));
      const topRight = seed.rotate(-30, center);
      const bottomRight = seed.rotate(30, center);
      super([center, topRight, bottomRight, center]);
    } else {
      super();
    }
  }
}

/**
 * A single petal wedge, drawn to the right.
 */
export class HexagonPetal extends paper.Path {
  constructor(center?: paper.Point, radius = 1, scale = 1) {
    if (center instanceof paper.Point) {
      // start with a pie wedge
      const fullWedge = new HexagonWedge(center, radius);
      fullWedge.scale(scale);

      // there is a bit of an implied stem
      const stemUpperLeft = center.subtract(new paper.Point(0, radius / 20));
      const stem = new paper.Path.Rectangle(
        stemUpperLeft,
        new paper.Size(radius * 0.75, radius / 10)
      );

      const petal = fullWedge.subtract(stem);

      // finally kill the hard edges
      petal.smooth({ type: "catmull-rom", factor: 0.8 });
      super(petal.pathData);
    } else {
      super();
    }
  }
}

/**
 * A trapezoidal wedge. HexagonWedge with it's hat cut off. Illuminati.
 */
export class HexagonTrapezoidalWedge extends paper.Path {
  constructor(center: paper.Point, radius = 1, percentToClip = 0.5) {
    if (center instanceof paper.Point) {
      const fullWedge = new HexagonWedge(center, radius);
      const hat = new HexagonWedge(center, radius * percentToClip);
      const trapezoid = fullWedge.subtract(hat);
      super(trapezoid.pathData);
    } else {
      super();
    }
  }
}

/**
 * A windowed hexagon, with trapezoidal segments, along with
 * a center hexagon.
 *
 * The exterior of a containing hexagon is implied and not drawn.
 */
export class WindowedHexagon extends paper.Group {
  constructor(
    center: paper.Point,
    radius = 1,
    percentToClip = 0.5,
    percentForFraming = 0.2
  ) {
    if (center instanceof paper.Point) {
      // center hexagon
      const window = new Hexagon(center, radius * percentToClip);
      window.scale(1 - percentForFraming);
      // and the window slices
      const wedge = new HexagonTrapezoidalWedge(center, radius, percentToClip);
      const slices = [0, 1, 2, 3, 4, 5].map((i) => {
        const slice = wedge.clone();
        slice.rotate(60 * i, center);
        slice.scale(1 - percentForFraming);
        return slice;
      });
      super([window, ...slices]);
    } else {
      super();
    }
  }
}

/**
 * A six petal flower hexagon cutout.
 *
 * The exterior of a containing hexagon is implied and not drawn.
 */
export class SixPetalFlowerHexagon extends paper.Group {
  constructor(
    center: paper.Point,
    radius = 1,
    percentToClip = 0.5,
    percentForFraming = 0.2
  ) {
    if (center instanceof paper.Point) {
      // and the window slices
      const wedge = new HexagonPetal(center, radius, 1 - percentForFraming);
      const slices = [0, 1, 2, 3, 4, 5].map((i) => {
        const slice = wedge.clone();
        slice.rotate(60 * i, center);
        slice.scale(1 - percentForFraming);
        return slice;
      });
      super([...slices]);
    } else {
      super();
    }
  }
}
