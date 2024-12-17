const Blog = require("../models/Blog");
const { errorHandler } = require("../auth.js");


module.exports.addPost = (req, res) => {
    // Create a new blog post
    let newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.user.username
    });

    // Check if a blog with the same title already exists
    Blog.findOne({ title: req.body.title })
        .then(existingBlog => {
            if (existingBlog) {
                // 409 - Conflict
                return res.status(409).send({ message: 'Blog already exists' });
            } else {
                // Save the new blog post
                return newBlog.save()
                    .then(result => {
                        res.status(201).send(result); // 201 - Created
                    })
                    .catch(error => errorHandler(error, req, res));
            }
        })
        .catch(error => errorHandler(error, req, res));
};



module.exports.getAllPost = (req, res) => {
    return Blog.find({})
        .then(post => {
            if (post.length > 0) {
                return res.status(200).send({Blogs: post});
            }
            return res.status(404).send({
                message: 'No blog found'
            });
        })
        .catch(error => errorHandler(error, req, res));
};



module.exports.getMyPost = (req, res) => {
    Blog.find({ author: req.user.username })
        .then(posts => {
            if (posts.length > 0) {
                return res.status(200).send({ Blog: posts });
            } else {
                return res.status(404).send({ message: 'No Blog posts found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};



module.exports.editPost = (req, res) => {

    Blog.findById(req.params.postId)
        .then(blog => {
            if (!blog) {

                return res.status(404).send({ message: 'Blog not found' });
            }

            if (blog.author.toString() !== req.user.username) {
                return res.status(403).send({ message: 'You do not have permission to edit this blog' });
            }

            blog.title = req.body.title || blog.title;
            blog.content = req.body.content || blog.content;

            return blog.save()
                .then(updatedBlog => {
                    res.status(200).send({
                        message: 'Blog updated successfully',
                        blog: updatedBlog
                    });
                })
                .catch(error => errorHandler(error, req, res));
        })
        .catch(error => errorHandler(error, req, res));
};



module.exports.deletePost = (req, res) => {

    Blog.findById(req.params.postId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({ message: 'Blog not found' });
            }

            if (blog.author.toString() !== req.user.username && !req.user.isAdmin) {
                return res.status(403).send({ message: 'You do not have permission to delete this blog' });
            }

            return Blog.findByIdAndDelete(req.params.postId)
                .then(() => {
                    res.status(200).send({ message: 'Blog deleted successfully' });
                })
                .catch(error => errorHandler(error, req, res));
        })
        .catch(error => errorHandler(error, req, res));
};



module.exports.viewPost = (req, res) => {
    return Blog.findById(req.params.postId)
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Blog not found'});
            }

            return res.status(200).send(post);
        })
        .catch(error => errorHandler(error, req, res));
};