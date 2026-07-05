# API Reference

This reference documents the exported API of `@basementuniverse/camera-3d` as implemented in this repository.

## Types

```ts
type Camera3dMode = 'perspective' | 'orthographic';

type Camera3dOptions = {
  mode: Camera3dMode;
  up: vec3;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  positionEaseAmount?: number;
  targetEaseAmount?: number;
};
```

## Constructor

```ts
new Camera3d(
  position: vec3,
  target: vec3,
  options?: Partial<Camera3dOptions>
)
```

Default option values:

- `mode`: `"perspective"`
- `up`: `vec3(0, 1, 0)` (normalized internally)
- `fov`: `Math.PI / 2`
- `aspect`: `1`
- `near`: `0.1`
- `far`: `1000`
- `positionEaseAmount`: `0.1`
- `targetEaseAmount`: `0.1`

## Properties

Public mutable fields:

- `mode: Camera3dMode`
- `up: vec3`
- `fov: number`
- `aspect: number`
- `near: number`
- `far: number`

Position and target controls:

- `position: vec3` (get/set, eased target position)
- `positionImmediate: vec3` (set, snap without easing)
- `actualPosition: vec3` (get, interpolated current position)
- `target: vec3` (get/set, eased look-at target)
- `targetImmediate: vec3` (set, snap without easing)
- `actualTarget: vec3` (get, interpolated current target)

## Methods

### `update(): void`

Applies easing to both camera position and target.

### `getViewMatrix(): mat`

Returns a 4x4 view matrix derived from:

- Forward: normalized `(actualTarget - actualPosition)`
- Right: normalized `cross(forward, up)`
- Up: `cross(right, forward)`

Throws an error if internal matrix multiplication fails.

### `getPerspectiveProjectionMatrix(): mat`

Returns perspective projection matrix using `fov`, `aspect`, `near`, and `far`.

### `getOrthographicProjectionMatrix(): mat`

Returns orthographic projection matrix using `fov`, `aspect`, `near`, and `far`.

### `project(v: vec3, screenSize: vec2): vec2 | null`

Projects world-space point `v` into screen coordinates.

Returns `null` if matrix-vector transforms fail.

### `screenToWorld(screenPosition: vec2, screenSize: vec2, depth?: number): vec3 | null`

Converts screen coordinates to world coordinates at a specified depth.

- Uses `near` if `depth` is omitted.
- Returns `null` if required matrix inversions/transforms fail.

### `raycast(screenPosition: vec2, screenSize: vec2): { origin: vec3; direction: vec3 } | null`

Builds a ray through a screen position by unprojecting on near/far depths.

- `origin` is current `actualPosition`.
- `direction` is normalized `(farPlanePoint - nearPlanePoint)`.
- Returns `null` if unprojection fails.
