import { mat, vec2, vec3 } from '@basementuniverse/vec';

export type Camera3dMode = 'perspective' | 'orthographic';

export type Camera3dOptions = {
  mode: Camera3dMode;
  up: vec3;
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

export class Camera3d {
  private static readonly DEFAULT_OPTIONS: Camera3dOptions = {
    mode: 'perspective',
    up: vec3(0, 1, 0),
    fov: Math.PI / 4,
    aspect: 1,
    near: 0.1,
    far: 1000,
  };

  public mode: Camera3dMode;
  public up: vec3;
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;

  constructor(
    public position: vec3,
    public target: vec3,
    options: Partial<Camera3dOptions> = {}
  ) {
    const actualOptions = Object.assign({}, Camera3d.DEFAULT_OPTIONS, options);
    this.mode = actualOptions.mode;
    this.up = vec3.nor(actualOptions.up);
    this.fov = actualOptions.fov;
    this.aspect = actualOptions.aspect;
    this.near = actualOptions.near;
    this.far = actualOptions.far;
  }

  public getViewMatrix(): mat {
    const forward = vec3.nor(vec3.sub(this.target, this.position));
    const right = vec3.nor(vec3.cross(this.up, forward));
    const up = vec3.nor(vec3.cross(right, forward));

    const rotation = mat(4, 4, [
      right.x, right.y, right.z, 0,
      up.x, up.y, up.z, 0,
      forward.x, forward.y, forward.z, 0,
      0, 0, 0, 1,
    ]);
    const translation = mat(4, 4, [
      1, 0, 0, -this.position.x,
      0, 1, 0, -this.position.y,
      0, 0, 1, -this.position.z,
      0, 0, 0, 1,
    ]);

    const viewMatrix = mat.mul(rotation, translation);
    if (!viewMatrix) {
      throw new Error('Failed to create view matrix');
    }

    return viewMatrix;
  }

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

  public project(v: vec3, screen: vec2): vec2 | null {
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
      (ndc.x * 0.5 + 0.5) * screen.x,
      (1 - (ndc.y * 0.5 + 0.5)) * screen.y
    );
  }
}
