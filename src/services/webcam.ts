export const cameraWidth = 640;
export const cameraHeight = 480;
export default async function getWebcam() {
  if (getWebcam.video) {
    return getWebcam.video;
  }
  const video = document.createElement("video");
  const media = await navigator.mediaDevices.getUserMedia({
    video: { width: cameraWidth, height: cameraHeight },
  });
  video.srcObject = media;
  await video.play();
  getWebcam.video = video;
  return video;
}
getWebcam.video = undefined as HTMLVideoElement | undefined;
