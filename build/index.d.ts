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
export declare class Camera3d {
    position: vec3;
    target: vec3;
    private static readonly DEFAULT_OPTIONS;
    mode: Camera3dMode;
    up: vec3;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    constructor(position: vec3, target: vec3, options?: Partial<Camera3dOptions>);
    getViewMatrix(): mat;
    getPerspectiveProjectionMatrix(): mat;
    getOrthographicProjectionMatrix(): mat;
    project(v: vec3, screen: vec2): vec2 | null;
}
