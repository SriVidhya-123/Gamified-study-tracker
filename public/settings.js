document.getElementById("profileForm").onsubmit = function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch("http://localhost:3000/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(msg => {
      alert(msg.message);
      document.getElementById("profileForm").reset();
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong. Please try again.");
    });
};
