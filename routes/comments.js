'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');

router.get('/:scheduleId/users/:userId/comments', authenticationEnsurer, (req, res, next) => {
  if (parseInt(req.query.delete) === 1){
    //スケジュールIDとユーザーIDの取得
    const scheduleId = req.params.scheduleId;
    const userId = req.params.userId;
    //データベースから削除する機能
    Comment.destroy({
      where:{
        scheduleId: scheduleId,
        userId: userId
      }
    }).then( () => {
      //リダイレクト
      res.redirect('/');
    })
  }
});

router.post('/:scheduleId/users/:userId/comments', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const comment = req.body.comment;
  const commentId = 1000;//とりあえず任意の値をコメントIDとして使用//TODOコメントIDをつける
  //const scheduleId = uuid.v4();
  
  Comment.upsert({
    scheduleId: scheduleId,
    userId: userId,
    comment: comment.slice(0, 255),
    commentId: commentId
  }).then(() => {
    res.json({ status: 'OK', comment: comment });
  });
});

//コメント削除のために追加
module.exports = router;
