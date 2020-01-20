const express = require("express");
const db = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ error: "posts info could not be retrieved", err });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved.", err });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  db.insert({ title, contents })
    .then(post => {
      res.status(201).json(post, title, contents);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
        err
      });
    });
});

router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed", err });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  db.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified.", err });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comms => {
      if (comms.length > 0) {
        res.status(200).json(comms);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/:id/comments", (req, res) => {
  const commentInfo = req.body;
  commentInfo.post_id = req.params.id;

  if (!commentInfo.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }

  db.insertComment(commentInfo)
    .then(comm => {
      if (comm) {
        res.status(201).json(comm);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
        err
      });
    });
});

module.exports = router;
