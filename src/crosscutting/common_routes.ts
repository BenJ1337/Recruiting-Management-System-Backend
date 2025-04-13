import { Router } from 'express';

export abstract class CommonRoutesConfig {

    router: Router;
    path: string;

    constructor(path: string) {
        this.path = path;
        this.router = Router();
    }

    public abstract createRoutes(): Router

}