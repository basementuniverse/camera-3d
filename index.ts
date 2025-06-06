import { mat, vec2, vec3 } from '@basementuniverse/vec';

export type Camera3dMode = 'perspective' | 'orthographic';

export type Camera3dOptions = {
  mode: Camera3dMode;
  up: vec3;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  positionEaseAmount?: number;
  targetEaseAmount?: number;
};

export default class Camera3d {
  private static readonly DEFAULT_OPTIONS: Camera3dOptions = {
    mode: 'perspective',
    up: vec3(0, 1, 0),
    fov: Math.PI / 2,
    aspect: 1,
    near: 0.1,
    far: 1000,
    positionEaseAmount: 0.1,
    targetEaseAmount: 0.1,
  };

  public mode: Camera3dMode;
  public up: vec3;
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;

  private _actualPosition: vec3;
  private _targetPosition: vec3;

  private _actualTarget: vec3;
  private _targetTarget: vec3;

  private positionEaseAmount: number;
  private targetEaseAmount: number;

  constructor(
    position: vec3,
    target: vec3,
    options: Partial<Camera3dOptions> = {}
  ) {
    const actualOptions = Object.assign({}, Camera3d.DEFAULT_OPTIONS, options);
    this.mode = actualOptions.mode;
    this.up = vec3.nor(actualOptions.up);
    this.fov = actualOptions.fov;
    this.aspect = actualOptions.aspect;
    this.near = actualOptions.near;
    this.far = actualOptions.far;
    this.positionEaseAmount = actualOptions.positionEaseAmount!;
    this.targetEaseAmount = actualOptions.targetEaseAmount!;

    this._actualPosition = position;
    this._targetPosition = position;
    this._actualTarget = target;
    this._targetTarget = target;
  }

  public get position(): vec3 {
    return this._targetPosition;
  }

  public set position(value: vec3) {
    this._targetPosition = value;
  }

  public set positionImmediate(value: vec3) {
    this._actualPosition = value;
    this._targetPosition = value;
  }

  public get actualPosition(): vec3 {
    return this._actualPosition;
  }

  public get target(): vec3 {
    return this._targetTarget;
  }

  public set target(value: vec3) {
    this._targetTarget = value;
  }

  public set targetImmediate(value: vec3) {
    this._actualTarget = value;
    this._targetTarget = value;
  }

  public get actualTarget(): vec3 {
    return this._actualTarget;
  }

  /**
   * Update the camera
   */
  public update() {
    this._actualPosition = vec3.add(
      this._targetPosition,
      vec3.mul(
        vec3.sub(this._actualPosition, this._targetPosition),
        this.positionEaseAmount
      )
    );
    this._actualTarget = vec3.add(
      this._targetTarget,
      vec3.mul(
        vec3.sub(this._actualTarget, this._targetTarget),
        this.targetEaseAmount
      )
    );
  }

  /**
   * Get the view matrix for the camera
   *
   * The view matrix transforms world coordinates into camera coordinates
   */
  public getViewMatrix(): mat {
    const forward = vec3.nor(
      vec3.sub(this._actualTarget, this._actualPosition)
    );
    const right = vec3.nor(vec3.cross(forward, this.up));
    const up = vec3.cross(right, forward);

    const rotation = mat(4, 4, [
      right.x, right.y, right.z, 0,
      up.x, up.y, up.z, 0,
      -forward.x, -forward.y, -forward.z, 0,
      0, 0, 0, 1,
    ]);
    const translation = mat(4, 4, [
      1, 0, 0, -this._actualPosition.x,
      0, 1, 0, -this._actualPosition.y,
      0, 0, 1, -this._actualPosition.z,
      0, 0, 0, 1,
    ]);

    const viewMatrix = mat.mul(rotation, translation);
    if (!viewMatrix) {
      throw new Error('Failed to create view matrix');
    }

    return viewMatrix;
  }

  /**
   * Get a perspective projection matrix for the camera
   */
  public getPerspectiveProjectionMatrix(): mat {
    const f = 1.0 / Math.tan(this.fov / 2);
    const nf = 1 / (this.near - this.far);

    return mat(4, 4, [
      f / this.aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (this.far + this.near) * nf, -1,
      0, 0, 2 * this.far * this.near * nf, 0,
    ]);
  }

  /**
   * Get an orthographic projection matrix for the camera
   */
  public getOrthographicProjectionMatrix(): mat {
    const l = -this.aspect * this.fov;
    const r = this.aspect * this.fov;
    const b = -this.aspect * this.fov;
    const t = this.aspect * this.fov;
    const n = this.near;
    const f = this.far;

    return mat(4, 4, [
      2 / (r - l), 0, 0, -(r + l) / (r - l),
      0, 2 / (t - b), 0, -(t + b) / (t - b),
      0, 0, -2 / (f - n), -(f + n) / (f - n),
      0, 0, 0, 1,
    ]);
  }

