





// // import express from 'express';
// // import protect from '../middleware/authMiddleware.js';
// // import Post from '../models/postModel.js';
// // import User from '../models/userModel.js';
// // import Notification from '../models/notificationModel.js';

// // const router = express.Router();

// // // Helper to populate post data consistently
// // const populatePost = async (postId) => {
// //     return await Post.findById(postId)
// //         .populate('user', 'id name username avatarUrl followers following blockedUsers')
// //         .populate('comments.user', 'id name username avatarUrl followers following blockedUsers');
// // }

// // // @route   GET /api/posts/feed
// // // @desc    Get posts for the current user's feed
// // router.get('/feed', protect, async (req, res) => {
// //     try {
// //         const currentUser = await User.findById(req.user.id);
// //         if (!currentUser) {
// //             return res.status(404).json({ message: "User not found" });
// //         }
// //         const userIds = [...currentUser.following, currentUser._id];

// //         const posts = await Post.find({ 'user': { $in: userIds } })
// //             .populate('user', 'id name username avatarUrl')
// //             .populate('comments.user', 'id name username avatarUrl')
// //             .sort({ createdAt: -1 })
// //             .limit(50); 

// //         res.json(posts);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });


// // // @route   GET /api/posts
// // // @desc    Get all posts for discover page, sorted by newest
// // router.get('/', protect, async (req, res) => {
// //     try {
// //         const posts = await Post.find({})
// //             .populate('user', 'id name username avatarUrl')
// //             .populate('comments.user', 'id name username avatarUrl')
// //             .sort({ createdAt: -1 });
            
// //         res.json(posts);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   POST /api/posts
// // // @desc    Create a new post
// // router.post('/', protect, async (req, res) => {
// //     const { content, imageUrl } = req.body;

// //     if (!content && !imageUrl) {
// //         return res.status(400).json({ message: 'Post must have content or an image' });
// //     }

// //     try {
// //         const post = new Post({
// //             content: content || '',
// //             imageUrl: imageUrl || null,
// //             user: req.user.id,
// //         });

// //         const createdPost = await post.save();
// //         const populated = await populatePost(createdPost._id);
        
// //         req.io.emit('newPost', populated);

// //         res.status(201).json(populated);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   DELETE /api/posts/:id
// // // @desc    Delete a post
// // router.delete('/:id', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);

// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         if (post.user.toString() !== req.user.id) {
// //             return res.status(401).json({ message: 'User not authorized' });
// //         }

// //         await post.deleteOne();
        
// //         req.io.emit('postDeleted', req.params.id);

// //         res.json({ message: 'Post removed' });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });


// // // @route   PUT /api/posts/:id/like
// // // @desc    Like or unlike a post
// // router.put('/:id/like', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const isLiked = post.likes.some(like => like.equals(req.user.id));

// //         if (isLiked) {
// //             post.likes = post.likes.filter(like => !like.equals(req.user.id));
// //         } else {
// //             post.likes.push(req.user.id);
// //             if (post.user.toString() !== req.user.id) {
// //                  const notification = new Notification({
// //                     recipient: post.user,
// //                     sender: req.user.id,
// //                     type: 'like',
// //                     postId: post._id,
// //                 });
// //                 await notification.save();
// //                 const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');

// //                 const recipientSocket = req.onlineUsers.get(post.user.toString());
// //                 if (recipientSocket) {
// //                     req.io.to(recipientSocket).emit('newNotification', populatedNotification);
// //                 }
// //             }
// //         }

// //         await post.save();
// //         const populated = await populatePost(post._id);

// //         req.io.emit('postUpdated', populated);
        
// //         res.json(populated);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   POST /api/posts/:id/comments
// // // @desc    Comment on a post
// // router.post('/:id/comments', protect, async (req, res) => {
// //     const { text } = req.body;
// //      if (!text) {
// //         return res.status(400).json({ message: 'Comment text is required' });
// //     }
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const newComment = { text, user: req.user.id };
// //         post.comments.push(newComment);
// //         await post.save();

// //         if (post.user.toString() !== req.user.id) {
// //              const notification = new Notification({
// //                 recipient: post.user,
// //                 sender: req.user.id,
// //                 type: 'comment',
// //                 postId: post._id,
// //             });
// //             await notification.save();
// //             const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');

// //             const recipientSocket = req.onlineUsers.get(post.user.toString());
// //             if (recipientSocket) {
// //                 req.io.to(recipientSocket).emit('newNotification', populatedNotification);
// //             }
// //         }
        
