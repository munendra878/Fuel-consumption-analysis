const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      // 1. Get token from Authorization header
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ msg: "No token provided" });

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach user info to request

      // 3. Check roles if specified
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ msg: "Access denied" });

      // 4. All good, proceed
      next();
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};
