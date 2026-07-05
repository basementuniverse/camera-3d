# Behavioral Notes

## Easing model

`update()` applies exponential smoothing for position and target.

- Lower ease values produce slower, smoother motion.
- Higher ease values produce faster response.
- If `update()` is not called each frame, eased values will not progress.

## Mode-dependent behavior

- `mode = 'perspective'` uses perspective projection math with `fov` and `aspect`.
- `mode = 'orthographic'` uses orthographic matrix construction based on `fov`, `aspect`, `near`, `far`.

## Coordinate conversion details

- `project()` returns screen-space with inverted Y for top-left screen origin.
- `screenToWorld()` defaults `depth` to `near` when omitted.
- `raycast()` computes direction from near-plane and far-plane unprojections.

## Nullability and error handling

- `project`, `screenToWorld`, and `raycast` may return `null`; always branch defensively.
- `getViewMatrix()` can throw if internal matrix multiplication fails.

## Practical caveats for agents

- Mutating `up` to a non-normalized vector is possible; set to normalized values if changed.
- Keep `near` positive and `far > near` to avoid unstable projection matrices.
- Use the same viewport dimensions for all conversions in a frame to avoid mismatch.
- Call `camera.update()` before sampling `actualPosition`/`actualTarget` if easing is active.
