const multer = require("multer");

module.exports = multer({
    dest: "public/uploaded", 
    limits: {
        fileSize: 1000000 
    },
    fileFilter: (req, file, cb) => {

        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
      
      }
});
