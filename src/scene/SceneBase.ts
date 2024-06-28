export abstract class SceneBase {
    constructor() {}

    abstract initialize(): void;
    abstract update(): void;
    abstract _onParamsChanged(params: any): void;

}