// //         const populated = await populatePost(post._id);
// //         req.io.emit('postUpdated', populated);
// //         res.status(201).json(populated);

// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   DELETE /api/posts/:id/comments/:comment_id
// // // @desc    Delete a comment
// // router.delete('/:id/comments/:comment_id', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const comment = post.comments.find(c => c._id.toString() === req.params.comment_id);
// //         if (!comment) {
// //             return res.status(404).json({ message: 'Comment does not exist' });
// //         }

// //         if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
// //             return res.status(401).json({ message: 'User not authorized' });
// //         }

// //         post.comments = post.comments.filter(c => c._id.toString() !== req.params.comment_id);
// //         await post.save();

// //         const populated = await populatePost(post._id);
// //         req.io.emit('postUpdated', populated);
// //         res.json(populated);

// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // export default router;






// // import express from 'express';
// // import protect from '../middleware/authMiddleware.js';
// // import Post from '../models/postModel.js';
// // import User from '../models/userModel.js';
// // import Notification from '../models/notificationModel.js';

// // const router = express.Router();

// // // Helper to populate post data consistently
// // const populatePost = async (postId) => {
// //     return await Post.findById(postId)
// //         .populate('user', 'id name username avatarUrl followers following blockedUsers')
// //         .populate('comments.user', 'id name username avatarUrl followers following blockedUsers');
// // }

// // // @route   GET /api/posts/feed
// // // @desc    Get posts for the current user's feed
// // router.get('/feed', protect, async (req, res) => {
// //     try {
// //         const currentUser = await User.findById(req.user.id);
// //         if (!currentUser) {
// //             return res.status(404).json({ message: "User not found" });
// //         }
// //         const userIds = [...currentUser.following, currentUser._id];

// //         const posts = await Post.find({ 'user': { $in: userIds } })
// //             .populate('user', 'id name username avatarUrl')
// //             .populate('comments.user', 'id name username avatarUrl')
// //             .sort({ createdAt: -1 })
// //             .limit(50); 

// //         res.json(posts);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });


// // // @route   GET /api/posts
// // // @desc    Get all posts for discover page, sorted by newest
// // router.get('/', protect, async (req, res) => {
// //     try {
// //         const posts = await Post.find({})
// //             .populate('user', 'id name username avatarUrl')
// //             .populate('comments.user', 'id name username avatarUrl')
// //             .sort({ createdAt: -1 });
            
// //         res.json(posts);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   POST /api/posts
// // // @desc    Create a new post
// // router.post('/', protect, async (req, res) => {
// //     const { content, imageUrl } = req.body;

// //     if (!content && !imageUrl) {
// //         return res.status(400).json({ message: 'Post must have content or an image' });
// //     }

// //     try {
// //         const post = new Post({
// //             content: content || '',
// //             imageUrl: imageUrl || null,
// //             user: req.user.id,
// //         });

// //         const createdPost = await post.save();
// //         const populated = await populatePost(createdPost._id);
        
// //         req.io.emit('newPost', populated);

// //         res.status(201).json(populated);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   DELETE /api/posts/:id
// // // @desc    Delete a post
// // router.delete('/:id', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);

// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         if (post.user.toString() !== req.user.id) {
// //             return res.status(401).json({ message: 'User not authorized' });
// //         }

// //         await post.deleteOne();
        
// //         req.io.emit('postDeleted', req.params.id);

// //         res.json({ message: 'Post removed' });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });


// // // @route   PUT /api/posts/:id/like
// // // @desc    Like or unlike a post
// // router.put('/:id/like', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const isLiked = post.likes.some(like => like.equals(req.user.id));

// //         if (isLiked) {
// //             post.likes = post.likes.filter(like => !like.equals(req.user.id));
// //         } else {
// //             post.likes.push(req.user.id);
// //             if (post.user.toString() !== req.user.id) {
// //                 const existingNotification = await Notification.findOne({
// //                    recipient: post.user,
// //                    sender: req.user.id,
// //                    type: 'like',
// //                    postId: post._id,
// //                 });

// //                 if (!existingNotification) {
// //                     const notification = new Notification({
// //                         recipient: post.user,
// //                         sender: req.user.id,
// //                         type: 'like',
// //                         postId: post._id,
// //                     });
// //                     await notification.save();
// //                     const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');
// //                     const recipientSocket = req.onlineUsers.get(post.user.toString());
// //                     if (recipientSocket) {
// //                         req.io.to(recipientSocket).emit('newNotification', populatedNotification);
// //                     }
// //                 }
// //             }
// //         }

