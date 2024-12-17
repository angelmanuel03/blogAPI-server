const express = require("express");

const router = express.Router();

const blogController = require("../controllers/blog.js");

const { verify, verifyAdmin } = require("../auth.js");


router.post("/post", verify, blogController.addPost)
router.get("/getAllPost", blogController.getAllPost)
router.get("/getMyPost", verify, blogController.getMyPost)


router.get("/viewPost/:postId", verify, blogController.viewPost)
router.patch("/editPost/:postId", verify, blogController.editPost)
router.delete("/deletePost/:postId", verify, blogController.deletePost)



module.exports = router;