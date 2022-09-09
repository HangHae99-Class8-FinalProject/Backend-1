const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
      res.status(401).json({
        result: false,
        errormessage: "토큰 타입이 맞지 않습니다.",
      });
      return;
    }
    try {
      const privatekey = jwt.verify(tokenValue, process.env.MYSECRET_KEY);
      // console.log(privatekey);
      User.findByPk(privatekey.userkey).then((email, nickname, provider) => {
        res.locals.user = { email, nickname, provider };
        next();
      });
    } catch (err) {
      res.status(401).json({
        result: false,
        errormessage: "토큰 유효성 검사에 실패했습니다.",
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      result: false,
      errormessage: "로그인 후 사용 가능합니다.",
    });
    return;
  }
};
