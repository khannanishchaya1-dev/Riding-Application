const multer = require("multer");

// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//   fileFilter,
// });


const storage= multer.diskStorage({
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"-"+file.originalname);
  },
})

const fileFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image/")){
    cb(null,true);
  }else{
    cb(new Error("Only image files are allowed"),false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

module.exports = upload;
