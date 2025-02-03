import multer from 'multer';

const storage=multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,`upload/`);
    },
    filename: (req,file,cd)=>{
        cd(null,`{file.originalname}`)
    }
});


const filefilter=(req,file,cd)=>{
    if(file.mimetype.startsWith('image/')){
        cd(null,true);
    }else{
        cd( new Error('Invaid file type,only image are allowed'),false);
    }
};
const upload = multer({storage,filefilter});
export default upload;
  
    