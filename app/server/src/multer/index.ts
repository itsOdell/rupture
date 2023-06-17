import multer from "multer";
import { resolve } from "path";
import { ASSETS_DIR } from "@rupture/constants";
import type { Request } from "express";
import type { MulterFile, MulterDestinationCb, MulterFilenameCb } from "@rupture/types/src/multer";

const storage = multer.diskStorage({
    destination: function (req: Request, file: MulterFile, cb: MulterDestinationCb) {
        cb(null, resolve(ASSETS_DIR));
    },
    filename: function (req: Request, file: MulterFile, cb: MulterFilenameCb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;
