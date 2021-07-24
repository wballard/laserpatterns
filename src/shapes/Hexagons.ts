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

/**
 * A parallelogram 120 deg wedge.
 */
export class ParallelogramWedge extends paper.Group {
  constructor(center: paper.Point, radius = 1, frameWidth = 0.1) {
    if (center instanceof paper.Point) {
      // longest part of the parallel
      const longArm = radius - frameWidth;
      // short part of the parallel -- need to do some math
      const hexagonSideLength = 2 * radius * Math.sin(Math.PI / 6);
      const shortArm = (hexagonSideLength - (5 / 2) * frameWidth) / 2;
      const top = center.add(new paper.Point(0, frameWidth / 2));
      // start drawing the parallelogram
      const left = top.add(new paper.Point(0, longArm)).rotate(60, top);
      const bottom = left.add(new paper.Point(0, shortArm)).rotate(-60, left);
      const right = bottom
        .add(new paper.Point(0, longArm))
        .rotate(-120, bottom);
      const wedge = new paper.Path([top, left, bottom, right, top]);
      const secondWedge = wedge.clone();
      // and offset that second wedge to make stripe slices
      secondWedge.translate(
        new paper.Point(shortArm + frameWidth, 0).rotate(
          30,
          new paper.Point(0, 0)
        )
      );
      super([wedge, secondWedge]);
    } else {
      super();
    }
  }
}

/**
 * A heaxagon with parallelogram slices removed.
 *
 * The exterior of a containing hexagon is implied and not drawn.
 */
export class ParallelogramHexagon extends paper.Group {
  constructor(
    center: paper.Point,
    radius = 1,
    frameWidth = 0.1,
    showSurround = false
  ) {
    if (center instanceof paper.Point) {
      // surround hexagon
      const surround = new Hexagon(center, radius);
      // and the window slices
      const wedge = new ParallelogramWedge(center, radius, frameWidth);
      const slices = [0, 1, 2].map((i) => {
        const slice = wedge.clone();
        slice.rotate(120 * i, center);
        return slice;
      });
      super([showSurround ? surround : null, ...slices]);
    } else {
      super();
    }
  }
}
