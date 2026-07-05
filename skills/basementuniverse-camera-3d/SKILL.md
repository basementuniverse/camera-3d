---
name: basementuniverse-camera-3d
description: >
  Use this skill when building or modifying 3D camera behavior with
  @basementuniverse/camera-3d, including projection, unprojection, raycasting,
  and eased camera motion in browser games.
---

# Basement Universe Camera 3D

Use this skill when working with `@basementuniverse/camera-3d`.

## When to use

- You need a camera abstraction for browser-based 3D gameplay or tools.
- You need to project world points into screen space.
- You need to unproject screen positions back into world coordinates.
- You need screen-space ray generation for picking or interaction.
- You want smooth eased camera movement and target tracking.

## When not to use

- You need frustum culling, post-processing, or a full scene graph/camera stack.
- You want engine-native cameras from frameworks like three.js or Babylon.js.
- You need physically-based camera models beyond this utility's API surface.

## Package basics

- Package: `@basementuniverse/camera-3d`
- Runtime dependency: `@basementuniverse/vec`
- Main export: default class `Camera3d`

## Quick start

```ts
import Camera3d from '@basementuniverse/camera-3d';

const camera = new Camera3d(
  { x: 0, y: 5, z: 10 },
  { x: 0, y: 0, z: 0 },
  {
    mode: 'perspective',
    aspect: width / height,
    near: 0.1,
    far: 1000,
  }
);

function update() {
  // Required for eased transitions.
  camera.update();
}
```

## Working rules for agents

- Keep `camera.aspect` synced to viewport size on resize.
- Call `camera.update()` once per frame if using eased movement/targeting.
- Use `positionImmediate` and `targetImmediate` for instant snapping.
- Handle nullable results from `project`, `screenToWorld`, and `raycast`.
- Use consistent `screenSize` values for all camera-space conversions.

## Common tasks

- Follow target smoothly:
  - Set `camera.target` every frame, call `camera.update()`.
- Teleport camera:
  - Set `camera.positionImmediate` and optionally `camera.targetImmediate`.
- Convert click to world:
  - Use `camera.screenToWorld(mouse, screenSize, depth)`.
- Build picking ray:
  - Use `camera.raycast(mouse, screenSize)` and test intersections.

## References

- Public API surface: [references/api.md](references/api.md)
- Usage patterns: [references/usage-patterns.md](references/usage-patterns.md)
- Behavioral notes and caveats: [references/behavior-notes.md](references/behavior-notes.md)
