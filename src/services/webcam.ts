import.meta.hot;

export default async function getWebcam() {
  if (getWebcam.video) {
    return getWebcam.video;
  }
  const video = document.createElement("video");
  const media = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });
  video.srcObject = media;
  await video.play();
  getWebcam.video = video;
  return video;
}
getWebcam.video = undefined as HTMLVideoElement | undefined;
