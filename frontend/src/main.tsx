import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { SpeechProvider } from "./hooks/useSpeech";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SpeechProvider>
        <App />
      </SpeechProvider>
    </BrowserRouter>
  </StrictMode>
);
