const multer = require('multer');  // Import multer

const path = require('path');  // Import path module
const storage = multer.diskStorage({  // Set disk storage
    destination:(req,file,cb)=>{  // Set destination folder
        cb(null,'upload/')  // Files stored in 'upload/' folder
    },
    filename:(req,file,cb)=>{  // Set filename format
        cb(null,Date.now() + path.extname(file.originalname) )  // Add timestamp and extension
    }
})
const upload = multer({storage});  // Configure multer with storage settings
module.exports = upload;  // Export upload configuration
