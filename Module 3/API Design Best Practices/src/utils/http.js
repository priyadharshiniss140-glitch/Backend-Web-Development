function sendList(res, posts, meta) {
  return res.status(200).json({
    data: posts,
    meta
  });
}

function sendCreated(res, post) {
  return res.status(201).json({ data: post });
}

function sendOk(res, data) {
  return res.status(200).json({ data });
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
