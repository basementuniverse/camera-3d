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
    private static readonly DEFAULT_OPTIONS;
    mode: Camera3dMode;
    up: vec3;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    private _actualPosition;
    private _targetPosition;
    private _actualTarget;
    private _targetTarget;
    private positionEaseAmount;
    private targetEaseAmount;
    constructor(position: vec3, target: vec3, options?: Partial<Camera3dOptions>);
    get position(): vec3;
    set position(value: vec3);
    set positionImmediate(value: vec3);
    get actualPosition(): vec3;
    get target(): vec3;
    set target(value: vec3);
    set targetImmediate(value: vec3);
    get actualTarget(): vec3;
    /**
     * Update the camera
     */
    update(): void;
    getViewMatrix(): mat;
    getPerspectiveProjectionMatrix(): mat;
    getOrthographicProjectionMatrix(): mat;
    project(v: vec3, screen: vec2): vec2 | null;
}
