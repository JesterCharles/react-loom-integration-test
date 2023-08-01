import { setup, isSupported } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";
import { useEffect, useState } from "react";

const PUBLIC_APP_ID = "b21c58eb-ab63-4ed1-9fb7-7e23d4290374";
const BUTTON_ID = "loom-record-sdk-button";

export default function App() {
  const [videoHTML, setVideoHTML] = useState("");

  useEffect(() => {
    async function setupLoom() {
      const { supported, error } = await isSupported();
      localStorage.setItem('title', 'Charles Jester Testing Local Storage to set Video Title')

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        publicAppId: PUBLIC_APP_ID,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.on("insert-click", async (video) => {
        video.title = localStorage.getItem('title');
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        setVideoHTML(html);
      });
    }

    setupLoom();
  }, []);

  return (
    <>
      <button id={BUTTON_ID}>Record</button>
      <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
    </>
  );
}