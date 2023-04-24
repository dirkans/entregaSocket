import multer from 'multer';
import * as url from 'url';


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{ cb(null, __dirname + '/public/img')},
    filename: (req,file,cb)=>{cb(null,file.originalname)}
})

export default multer;
export { __filename, __dirname };
