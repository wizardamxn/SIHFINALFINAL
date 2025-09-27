import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { SpeechProvider } from "./hooks/useSpeech";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SpeechProvider>
        <Suspense fallback={<div>Loading…</div>}>
          <App />
        </Suspense>
      </SpeechProvider>
    </BrowserRouter>
  </StrictMode>
);