  /**
   * Project a 3D point into 2D screen coordinates
   * @param v The 3D point to project
   * @param screenSize The size of the screen in pixels
   * @returns The projected 2D coordinates, or null if projection fails
   */
  public project(v: vec3, screenSize: vec2): vec2 | null {
    const viewMatrix = this.getViewMatrix();
    let projectionMatrix: mat;
    switch (this.mode) {
      case 'perspective':
        projectionMatrix = this.getPerspectiveProjectionMatrix();
        break;
      case 'orthographic':
        projectionMatrix = this.getOrthographicProjectionMatrix();
        break;
    }

    // Transform the 3D point into view space
    const viewPos = mat.mulv(viewMatrix, [...vec3.components(v), 1]);
    if (!viewPos) {
      return null;
    }
    viewPos[3] = 1; // Homogeneous coordinates

    // Transform the point from view space to clip space
    const clipPos = mat.mulv(projectionMatrix, viewPos);
    if (clipPos === false) {
      return null;
    }
    const clipPosVec = vec3.fromComponents(clipPos);

    // Perform perspective division to get normalized device coordinates (NDC)
    const ndc: vec2 = vec2(
      clipPosVec.x / clipPosVec.z,
      clipPosVec.y / clipPosVec.z
    );

    return vec2(
      (ndc.x * 0.5 + 0.5) * screenSize.x,
      (1 - (ndc.y * 0.5 + 0.5)) * screenSize.y
    );
  }

  /**
   * Convert a screen position to a world position
   * @param screenPosition The 2D screen coordinates to convert
   * @param screenSize The size of the screen in pixels
   * @param depth The depth (distance from the camera) to use for conversion
   * @returns The corresponding 3D world coordinates, or null if conversion fails
   */
  public screenToWorld(
    screenPosition: vec2,
    screenSize: vec2,
    depth?: number
  ): vec3 | null {
    // If depth is not provided, use the near plane
    if (depth === undefined) {
      depth = this.near;
    }

    // Convert screen position to normalized device coordinates (NDC)
    const ndc = vec2(
      1 - (screenPosition.x / screenSize.x) * 2,
      1 - (screenPosition.y / screenSize.y) * 2
    );

    // Transform NDC from view space to clip space
    const viewMatrix = this.getViewMatrix();
    let projectionMatrix: mat;
    switch (this.mode) {
      case 'perspective':
        projectionMatrix = this.getPerspectiveProjectionMatrix();
        break;
      case 'orthographic':
        projectionMatrix = this.getOrthographicProjectionMatrix();
        break;
    }
    const invProjectionMatrix = mat.inv(projectionMatrix);
    if (!invProjectionMatrix) {
      return null;
    }
    const invViewMatrix = mat.inv(viewMatrix);
    if (!invViewMatrix) {
      return null;
    }
    let clipPos: vec3 = vec3();
    switch (this.mode) {
      case 'perspective':
        // For perspective projection, we need to calculate the clip space
        // position and scale by tan(fov/2) to account for the field of view
        const tanHalfFov = Math.tan(this.fov / 2);
        clipPos = vec3(
          ndc.x * depth * tanHalfFov * this.aspect,
          ndc.y * depth * tanHalfFov,
          depth
        );
        break;
      case 'orthographic':
        // For orthographic projection, we can directly use the depth value
        clipPos = vec3(
          ndc.x * (this.far - this.near) / 2,
          ndc.y * (this.far - this.near) / 2,
          (this.far + this.near) / 2 + depth
        );
        break;
    }

    // Transform clip space coordinates to world space
    const worldPos = mat.mulv(invViewMatrix, [...vec3.components(clipPos), 1]);
    if (!worldPos) {
      return null;
    }

    return vec3(
      worldPos[0] / worldPos[3],
      worldPos[1] / worldPos[3],
      worldPos[2] / worldPos[3]
    );
  }

  /**
   * Cast a ray from the camera through a screen position
   * @param screenPosition The 2D screen coordinates to cast the ray from
   * @param screenSize The size of the screen in pixels
   * @returns A ray with origin and direction, or null if raycasting fails
   */
  public raycast(
    screenPosition: vec2,
    screenSize: vec2
  ): { origin: vec3; direction: vec3 } | null {
    const nearPlanePoint = this.screenToWorld(
      screenPosition,
      screenSize,
      this.near
    );
    const farPlanePoint = this.screenToWorld(
      screenPosition,
      screenSize,
      this.far
    );
    if (!nearPlanePoint || !farPlanePoint) {
      return null;
    }

    const direction = vec3.nor(
      vec3.sub(farPlanePoint, nearPlanePoint)
    );
    return {
      origin: this._actualPosition,
      direction: direction,
    };
  }
}