// //         await post.save();
// //         const populated = await populatePost(post._id);

// //         req.io.emit('postUpdated', populated);
        
// //         res.json(populated);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   POST /api/posts/:id/comments
// // // @desc    Comment on a post
// // router.post('/:id/comments', protect, async (req, res) => {
// //     const { text } = req.body;
// //      if (!text) {
// //         return res.status(400).json({ message: 'Comment text is required' });
// //     }
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const newComment = { text, user: req.user.id };
// //         post.comments.push(newComment);
// //         await post.save();

// //         if (post.user.toString() !== req.user.id) {
// //              const notification = new Notification({
// //                 recipient: post.user,
// //                 sender: req.user.id,
// //                 type: 'comment',
// //                 postId: post._id,
// //             });
// //             await notification.save();
// //             const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');

// //             const recipientSocket = req.onlineUsers.get(post.user.toString());
// //             if (recipientSocket) {
// //                 req.io.to(recipientSocket).emit('newNotification', populatedNotification);
// //             }
// //         }
        
// //         const populated = await populatePost(post._id);
// //         req.io.emit('postUpdated', populated);
// //         res.status(201).json(populated);

// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // // @route   DELETE /api/posts/:id/comments/:comment_id
// // // @desc    Delete a comment
// // router.delete('/:id/comments/:comment_id', protect, async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         const comment = post.comments.find(c => c._id.toString() === req.params.comment_id);
// //         if (!comment) {
// //             return res.status(404).json({ message: 'Comment does not exist' });
// //         }

// //         if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
// //             return res.status(401).json({ message: 'User not authorized' });
// //         }

// //         post.comments = post.comments.filter(c => c._id.toString() !== req.params.comment_id);
// //         await post.save();

// //         const populated = await populatePost(post._id);
// //         req.io.emit('postUpdated', populated);
// //         res.json(populated);

// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // });

// // export default router;





// import express from 'express';
// import protect from '../middleware/authMiddleware.js';
// import Post from '../models/postModel.js';
// import User from '../models/userModel.js';
// import Notification from '../models/notificationModel.js';

// const router = express.Router();

// // A robust helper to populate author details on a post or array of posts.
// const populateAuthors = (posts) => {
//     return Post.populate(posts, {
//         path: 'user',
//         select: 'id name username avatarUrl bannerUrl bio followers following blockedUsers',
//         model: 'User'
//     });
// };

// // @route   GET /api/posts/feed
// // @desc    Get posts for the current user's feed
// router.get('/feed', protect, async (req, res) => {
//     try {
//         // Re-fetch the current user to ensure we have the latest 'following' list.
//         const currentUser = await User.findById(req.user.id);
//         if (!currentUser) {
//             return res.status(401).json({ message: "User not found." });
//         }
        
//         const followingIds = currentUser.following || [];
//         const userIdsForFeed = [currentUser._id, ...followingIds];

//         // 1. Find the raw post documents first. This is a safe operation.
//         const rawPosts = await Post.find({ user: { $in: userIdsForFeed } })
//             .sort({ createdAt: -1 })
//             .limit(50);
            
//         // 2. Safely populate the author details on the documents we found.
//         const postsWithAuthors = await populateAuthors(rawPosts);
        
//         // 3. Final filter to ensure we don't send any posts with null (deleted) authors.
//         const finalPosts = postsWithAuthors.filter(p => p.user);

//         res.json(finalPosts);

//     } catch (error) {
//         console.error("Error in /api/posts/feed route:", error);
//         res.status(500).json({ message: 'Server failed to fetch feed posts.' });
//     }
// });


// // @route   GET /api/posts
// // @desc    Get all posts for discover page, sorted by newest
// router.get('/', protect, async (req, res) => {
//     try {
//         // 1. Find all posts first.
//         const rawPosts = await Post.find({}).sort({ createdAt: -1 });

//         // 2. Then populate them. This is a safer pattern.
//         const postsWithAuthors = await populateAuthors(rawPosts);

//         // 3. Filter out any posts with null authors.
//         const finalPosts = postsWithAuthors.filter(p => p.user);
        
//         res.json(finalPosts);
//     } catch (error) {
//         console.error("Discover posts route error:", error);
//         res.status(500).json({ message: 'Server Error on discover posts route' });
//     }
// });

