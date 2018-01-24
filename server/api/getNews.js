const router = require('express').Router();
const News = require('../models/news.model');
const User = require('../models/user.model');

const queryFunc = (news, user) => {
  return {
    id: news._id,
    theme: news.theme,
    text: news.text,
    date: news.date,
    user: {
      access_token: user.access_token,
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      surName: user.surName,
      middleName: user.middleName,
      image: user.image
    }
  };
};

router.get('/', (req, res, next) => {
  News.find()
    .then(posts => {
      console.log('length', posts.length);
      // if there is no news, return empty array
      if (!posts.length) return res.json(posts);

      // Initializing an empty array
      const array = [];
      // save the number of records and reduce by 1
      const length = posts.length - 1;
      // starting the cycle
      posts.forEach((post, index) => {
        console.log(length, index);
        // extracting author's data
        User.findById(post.userId)
          .then(user => {
            // Preparing object with data & pushing to an array
            array.push(queryFunc(post, user));
            // comparing post's index with an length
            // if equal, sending data to client
            if (length === index) res.json(array);
          })
          // If an error occurred, call next with error message
          .catch(err => next(err));
      });
    })
    // If an error occurred, call next with error message
    .catch(err => next(err));
});

module.exports = router;
