const userId = 1; // static for now

function fetchTasks() {
  fetch(`http://localhost:3000/tasks/${userId}`)
    .then(res => res.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      let total = 0;

      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.title} - ${task.points} points`;

        if (!task.is_completed) {
          const btn = document.createElement('button');
          btn.innerText = 'Complete';
          btn.onclick = () => completeTask(task.id);
          li.appendChild(btn);
        } else {
          total += task.points;
          li.style.textDecoration = 'line-through';
        }

        taskList.appendChild(li);
      });

      document.getElementById('totalPoints').innerText = total;
    });
}

function addTask() {
  const title = document.getElementById('taskTitle').value;
  const points = document.getElementById('taskPoints').value;

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, title, points })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskPoints').value = '';
      fetchTasks();
    });
}

function completeTask(taskId) {
  fetch(`http://localhost:3000/tasks/complete/${taskId}`, {
    method: 'PUT'
  })
    .then(res => res.json())
    .then(() => fetchTasks());
}

function fetchRewards() {
  fetch('http://localhost:3000/rewards')
    .then(res => res.json())
    .then(rewards => {
      const rewardList = document.getElementById('rewardList');
      rewardList.innerHTML = '';
      rewards.forEach(reward => {
        const li = document.createElement('li');
        li.innerHTML = `${reward.title} - Cost: ${reward.cost} points`;

        const btn = document.createElement('button');
        btn.innerText = 'Claim';
        btn.onclick = () => claimReward(reward.id);
        li.appendChild(btn);

        rewardList.appendChild(li);
      });
    });
}

function claimReward(rewardId) {
  fetch('http://localhost:3000/rewards/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, reward_id: rewardId })
  })
    .then(res => res.json())
    .then(() => {
      alert('Reward claimed!');
      fetchTasks();
    });
}

fetchTasks();
fetchRewards();

