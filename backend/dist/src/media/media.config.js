"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const ALLOWED_MIMETYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
];
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (_req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname);
            cb(null, `${(0, uuid_1.v4)()}${ext}`);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException(`Type de fichier non autorisé : ${file.mimetype}`), false);
        }
    },
};
//# sourceMappingURL=media.config.js.map