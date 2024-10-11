import { users } from "./constants.mjs";

// Middleware to handle find the index and handle it 
export const resolveIndexByUserId = (req, res, next) => {
    const {
      params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = users.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex //passing the value of finduserindex to the next callback
    next()
  };