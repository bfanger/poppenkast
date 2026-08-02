import { useEffect, useState } from "react";
import theatreJpg from "./theatre.jpg?url";
import getWebcam, { webcamPermission } from "../services/webcam";
import Progress from "./Progress";
import ernieGlb from "./Ernie.glb?url";
import bertGlb from "./Bert.glb?url";
import loadWithProgress from "../services/loadWithProgress";

export type PuppetUrls = {
  left: string;
  right: string;
};
type Props = {
  preload: () => Promise<unknown>;
  onStart: (urls: PuppetUrls) => void;
};
export default function LandingPage({ preload, onStart }: Props) {
  const [status, setStatus] = useState<
    "detect" | "prompt" | "denied" | "loading" | "error"
  >("detect");
  const [progress, setProgress] = useState(0);

  const [start] = useState(() => async () => {
    try {
      setStatus("detect");
      await getWebcam();
    } catch (err) {
      console.warn(err);
      setStatus("denied");
      return;
    }
    try {
      setStatus("loading");
      const shared: Record<string, number> = {};
      function updateProgress(key: string, percentage: number) {
        shared[key] = percentage;
        let value = 0;
        for (const section of Object.values(shared)) {
          value += section;
        }
        setProgress(value);
      }
      const urls = { left: bertGlb, right: ernieGlb };

      updateProgress("base", 5);
      await Promise.all([
        preload().then(() => updateProgress("code", 35)),
        loadWithProgress(ernieGlb, (f) => updateProgress("ernie", f * 35)).then(
          (url) => (urls.right = url),
        ),
        loadWithProgress(bertGlb, (f) => updateProgress("bert", f * 25)).then(
          (url) => (urls.left = url),
        ),
      ]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onStart(urls);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  });

  useEffect(() => {
    void webcamPermission()
      .then((permission) => {
        if (permission === "prompt") {
          setStatus("prompt");
        } else if (permission === "denied") {
          setStatus("denied");
        } else if (permission === "granted") {
          void start();
        } else {
          console.warn(`Unexpected permission`);
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [start]);

  return (
    <>
      <div
        className="flow-root aspect-4/3 bg-cover bg-center bg-no-repeat text-center"
        style={{ backgroundImage: `url(${theatreJpg})` }}
      >
        <h1 className="mt-8 mb-4 px-[17%] text-3xl font-medium md:mt-24">
          Welkom bij de digitale Poppenkast
        </h1>
        <p className="mb-8 px-[17%]">
          Een AI Webcam experiment door{" "}
          <a className="underline" href="https://bfanger.nl/" target="_blank">
            Bob&nbsp;Fanger
          </a>
          <br />
          Beweeg je handen voor de camera om de poppen te besturen.
        </p>

        {(status === "denied" || status === "error") && (
          <section className="inline-block border-3 border-red-700 bg-red-900 p-3 font-bold text-white">
            {status === "denied"
              ? "Geen toegang tot webcam"
              : "Oeps, er is een fout opgetreden"}
          </section>
        )}
        {status === "loading" && (
          <div className="mx-auto w-100 max-w-9/10">
            <Progress value={progress} />
          </div>
        )}
        {status === "detect" && (
          <p className="animate-pulse">Webcam detecteren...</p>
        )}
        {status === "prompt" && (
          <button
            className="cursor-pointer rounded-full bg-red-700 px-6 py-2 font-semibold hover:bg-red-600"
            onClick={() => void start()}
          >
            Start de voorstelling
          </button>
        )}
      </div>
      <p className="absolute bottom-0 left-0 mb-8 w-full px-[17%] text-center text-xs text-gray-200">
        De webcam wordt niet verstuurd of opgeslagen, deze wordt alleen binnen
        de browser gebruikt voor het bepalen van de houding van de handen.
      </p>
    </>
  );
}
