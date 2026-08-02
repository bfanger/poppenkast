/**
 * Loads a URL and reports progress, on completion resolves into an in-memory blob URL.
 */
export default function loadWithProgress(
  url: string,
  updateFn: (factor: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        updateFn(e.loaded / e.total);
      }
    };
    xhr.onload = () => {
      updateFn(1);
      resolve(URL.createObjectURL(xhr.response as Blob));
    };
    xhr.onerror = () => reject(new Error("Failed to load"));
    xhr.send();
  });
}
