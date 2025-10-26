export async function handleUploadError(err, req, res, next) {
  if (err) {
    console.log(err);
    
    if (err.message === 'Only JPEG, PNG, and GIF files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only JPEG, PNG, and GIF files are allowed',
      });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size cannot exceed 5MB',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }

  next();
}
