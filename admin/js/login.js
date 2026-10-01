/* Login page */
if (DB.get(AK.AUTH, false)) location.replace("dashboard.html");

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  if (document.getElementById("email").value === "admin@careconnect.in" && document.getElementById("password").value === "admin123") {
    DB.set(AK.AUTH, true);
    location.href = "dashboard.html";
  } else document.getElementById("loginErr").textContent = "Invalid credentials.";
});
