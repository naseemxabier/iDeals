const multer = require("multer");

module.exports = multer({
    dest: "public/uploaded", //respecto la raíz del proyecto
    limits: {
        fileSize: 1000000 //Bytes
    },
    fileFilter: (req, file, cb) => {

        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }

        // To reject this file pass `false`, like so:
        // cb(null, false)
      
        // To accept the file pass `true`, like so:
        // cb(null, true)
      
        // You can always pass an error if something goes wrong:
        // cb(new Error('I don\'t have a clue!'))
      
      }
});
