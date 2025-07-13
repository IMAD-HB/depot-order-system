const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur s'est produite." });
};

export default errorHandler;
