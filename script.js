const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const messageEl = document.getElementById('message');

// Utility to format ISO date nicely
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

async function loadFeedback() {
  try {
    const res = await fetch('/feedback');
    if (!res.ok) throw new Error('Failed to load feedback');
    const feedback = await res.json();

    feedbackList.innerHTML = '';
    if (feedback.length === 0) {
      feedbackList.innerHTML = '<li>No feedback yet. Be the first!</li>';
      return;
    }

    feedback.forEach(({ id, username, comment, createdAt }) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${username}</strong>: ${comment}
                      <div class="timestamp">${formatDate(createdAt)}</div>`;
      feedbackList.appendChild(li);
    });
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.className = '';
  }
}

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageEl.textContent = '';
  messageEl.className = '';

  const username = feedbackForm.username.value.trim();
  const comment = feedbackForm.comment.value.trim();

  // Client-side validation
  if (username.length < 2) {
    messageEl.textContent = 'Name must be at least 2 characters.';
    return;
  }
  if (comment.length < 5) {
    messageEl.textContent = 'Feedback must be at least 5 characters.';
    return;
  }

  try {
    feedbackForm.querySelector('button').disabled = true;
    messageEl.textContent = 'Submitting...';

    const res = await fetch('/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Submission failed');
    }

    messageEl.textContent = data.message;
    messageEl.className = 'success';

    feedbackForm.reset();
    loadFeedback();
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.className = '';
  } finally {
    feedbackForm.querySelector('button').disabled = false;
  }
});

// Initial load
loadFeedback();
