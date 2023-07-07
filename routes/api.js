/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const { ValidationError } = require('mongoose').Error;

const Book = require('../models/book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res, next) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, { comments: 0 })
        .then((books) => {
          res.json(books);
        })
        .catch(next);
    })
    .post(function (req, res, next) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      new Book({ title })
        .save()
        .then((createdBook) => {
          res.status(201).json(createdBook);
        })
        .catch((err) => {
          if (err instanceof ValidationError) {
            res.send('missing required field title');
            return;
          }
          next(err);
        });
    })
    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res, next) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, { commentcount: 0 })
        .then((book) => {
          if (!book) {
            res.send('no book exists');
            return;
          }
          res.json(book);
        })
        .catch(next);
    })
    .post(function (req, res, next) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      //json res format same as .get
      Book.findById(bookid)
        .then((book) => {
          if (!book) {
            res.send('no book exists');
            return;
          }
          book.comments.push({ comment });
          return book.save();
        })
        .then(({ _id, title, comments }) => {
          res.status(201).json({
            _id,
            title,
            comments,
          });
        })
        .catch(next);
    })
    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
