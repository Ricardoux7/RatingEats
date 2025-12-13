const verifyResults = (req, res, next) => {
  const results = res.locals.results;
  if(!Array.isArray(results) || results.length === 0) {
    return res.status(404).json({ message: "No matching restaurants found." });
  }
  next();
}

export { verifyResults };