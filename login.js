document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const messageDiv = document.querySelector(".fs-6 a");
  let userAttempts = localStorage.getItem('userAttempts');
  let userData = userAttempts ? JSON.parse(userAttempts) : { attempts: 3, isAccountLocked: false };

  fetch('users.json')
    .then(response => response.json())
    .then(data => {
      const authorizedUsers = data;

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (userData.isAccountLocked) {
          updateMessage("Tu cuenta ha sido bloqueada.", "text-danger");
          return;
        }

        const username = form.userName.value;
        const password = form.password.value;

        const authenticated = authenticate(username, password);

        if (authenticated) {
          window.location.href = "logout.html";
        } else {
          userData.attempts--;

          if (userData.attempts === 0) {
            updateMessage("Has excedido el número máximo de intentos. Tu cuenta ha sido bloqueada.", "red");
            userData.isAccountLocked = true;
            form.querySelector("button").disabled = true;
          } else {
            const message = `Credenciales incorrectas. Te quedan ${userData.attempts} intentos.`;
            updateMessage(message, "text-dark");
          }

          localStorage.setItem('userAttempts', JSON.stringify(userData));
        }
      });

      function authenticate(username, password) {
        const user = authorizedUsers.find((user) => user.username === username && user.password === password);
        return !!user;
      }

      function updateMessage(text = '', color = 'text-dark') {
        messageDiv.textContent = text;
        messageDiv.style.color = color;
      }

      form.addEventListener("input", () => {
        resetAttempts();
      });

      function resetAttempts() {
        userData.attempts = 3;
        userData.isAccountLocked = false;
        form.querySelector("button").disabled = false;
        localStorage.setItem('userAttempts', JSON.stringify(userData));
        updateMessage(); 
      }

      const logoutButton = document.getElementById("logoutButton");

      logoutButton.addEventListener("click", () => {
        localStorage.removeItem('userAttempts');
        window.location.href = "login.html";
      });
    })
    .catch(error => {
      console.error('Error al cargar usuarios:', error);
    });
});