// // @route   POST /api/posts
// // @desc    Create a new post
// router.post('/', protect, async (req, res) => {
//     const { content, imageUrl } = req.body;

//     if (!content && !imageUrl) {
//         return res.status(400).json({ message: 'Post must have content or an image' });
//     }

//     try {
//         const post = new Post({
//             content: content || '',
//             imageUrl: imageUrl || null,
//             user: req.user.id,
//         });

//         let createdPost = await post.save();
//         createdPost = await populateAuthors(createdPost);
        
//         req.io.emit('newPost', createdPost);

//         res.status(201).json(createdPost);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @route   DELETE /api/posts/:id
// // @desc    Delete a post
// router.delete('/:id', protect, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         if (post.user.toString() !== req.user.id) {
//             return res.status(401).json({ message: 'User not authorized' });
//         }

//         await post.deleteOne();
        
//         req.io.emit('postDeleted', req.params.id);

//         res.json({ message: 'Post removed' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// // @route   PUT /api/posts/:id/like
// // @desc    Like or unlike a post
// router.put('/:id/like', protect, async (req, res) => {
//     try {
//         let post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const isLiked = post.likes.some(like => like.equals(req.user.id));

//         if (isLiked) {
//             post.likes = post.likes.filter(like => !like.equals(req.user.id));
//         } else {
//             post.likes.push(req.user.id);
//             if (post.user.toString() !== req.user.id) {
//                 const existingNotification = await Notification.findOne({
//                    recipient: post.user,
//                    sender: req.user.id,
//                    type: 'like',
//                    postId: post._id,
//                 });

//                 if (!existingNotification) {
//                     const notification = new Notification({
//                         recipient: post.user,
//                         sender: req.user.id,
//                         type: 'like',
//                         postId: post._id,
//                     });
//                     await notification.save();
//                     const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');
//                     const recipientSocket = req.onlineUsers.get(post.user.toString());
//                     if (recipientSocket) {
//                         req.io.to(recipientSocket).emit('newNotification', populatedNotification);
//                     }
//                 }
//             }
//         }

//         let updatedPost = await post.save();
//         updatedPost = await populateAuthors(updatedPost);

//         req.io.emit('postUpdated', updatedPost);
        
//         res.json(updatedPost);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @route   POST /api/posts/:id/comments
// // @desc    Comment on a post
// router.post('/:id/comments', protect, async (req, res) => {
//     const { text } = req.body;
//      if (!text) {
//         return res.status(400).json({ message: 'Comment text is required' });
//     }
//     try {
//         let post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const newComment = { text, user: req.user.id };
//         post.comments.push(newComment);
        
//         if (post.user.toString() !== req.user.id) {
//              const notification = new Notification({
//                 recipient: post.user,
//                 sender: req.user.id,
//                 type: 'comment',
//                 postId: post._id,
//             });
//             await notification.save();
//             const populatedNotification = await notification.populate('sender', 'id name username avatarUrl');

//             const recipientSocket = req.onlineUsers.get(post.user.toString());
//             if (recipientSocket) {
//                 req.io.to(recipientSocket).emit('newNotification', populatedNotification);
//             }
//         }
        
//         let updatedPost = await post.save();
//         updatedPost = await populateAuthors(updatedPost);

//         req.io.emit('postUpdated', updatedPost);
//         res.status(201).json(updatedPost);

//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @route   DELETE /api/posts/:id/comments/:comment_id
// // @desc    Delete a comment
// router.delete('/:id/comments/:comment_id', protect, async (req, res) => {
//     try {
//         let post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const comment = post.comments.find(c => c._id.toString() === req.params.comment_id);
//         if (!comment) {
//             return res.status(404).json({ message: 'Comment does not exist' });
//         }

//         if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
//             return res.status(401).json({ message: 'User not authorized' });
//         }

//         post.comments = post.comments.filter(c => c._id.toString() !== req.params.comment_id);
        
//         let updatedPost = await post.save();
//         updatedPost = await populateAuthors(updatedPost);
        
//         req.io.emit('postUpdated', updatedPost);
//         res.json(updatedPost);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// export default router;




import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';

const router = express.Router();

// A helper to consistently populate a post document after it's saved/updated.
const fullyPopulatePost = async (post) => {
    await post.populate('user', 'name username avatarUrl');
    await post.populate('comments.user', 'name username avatarUrl');
    return post;
};

