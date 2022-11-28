
export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
    
    if (!file) return callback(new Error("File is empty"), false)
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions =['jpg','jpg','gif','pdf']
    
    if (!validExtensions.includes(fileExtension)){        
        callback(null, false)
        return;
    }


    callback(null, true)

}