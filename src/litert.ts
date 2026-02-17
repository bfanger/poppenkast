import { loadLiteRt, loadAndCompile, Tensor } from "@litertjs/core";

await loadLiteRt("/litert_wasm/");
const model = await loadAndCompile("/model.tflite", { accelerator: "wasm" });
const gpu = false;
const inputTypedArray = new Float32Array(1 * 3 * 224 * 224);
const inputTensor = new Tensor(inputTypedArray, [1, 224, 224, 3]);

let output: Tensor;
if (gpu) {
  const gpuTensor = await inputTensor.moveTo("webgpu");
  const results = await model.run(gpuTensor);
  const result = await results[0].moveTo("wasm");
  await gpuTensor.delete();
  output = result;
} else {
  const results = await model.run(inputTensor);
  console.log(results[0].toTypedArray());
  output = results[0];
}

inputTensor.delete();
output.delete();
