const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join(' ');
    return res.status(400).json({ message: messages });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({ message: `The ${field} "${value}" is already in use.` });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
};

export default errorHandler;