// @route   GET /api/posts/feed
// @desc    Get posts for the current user's feed
router.get('/feed', protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(401).json({ message: "User not found." });
        }
        
        const userIdsForFeed = [currentUser._id, ...(currentUser.following || [])];

        const posts = await Post.find({ user: { $in: userIdsForFeed } })
            .populate('user', 'name username avatarUrl')
            .populate({
                path: 'comments.user',
                select: 'name username avatarUrl'
            })
            .sort({ createdAt: -1 })
            .limit(50);
        
        // Filter out any posts where the author might have been deleted but the post remains.
        const validPosts = posts.filter(post => post.user);

        res.json(validPosts);

    } catch (error) {
        console.error("Error in /api/posts/feed route:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   GET /api/posts
// @desc    Get all posts for discover page, sorted by newest
router.get('/', protect, async (req, res) => {
    try {
         const posts = await Post.find({})
            .populate('user', 'name username avatarUrl')
            .populate({
                path: 'comments.user',
                select: 'name username avatarUrl'
            })
            .sort({ createdAt: -1 });
        
        const validPosts = posts.filter(post => post.user);

        res.json(validPosts);
    } catch (error) {
        console.error("Discover posts route error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
router.get('/:id', protect, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post = await fullyPopulatePost(post);
        res.json(post);
    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   POST /api/posts
// @desc    Create a new post
router.post('/', protect, async (req, res) => {
    const { content, imageUrl } = req.body;
    if (!content && !imageUrl) {
        return res.status(400).json({ message: 'Post must have content or an image' });
    }
    try {
        const post = new Post({
            content: content || '',
            imageUrl: imageUrl || null,
            user: req.user.id,
        });

        let createdPost = await post.save();
        createdPost = await createdPost.populate({ 
            path: 'user', 
            select: 'name username avatarUrl' 
        });
        
        req.io.emit('newPost', createdPost);
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await post.deleteOne();
        req.io.emit('postDeleted', req.params.id);
        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post
router.put('/:id/like', protect, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.some(like => like.equals(req.user.id));
        if (isLiked) {
            post.likes = post.likes.filter(like => !like.equals(req.user.id));
        } else {
            post.likes.push(req.user.id);
            if (post.user.toString() !== req.user.id) {
                const existingNotification = await Notification.findOne({
                   recipient: post.user,
                   sender: req.user.id,
                   type: 'like',
                   postId: post._id,
                });
                if (!existingNotification) {
                    const notification = new Notification({
                        recipient: post.user,
                        sender: req.user.id,
                        type: 'like',
                        postId: post._id,
                    });
                    await notification.save();
                    const populatedNotification = await notification.populate('sender', 'name username avatarUrl');
                    const recipientSocket = req.onlineUsers.get(post.user.toString());
                    if (recipientSocket) {
                        req.io.to(recipientSocket).emit('newNotification', populatedNotification);
                    }
                }
            }
        }

        let updatedPost = await post.save();
        updatedPost = await fullyPopulatePost(updatedPost);
        req.io.emit('postUpdated', updatedPost);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/posts/:id/comments
// @desc    Comment on a post
router.post('/:id/comments', protect, async (req, res) => {
    const { text } = req.body;
     if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = { text, user: req.user.id };
        post.comments.push(newComment);
        
        if (post.user.toString() !== req.user.id) {
             const notification = new Notification({
                recipient: post.user,
                sender: req.user.id,
                type: 'comment',
                postId: post._id,
            });
            await notification.save();
            const populatedNotification = await notification.populate('sender', 'name username avatarUrl');
            const recipientSocket = req.onlineUsers.get(post.user.toString());
            if (recipientSocket) {
                req.io.to(recipientSocket).emit('newNotification', populatedNotification);
            }
        }
        
        let updatedPost = await post.save();
        updatedPost = await fullyPopulatePost(updatedPost);
        req.io.emit('postUpdated', updatedPost);
        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/posts/:id/comments/:comment_id
// @desc    Delete a comment
router.delete('/:id/comments/:comment_id', protect, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.find(c => c._id.toString() === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment does not exist' });
        }

        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        post.comments = post.comments.filter(c => c._id.toString() !== req.params.comment_id);
        
        let updatedPost = await post.save();
        updatedPost = await fullyPopulatePost(updatedPost);
        req.io.emit('postUpdated', updatedPost);
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;