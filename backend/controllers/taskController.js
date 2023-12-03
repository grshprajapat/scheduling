const { Task, User } = require('../models');
const { sendEmail } = require('../utils/email');

const WAIT_TIMEOUT = process.env.WAIT_TIMEOUT || 30;
const RETRY_OFFSET = process.env.RETRY_OFFSET || 1;
const MAX_RETRIES = process.env.MAX_RETRIES || 3;

const scheduleTaskExecution = (taskId) => {
  // Placeholder scheduling logic (use a job scheduler like Agenda or Bull in production)
  const task = Task.findByPk(taskId);

  setTimeout(async () => {
    // Simulate the ping to the given URL
    const isSuccessful = Math.random() < 0.8; // 80% success rate (for testing purposes)

    if (isSuccessful) {
      // Clear the schedule from the database
      await Task.destroy({ where: { id: taskId } });
    } else {
      // Task failed, send email notification and re-schedule
      const taskData = await Task.findByPk(taskId);

      if (taskData.retryCount < MAX_RETRIES) {
        // Increment the retry count and re-schedule
        await Task.update(
          { retry_count: taskData.retryCount + 1 },
          { where: { id: taskId } }
        );

        const nextScheduledTime = new Date(taskData.time);
        nextScheduledTime.setHours(nextScheduledTime.getHours() + RETRY_OFFSET);

        await Task.create({
          time: nextScheduledTime,
          url: taskData.url,
          requestBody: taskData.requestBody,
          headers: taskData.headers,
          token: taskData.token,
          maxRetries: taskData.maxRetries,
          UserId: taskData.UserId,
        });

        // Send email notification about the failure
        const userEmail = (await User.findByPk(taskData.UserId)).email;
        const emailSubject = 'Task Execution Failure';
        const emailText = `The scheduled task with ID ${taskId} has failed. Please check and take appropriate action.`;

        sendEmail(userEmail, emailSubject, emailText);
      } else {
        // Max retries reached, delete the task
        await Task.destroy({ where: { id: taskId } });
      }
    }
  }, WAIT_TIMEOUT * 1000); // Convert seconds to milliseconds
};

exports.scheduleTask = async (req, res) => {
  try {
    const { time, url, requestBody, headers, maxRetries } = req.body;
    const { id } = req.user;

    const scheduledTime = new Date(time);
    const job = schedule.scheduleJob(scheduledTime, async () => {
      try {
        // Implement your logic to ping the URL and handle the response
        // const response = await axios.post(url, { data: requestBody }, { headers });
        console.log(`Task executed at ${scheduledTime}`);
      } catch (error) {
        // Handle error, e.g., update retry count and reschedule
        console.error('Error pinging URL:', error);
      }
    });

    await Task.create({
      time: scheduledTime,
      url,
      requestBody,
      headers,
      maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: id,
    });

    res.status(201).json({ message: 'Task scheduled successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.schedsuleTask = async (req, res) => {
  try {
    const { time, url, requestBody, headers, token, maxRetries, userId } =
      req.body;

    const newTask = await Task.create({
      time,
      url,
      requestBody,
      headers,
      token,
      maxRetries,
      userId,
    });

    // Schedule logic
    scheduleTaskExecution(newTask.id);

    res
      .status(201)
      .json({ message: 'Task scheduled successfully', taskId: newTask.id });
  } catch (error) {
    console.error('Error scheduling task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTaskHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const taskHistory = await Task.findAll({
      where: { UserId: userId },
      order: [['id', 'DESC']],
    });

    res.status(200).json(taskHistory);
  } catch (error) {
    console.error('Error fetching task history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { time } = req.body;

    const updatedTask = await Task.update({ time }, { where: { id: taskId } });

    if (updatedTask[0] === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTaskCount = await Task.destroy({ where: { id: taskId } });

    if (deletedTaskCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
