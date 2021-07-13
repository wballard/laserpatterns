import React from "react";
import paper from "paper";
import { useWindowSize } from "react-use";

type PaperCanvasProps = {
  draw: (scope: paper.PaperScope) => void;
  afterDraw?: (svgContent: SVGElement) => void;
};

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  draw,
  afterDraw = console.log,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [scope, setScope] = React.useState<paper.PaperScope>();

  const windowSize = useWindowSize();

  const resize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Make it visually fill the positioned parent
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      // ...then set the internal size to match
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const scope = new paper.PaperScope();
      scope.setup(canvas);
      setScope(scope);
    }
  }, [draw]);

  React.useEffect(() => {
    if (scope) {
      resize();
      draw(scope);
      afterDraw(scope.project.exportSVG());
    }
  }, [windowSize, scope, draw, afterDraw]);

  return <canvas ref={canvasRef} id="canvas" />;
};
