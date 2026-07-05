# Usage Patterns

## Create and update camera

```ts
import Camera3d from '@basementuniverse/camera-3d';

const camera = new Camera3d(
  { x: 0, y: 10, z: 10 },
  { x: 0, y: 0, z: 0 },
  {
    mode: 'perspective',
    aspect: width / height,
    near: 0.1,
    far: 1000,
    positionEaseAmount: 0.1,
    targetEaseAmount: 0.1,
  }
);

function frame() {
  camera.update();
}
```

## Smooth follow vs instant snap

Smooth movement:

```ts
camera.position = desiredPosition;
camera.target = desiredTarget;
camera.update();
```

Immediate movement:

```ts
camera.positionImmediate = desiredPosition;
camera.targetImmediate = desiredTarget;
```

## Projection and matrices

Project world to screen:

```ts
const p = camera.project(worldPoint, { x: width, y: height });
if (!p) return;
```

Get matrices for custom rendering pipelines:

```ts
const view = camera.getViewMatrix();
const projection = camera.mode === 'perspective'
  ? camera.getPerspectiveProjectionMatrix()
  : camera.getOrthographicProjectionMatrix();
```

## Screen to world and raycasting

Unproject screen point at a chosen depth:

```ts
const world = camera.screenToWorld(
  { x: mouseX, y: mouseY },
  { x: width, y: height },
  10
);
if (!world) return;
```

Build picking ray:

```ts
const ray = camera.raycast(
  { x: mouseX, y: mouseY },
  { x: width, y: height }
);
if (!ray) return;

const { origin, direction } = ray;
```

## Resize handling

Always keep aspect ratio current:

```ts
function onResize(width: number, height: number) {
  camera.aspect = width / height;
}
```
