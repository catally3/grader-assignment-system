exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // Simply return file info for now.
  res.status(200).json({
    message: 'File uploaded successfully.',
    file: req.file
  });
};
