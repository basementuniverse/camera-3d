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
    /**
     * Get the view matrix for the camera
     *
     * The view matrix transforms world coordinates into camera coordinates
     */
    getViewMatrix(): mat;
    /**
     * Get a perspective projection matrix for the camera
     */
    getPerspectiveProjectionMatrix(): mat;
    /**
     * Get an orthographic projection matrix for the camera
     */
    getOrthographicProjectionMatrix(): mat;
    /**
     * Project a 3D point into 2D screen coordinates
     * @param v The 3D point to project
     * @param screenSize The size of the screen in pixels
     * @returns The projected 2D coordinates, or null if projection fails
     */
    project(v: vec3, screenSize: vec2): vec2 | null;
    /**
     * Convert a screen position to a world position
     * @param screenPosition The 2D screen coordinates to convert
     * @param screenSize The size of the screen in pixels
     * @param depth The depth (distance from the camera) to use for conversion
     * @returns The corresponding 3D world coordinates, or null if conversion fails
     */
    screenToWorld(screenPosition: vec2, screenSize: vec2, depth?: number): vec3 | null;
    /**
     * Cast a ray from the camera through a screen position
     * @param screenPosition The 2D screen coordinates to cast the ray from
     * @param screenSize The size of the screen in pixels
     * @returns A ray with origin and direction, or null if raycasting fails
     */
    raycast(screenPosition: vec2, screenSize: vec2): {
        origin: vec3;
        direction: vec3;
    } | null;
}
