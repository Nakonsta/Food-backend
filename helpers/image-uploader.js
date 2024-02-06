const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported files'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter,
});

module.exports = {
  upload,
};
