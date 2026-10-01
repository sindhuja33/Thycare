/* Employee login — prototype: pick yourself + PIN 1234 */
seedDemo();
if (DB.get(EMP_AUTH, null)) location.replace("home.html");

const sel = document.getElementById("emp");
sel.innerHTML = DB.employees().map(e => `<option value="${e.id}">${e.name} · ${e.id}</option>`).join("");

document.getElementById("loginForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const e = DB.employees().find(x => x.id === sel.value);
  if (document.getElementById("pin").value !== "1234") { document.getElementById("loginErr").textContent = "Wrong PIN."; return; }
  if (e.status === "inactive") { document.getElementById("loginErr").textContent = "Your account is inactive. Contact admin."; return; }
  DB.set(EMP_AUTH, e.id);
  location.href = "home.html";
});
