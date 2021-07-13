import React from "react";
import "./App.css";
import { PaperCanvas } from "./PaperCanvas";
import { sidePanel } from "./drawings/sidePanel";
import {
  Container,
  Box,
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DownloadIcon from "@material-ui/icons/Download";

function App() {
  const [svgContent, setSvgContent] = React.useState<SVGElement>();
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const download = React.useCallback(() => {
    if (svgContent) {
      console.log(svgContent);
      const s = new XMLSerializer();
      const element = document.createElement("a");
      const file = new Blob([s.serializeToString(svgContent)], {
        type: "image/svg+xml",
      });
      element.href = URL.createObjectURL(file);
      element.download = "drawing.svg";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  }, [svgContent]);

  const afterDraw = React.useCallback(
    (content: SVGElement) => {
      setSvgContent(content);
    },
    [setSvgContent]
  );

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Laser Patterns
          </Typography>
          <IconButton color="inherit" onClick={download}>
            <DownloadIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: "72px" }}>
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
          <PaperCanvas draw={sidePanel} afterDraw={afterDraw} />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
