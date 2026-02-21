import { getProject } from "@theatre/core";

if (import.meta.env.DEV) {
  await import("./studio");
}

export const project = getProject("Poppenkast"); //, { state }
export const sceneSheet = project.sheet("Scene");
export const puppetSheet = project.sheet("Puppet");
