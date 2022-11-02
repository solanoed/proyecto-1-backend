const router = require("express").Router;
const User = require("../models/user");

const route = router();

//user info
//Response: { username, email, bio, liked_count, posts_count, followers_count, followed_count }

//crear un usuario
route.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      message:"usuario creado"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});
//get one user
route.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(401).json({ message: "user_id is missing" });
    }
    //exlude Contraseña y fecha de cumpleaños
    const user = await User.findById(user_id, "-password -birthdate").lean();
    if (Object.keys(user).length === 0) {
      return res.status(404).json({ message: "User does not exists" });
    }

    res.status(200).json({
      user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//get all
route.get("/", async (req, res) => {
  try {
    
    const users = await User.find({}).lean();
   
    res.status(200).json({
      users,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de UPDATE users
route.put("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    await User.updateOne(
      {
        _id: req.params.id,
      },
      { $set: { ...req.body } }
    );
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de BORRAR user
route.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "hace falta el id" });
    }
    await User.deleteOne({
      _id: req.params.id,
    });
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});
module.exports = route;
