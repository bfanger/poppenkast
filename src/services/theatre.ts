import { getProject } from "@theatre/core";

if (import.meta.env.DEV) {
  await import("./studio");
}

export const project = getProject("Poppenkast", {
  state: {
    sheetsById: {},
    definitionVersion: "0.4.0",
    revisionHistory: ["v-Iojt1YgWX1PYwS"],
  },
});
export const sceneSheet = project.sheet("Scene");
export const puppetSheet = project.sheet("Puppet");
