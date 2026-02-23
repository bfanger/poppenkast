import { useEffect, useState } from "react";
import theatreJpg from "./theatre.jpg?url";
import getWebcam, { webcamPermission } from "../services/webcam";
type Props = {
  preload: () => Promise<unknown>;
  onStart: () => void;
};
export default function LandingPage({ preload, onStart }: Props) {
  const [status, setStatus] = useState<
    "detect" | "prompt" | "denied" | "loading" | "error"
  >("detect");

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
      await preload();
      onStart();
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
          <p className="animate-pulse">Bezig met laden...</p>
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
