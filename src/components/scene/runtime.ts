import { createSceneState, type SceneState } from "./sceneConfig";

/**
 * Frame-level shared state. `target` is recomputed from the scroll store each
 * frame; `current` is damped toward it and is what every scene object reads.
 */
export const runtime = {
  target: createSceneState(),
  current: createSceneState(),
  coord: 0,
  velocity: 0,
  time: 0,
};

export type { SceneState };
