import React from "react";
import "./App.css";
import { PaperCanvas } from "./PaperCanvas";
import { sample } from "./drawings/sample";

function App() {
  return <PaperCanvas draw={sample} />;
}

export default App;
