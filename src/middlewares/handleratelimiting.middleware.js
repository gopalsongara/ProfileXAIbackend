const userCooldowns = new Map();

const interviewCooldown = (req, res, next) => {
  const userId = req.user.id;

  const lastRequest = userCooldowns.get(userId);

  if (lastRequest) {
    const elapsedTime = Date.now() - lastRequest;
    const cooldownTime = 3 * 60 * 1000; // 3 minutes

    if (elapsedTime < cooldownTime) {
      const remainingTime = Math.ceil(
        (cooldownTime - elapsedTime) / 1000
      );

      return res.status(429).json({
        message: "Please wait before generating another report",
        remainingTime: 180 // seconds
      });
    }
  }

  userCooldowns.set(userId, Date.now());

  next();
};

module.exports = {
  interviewCooldown,
};