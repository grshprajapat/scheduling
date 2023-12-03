const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware.authenticate);
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const tokenValue = token.split(' ')[1];
  
    jwt.verify(tokenValue, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      req.user = user;
      next();
    });
};

router.post('/schedule', authenticateToken, taskController.scheduleTask);
router.get('/history', taskController.getTaskHistory);
router.put('/update/:taskId', taskController.updateTask);
router.delete('/delete/:taskId', taskController.deleteTask);

module.exports = router;
