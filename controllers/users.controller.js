require("dotenv").config();
const UserService = require("../services/users.sevice");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models");
class SocialuserController {
  userService = new UserService();
  kakaologin = (req, res, next) => {
    passport.authenticate(
      "kakao",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;

        const token = jwt.sign({ userId, nickname }, process.env.MYSECRET_KEY, {
          expiresIn: "2d",
        });
        res.status(200).json({
          token,
          message: "success",
        });
      }
    )(req, res, next);
  };

  createAccount = async (req, res, next) => {
    const { nickname, profile } = req.body;
    const createUser = await User.create(nickname, profile);
    return res.status(201).json({ createUser });
  };
  addDistance = async (req, res, next) => {
    try {
      const { distance } = req.body;
      if (!distance) {
        log.error("UserController.addDistance : distance is required");
        throw new BadRequestError(
          "UserController.addDistance : distance is required"
        );
      }
      const { userId } = req.body;
      console.log(distance, userId);
      const addDistance = await this.userService.addDistance(userId, distance);
      res.status(201).json(addDistance);
    } catch (error) {
      next(error);
    }
  };
  getUserPost = async (req, res, next) => {
    try {
      const { nickname, pagenum } = req.params;
      const { userId } = req.body;
      if (!nickname) {
        log.error("UserController.getUserPost : nickname is required");
        throw new BadRequestError(
          "UserController.getUserPost : nickname is required"
        );
      }
      let type = false;
      const getUserPost = await this.userService.getUserPost(
        nickname,
        pagenum,
        userId
      );
      if (!getUserPost.length) {
        type = true;
      }
      res.status(200).json({ Post: getUserPost, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  searchUser = async (req, res, next) => {
    try {
      const { nickname } = req.query;
      if (!nickname) {
        log.error("UserController.searchUser : nickname is required");
        throw new BadRequestError(
          "UserController.searchUser : nickname is required"
        );
      }

      const searchUser = await this.userService.searchUser(nickname);
      res.status(200).json(searchUser);
    } catch (error) {
      next(error);
    }
  };
  signUp = async (req, res, next) => {
    try {
      let consonant = [];
      const { email, nickname, profile } = req.body;
      consonant = help.explode(nickname).join("");
      const signUp = await User.create({ email, nickname, consonant, profile });

      res.status(200).json(signUp);
    } catch (error) {
      next(error);
    }
  };
  setGoal = async (req, res, next) => {
    try {
      const { goal, userId } = req.body;
      const setGoal = await this.userService.setGoal(goal, userId);
      res.status(200).json(setGoal);
    } catch (error) {
      next(error);
    }
  };
  changeProfile = async (req, res, next) => {
    try {
      const { profile, userId } = req.body;
      const changeProfile = await this.userService.changeProfile(
        profile,
        userId
      );
      res.status(200).json(changeProfile);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SocialuserController;
