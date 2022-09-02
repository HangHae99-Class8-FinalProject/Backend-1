const PostService = require("../services/posts.service");
const { Hashtag } = require("../models");
let BadRequestError = require("./http-errors").BadRequestError;
class PostController {
  postService = new PostService();

  createPost = async (req, res, next) => {
    try {
      const { content, time, distance, path, speed, image, hashtag, userId } =
        req.body;
      if (!content) {
        throw new BadRequestError("content is require");
      }

      const createPost = await this.postService.createPost(
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag,
        userId
      );
      let arr_hashtag = hashtag.toString().split(" ");
      for (let i = 0; i < arr_hashtag.length; i++) {
        const createHashtag = await Hashtag.create({
          hashtag: arr_hashtag[i],
          postId: createPost.postId,
        });
      }

      res.status(201).json(createPost);
    } catch (error) {
      next(error);
    }
  };
  getAllPosts = async (req, res, next) => {
    try {
      const getAllPosts = await this.postService.getAllPosts();

      if (!getAllPosts.length) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ Post: getAllPosts });
    } catch (error) {
      next(error);
    }
  };
  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;

      if (!postId) {
        throw new BadRequestError("postId is required");
      }
      const getPost = await this.postService.getPost(postId);

      if (!getPost) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json(getPost);
    } catch (error) {
      next(error);
    }
  };
  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content, time, distance, path, speed, image, hashtag } = req.body;
      const updatePost = await this.postService.updatePost(
        postId,
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag
      );

      if (updatePost[0] === 0) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };
  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const deletePost = await this.postService.deletePost(postId);

      if (deletePost === 0) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };

  getLikeAllPosts = async (req, res, next) => {
    try {
      const getLikeAllPosts = await this.postService.geLikeAllPosts();
      if (!getLikeAllPosts.length) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ Post: getLikeAllPosts });
    } catch (error) {
      next(error);
    }
  };
  searchPost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;
      if (!hashtag) {
        throw new BadRequestError("hashtag is required");
      }
      const searchPost = await this.postService.searchPost(hashtag);
      res.status(200).json({ test: searchPost });
    } catch (error) {
      next(error);
    }
  };
  autoSearchPost = async (req, res, next) => {
    try {
      const { hashtag1 } = req.query;
      const autoSearchPost = await this.postService.autoSearchPost(hashtag1);

      res.status(200).json(autoSearchPost);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostController;