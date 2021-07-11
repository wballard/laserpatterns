import paper from "paper";
import {
  Hexagon,
  HexagonTrapezoidalWedge,
  HexagonWedge,
  WindowedHexagon,
} from "../shapes/Hexagons";

export const sample = (scope: paper.PaperScope) => {
  //circumscribed hexagon
  const center = new scope.Point(50, 50);
  const radius = 25;
  const black = new scope.Color("black");
  const green = new scope.Color("green");
  const blue = new scope.Color("blue");

  const circlePath = new scope.Path.Circle(center, radius);
  circlePath.strokeColor = black;
  const hexagonPath = new Hexagon(center, radius);
  hexagonPath.strokeColor = black;
  const wedge = new HexagonWedge(center, radius);
  wedge.strokeColor = green;
  const trap = new HexagonTrapezoidalWedge(center, radius, 0.5);
  trap.strokeColor = blue;
  trap.scale(0.75);

  // windowgon!
  const at = new scope.Point(200, 200);
  const windowHexagon = new WindowedHexagon(at, 25);
  windowHexagon.strokeColor = black;

  // Make a copy of the path and set its stroke color to red:
  const copy = circlePath.clone();
  copy.strokeColor = new scope.Color("red");

  // Move the copy to {x: 100, y: 100}
  copy.position = new scope.Point(100, 100);
};
