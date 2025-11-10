
import multer from 'multer';
import { Request } from 'express';
import path from "path"
const storage = multer.diskStorage( {
    destination: ( req: Request, file: Express.Multer.File, cb: ( error: Error | null, destination: string ) => void ) => {
        cb( null, 'uploads/' );
    },
    filename: ( req: Request, file: Express.Multer.File, cb: ( error: Error | null, filename: string ) => void ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round( Math.random() * 1E9 )
        const fileName = file.fieldname + '-' + uniqueSuffix +path.extname(file.originalname) 
        console.log("IM HERE IN MULTER", fileName)
        cb( null, fileName )
    },
} );

const fileFilter = ( req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if ( file.mimetype === 'image/gif' || file.mimetype === 'image/png' ) {
        cb( null, true );
    } else {
        cb( new Error( 'Invalid file type' ) );
    }
};

export const upload = multer( {
    storage: storage,
    fileFilter: fileFilter
} );

