// src/media/media.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

const ALLOWED_MIMETYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
];

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 Go
  },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Type de fichier non autorisé : ${file.mimetype}`), false);
    }
  },
};