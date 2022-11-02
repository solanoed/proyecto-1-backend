const router = require("express").Router;
const route = router();

const Follower = require("../models/follower");

route.get("/following", async (req, res) => {
  try {
    const { user_id } = req.query;
    const following = await Follower.find({ following_id: user_id });
    res.status(200).json({ users: following });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.get("/followers", async (req, res) => {
  try {
    const { user_id } = req.query;
    const followers = await Follower.find({ user_id });
    res.status(200).json({ users: followers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.post("/follow", async (req, res) => {
  try {
    const { user_id, id } = req.body;

    const isFollowing = await Follower.exists({
      user_id: id,
      following_id: user_id,
    });

    if (isFollowing) {
      return res.status(408).json({
        message: "User is following ",
      });
    }
    await Follower.create({
      user_id: id,
      following_id: user_id,
    });

    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.delete("/:id", async (req, res) => {
  if(!req.query.followId){
    res.status(400).json({ message:"negativo"});
  }
  try {
    await Follower.deleteOne({
      _id:req.query.followId
    });
    res.status(200).json({message:"ya no sigues a esta persona "});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
