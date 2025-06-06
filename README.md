# Game Component: Camera 3d

A camera component for use in 3d browser games.

## Installation

```bash
npm install @basementuniverse/camera-3d
```

## How to use

Create a camera:

```ts
import Camera3d from '@basementuniverse/camera-3d';

const camera = new Camera3d(
  // Initial position
  { x: 0, y: 0, z: 0 },

  // Initial target position
  { x: 0, y: 0, z: 0 },

  // Options (all optional)
  {
    mode: 'perspective', // 'perspective' or 'orthographic'
    up: { x: 0, y: 1, z: 0 }, // Up vector
    fov: Math.PI / 4, // Field of view (radians)
    aspect: 1, // Aspect ratio
    near: 0.1, // Near clipping plane
    far: 1000, // Far clipping plane
  }
);
```

Now we can start projecting 3D points into 2D screen space:

```ts
const projectedPoint = camera.project(
  { x: 1, y: 1, z: 1 }, // Point in 3D space
  { x: window.innerWidth, y: window.innerHeight } // Screen size
);
```

We can also get the view matrix and perspective or orthographic projection matrix:

```ts
const viewMatrix = camera.getViewMatrix();
const perspectiveProjectionMatrix = camera.getPerspectiveProjectionMatrix();
const orthographicProjectionMatrix = camera.getOrthographicProjectionMatrix();
```

The camera uses `mat`, `vec2` and `vec3` types from `@basementuniverse/vec`.

## Easing

For easing to work correctly, we need to update the camera every frame:

```ts
class Game {
  // ...

  update() {
    // Update the camera to apply easing
    camera.update();
  }

  // ...
}
```

Move the camera by setting `camera.position`.

Get the camera's current "real" position (after easing) by reading `camera.actualPosition`.

Snap the camera to a new position (without easing) by setting `camera.positionImmediate`.

Set the camera's target position by setting `camera.target`.

Get the camera's current "real" target position (after easing) by reading `camera.actualTarget`.

Snap the camera's target position (without easing) by setting `camera.targetImmediate`.

## Screen to world and raycasting

To convert a screen position to a world position, we can use the `screenToWorld` method:

```ts
const worldPosition = camera.screenToWorld(
  { x: screenX, y: screenY }, // Screen position
  { x: window.innerWidth, y: window.innerHeight }, // Screen size
  depth // Depth in world space (measured in world units)
);
```

We can also calculate a ray from the camera through a screen position:

```ts
const ray = camera.raycast(
  { x: screenX, y: screenY }, // Screen position
  { x: window.innerWidth, y: window.innerHeight } // Screen size
);
```
