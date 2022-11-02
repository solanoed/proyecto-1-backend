const router = require("express").Router;
const PostLike = require("../models/post-likes");
const Post = require("../models/post");
const { query } = require("express");
const route = router();

//Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo

//Endpoint de informacion de publicacion --> Falta
route.get("/", async (req, res) => {
  try {
    //the author you want to see posts
    const { post_id } = req.query;
    if (!post_id) {
      return res.status(401).json({ message: "Missing post_id field" });
    }

    const post = await Post.findById(post_id).lean();
    const likes = await PostLike.count({ post_id });

    return res.status(200).json({
      ...post,
      likes,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Get timeline de un usuario
route.get("/timeline", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    const posts = await Post.find({ author_id: req.query.userId }).lean();
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Get segun el creador de una publicacion
route.get("/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    const posts = await Post.find({ author_id: req.params.userId }).lean();
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// Obtener publicacion
route.get("/liked-by", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(401).json({ message: "Missing user_id field" });
    }

    //get the posts the user_id has liked
    const posts = await Post.find({ author_id: user_id }).lean();
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de dar me gusta a una publicación
route.post("/like", async (req, res) => {
  try {
    const { post_id, user_id } = req.body;
    if (post_id) {
      const alreadyExists = await PostLike.exists({
        post_id,
        user_id,
      });
      if (alreadyExists) {
        return res.status(409).json({ message: "Already liked" });
      }
      await PostLike.create({
        post_id,
        user_id,
      });
      res.status(200).json({});
    } else {
      res.status(401).json({ message: "Not Valid" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de DELETE me gusta
route.delete("/like", async (req, res) => {
  if(!req.query.likeId){
    res.status(400).json({ message:"negativo"});
  }
  try {
    await PostLike.deleteOne({
      _id:req.query.likeId
    });
    res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de CREAR publicacion
route.post("/", async (req, res) => {
  try {
    await Post.create({
      author_id: req.body.author,
      img_url: req.body.img_url,
      bio: req.body.bio,
    });
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de UPDATE publicacion
route.put("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    await Post.updateOne(
      {
        _id: req.params.id,
      },
      { $set: { bio: req.body.bio } }
    );
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de BORRAR publicacion
route.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    await Post.deleteOne({
      _id: req.params.id,
    });
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
