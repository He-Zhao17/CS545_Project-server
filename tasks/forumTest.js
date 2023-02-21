const error = require("../errors");
const data = require("../data");
const services = require("../services");

const test = async () => {
  const forum = {
    createdById: "b8fbf17a-e673-418f-86ea-fbf33274c041",
    title: "Test title",
    body: "Test body",
    comments: [],
    votes: 0,
  };

  try {
    error.schema.checkSchema(forum, "forumSchema");
    const add = await data.forum.addForum(forum);
    console.log(add);
  } catch (error) {
    console.log(error);
  }
};

const getForum = async (forumId) => {
  try {
    const forum = await data.forum.getForum(forumId);
    console.log(forum);
  } catch (error) {
    console.log(error);
  }
};

const addComment = async (userId, forumId, comment) => {
  try {
    const com = await data.comment.addComment(comment, userId);
    console.log(com);
    const addCommentToFrm = await data.forum.addCommentToForum(
      forumId,
      userId,
      com.commentId
    );

    console.log({ com, addCommentToFrm });
  } catch (error) {
    console.log(error);
  }
};

test();
getForum("d03bc119-32ad-444c-8e83-5178be92722a");
addComment(
  "0102c7b3-9ba8-4d62-b462-218bc75d9180",
  "d03bc119-32ad-444c-8e83-5178be92722a",
  "This is a comment."
);
