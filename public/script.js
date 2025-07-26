const userId = 1;

function loadTasks() {
  fetch(`http://localhost:3000/tasks/${userId}`)
    .then(res => res.json())
    .then(data => {
      const taskList = document.getElementById('task-container');
      taskList.innerHTML = '';
      data.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${task.title}</strong> - ${task.points} pts
          <br>${task.description || ''}
          <br>Status: ${task.is_completed ? '✅ Completed' : '<button onclick="completeTask(' + task.id + ',' + task.points + ')">Mark Complete</button>'}
        `;
        if (task.is_completed) li.classList.add('completed');
        taskList.appendChild(li);
      });
    });
}

function loadPoints() {
  fetch(`http://localhost:3000/tasks/${userId}`)
    .then(res => res.json())
    .then(data => {
      const points = data
        .filter(task => task.is_completed)
        .reduce((sum, task) => sum + task.points, 0);
      document.getElementById('points').innerText = points;
    });
}

function loadRewards() {
  fetch(`http://localhost:3000/rewards`)
    .then(res => res.json())
    .then(data => {
      const rewardList = document.getElementById('reward-container');
      rewardList.innerHTML = '';
      data.forEach(reward => {
        const li = document.createElement('li');
        li.innerHTML = `
          🎁 ${reward.name} - ${reward.required_points} pts
          <br>${reward.description}
          <br><button onclick="claimReward(${reward.id}, ${reward.required_points})">Claim</button>
        `;
        rewardList.appendChild(li);
      });
    });
}

function addTask() {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;
  const points = parseInt(document.getElementById('task-points').value);

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, title, description, points })
  })
  .then(res => res.json())
  .then(() => {
    loadTasks();
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-points').value = 10;
  });
}

function completeTask(taskId, points) {
  fetch(`http://localhost:3000/tasks/complete/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, points })
  })
  .then(res => res.json())
  .then(() => {
    loadTasks();
    loadPoints();
  });
}

function claimReward(rewardId, requiredPoints) {
  fetch('http://localhost:3000/rewards/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, reward_id: rewardId, required_points: requiredPoints })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadPoints();
  });
}

loadTasks();
loadPoints();
loadRewards();
