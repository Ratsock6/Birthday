export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => void;
};
