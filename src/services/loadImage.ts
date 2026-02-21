export default function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onabort = () => reject(new Error("Aborted"));
    img.onerror = () => reject(new Error("Failed"));
    img.src = src;
  });
}
