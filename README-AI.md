# Camera3d API Reference

3D camera component for browser games with perspective/orthographic projection, easing, projection/unprojection, and raycasting.

## Types

```typescript
type Camera3dMode = 'perspective' | 'orthographic';

type Camera3dOptions = {
  mode: Camera3dMode;
  up: vec3;                    // Up vector, default: (0, 1, 0)
  fov: number;                 // Field of view in radians, default: π/2
  aspect: number;              // Aspect ratio, default: 1
  near: number;                // Near clipping plane, default: 0.1
  far: number;                 // Far clipping plane, default: 1000
  positionEaseAmount?: number; // Position easing factor [0-1], default: 0.1
  targetEaseAmount?: number;   // Target easing factor [0-1], default: 0.1
};
```

Dependencies: `vec2`, `vec3`, `mat` from `@basementuniverse/vec`

## Constructor

```typescript
new Camera3d(position: vec3, target: vec3, options?: Partial<Camera3dOptions>)
```

## Properties

### Read/Write
- `mode: Camera3dMode` - Projection mode
- `up: vec3` - Up vector (normalized)
- `fov: number` - Field of view (radians)
- `aspect: number` - Aspect ratio
- `near: number` - Near clipping plane
- `far: number` - Far clipping plane

### Position/Target (with easing)
- `position: vec3` (get/set) - Target position (eased over time)
- `positionImmediate: vec3` (set only) - Snap to position immediately (no easing)
- `actualPosition: vec3` (get only) - Current interpolated position
- `target: vec3` (get/set) - Target look-at point (eased over time)
- `targetImmediate: vec3` (set only) - Snap to target immediately (no easing)
- `actualTarget: vec3` (get only) - Current interpolated look-at point

## Methods

### `update(): void`
Update camera easing. Call every frame for smooth position/target transitions.

### `getViewMatrix(): mat`
Returns 4x4 view matrix transforming world coordinates to camera coordinates.

### `getPerspectiveProjectionMatrix(): mat`
Returns 4x4 perspective projection matrix.

### `getOrthographicProjectionMatrix(): mat`
Returns 4x4 orthographic projection matrix.

### `project(v: vec3, screenSize: vec2): vec2 | null`
Projects 3D world point to 2D screen coordinates.
- `v` - 3D world position
- `screenSize` - Screen dimensions in pixels
- Returns: 2D screen coordinates or null on failure

### `screenToWorld(screenPosition: vec2, screenSize: vec2, depth?: number): vec3 | null`
Converts 2D screen position to 3D world position at specified depth.
- `screenPosition` - 2D screen coordinates
- `screenSize` - Screen dimensions in pixels
- `depth` - World space depth (distance from camera), defaults to `near` plane
- Returns: 3D world position or null on failure

### `raycast(screenPosition: vec2, screenSize: vec2): { origin: vec3; direction: vec3 } | null`
Casts ray from camera through screen position.
- `screenPosition` - 2D screen coordinates
- `screenSize` - Screen dimensions in pixels
- Returns: Ray with `origin` (camera position) and normalized `direction` vector, or null on failure

## Usage Pattern

```typescript
// Create camera
const camera = new Camera3d(
  { x: 0, y: 5, z: 10 },
  { x: 0, y: 0, z: 0 },
  { mode: 'perspective', aspect: width / height }
);

// Update loop
camera.update(); // Apply easing

// Move camera (eased)
camera.position = { x: 10, y: 5, z: 10 };

// Snap camera (instant)
camera.positionImmediate = { x: 10, y: 5, z: 10 };

// Project 3D to 2D
const screen2d = camera.project(
  { x: 1, y: 1, z: 1 },
  { x: window.innerWidth, y: window.innerHeight }
);

// Unproject 2D to 3D
const world3d = camera.screenToWorld(
  { x: mouseX, y: mouseY },
  { x: window.innerWidth, y: window.innerHeight },
  10 // depth
);

// Raycast from screen
const ray = camera.raycast(
  { x: mouseX, y: mouseY },
  { x: window.innerWidth, y: window.innerHeight }
);
// ray.origin is camera position
// ray.direction is normalized direction vector

// Get matrices for WebGL
const viewMatrix = camera.getViewMatrix();
const projMatrix = camera.getPerspectiveProjectionMatrix();
```

## Notes

- Easing: Lower values (closer to 0) = slower/smoother, higher values (closer to 1) = faster/more responsive
- Both modes (perspective/orthographic) use `fov` parameter differently in projection calculations
- All methods use `actualPosition` and `actualTarget` (interpolated values) for transformations
- NDC coordinates: x,y ∈ [-1,1], screen coordinates: y-axis inverted (0 at top)
- Perspective division applied in `project()` method
- `screenToWorld()` in perspective mode accounts for FOV via `tan(fov/2)` scaling
