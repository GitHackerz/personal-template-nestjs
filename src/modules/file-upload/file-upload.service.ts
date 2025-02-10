import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
// const ALLOWED_MIME_TYPES = [
//     'image/jpeg',
//     'image/png',
//     'image/gif',
//     'image/jpg'
// ];

@Injectable()
export class FileUploadService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        this.ensureUploadDir();
    }

    private ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async handleFileUpload(file: Express.Multer.File) {
        console.log(file);

        if (!file) {
            throw new BadRequestException('no file uploaded');
        }

        // if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        //   throw new BadRequestException('invalid file type');
        // }

        if (file.size > MAX_SIZE) {
            throw new BadRequestException('file is too large!');
        }

        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, uniqueFilename);

        // Write file to disk
        fs.writeFileSync(filePath, file.buffer);

        // Return the URL path that can be used to access the file
        return {
            filePath: `/uploads/${uniqueFilename}`,
            filename: uniqueFilename
        };
    }
}
