import { Router } from 'express';

export abstract class CommonRoutesBuilder {
    protected readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    public abstract build(): Router
}