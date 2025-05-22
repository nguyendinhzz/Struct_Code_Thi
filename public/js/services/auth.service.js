async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });
    if (response.data) {
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      window.location.href = "/pages/dashboard.html";
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Đăng nhập thất bại");
    } else if (error.request) {
      alert("Không thể kết nối đến server");
    } else {
      alert("Có lỗi xảy ra");
    }
    console.error("Lỗi đăng nhập:", error);
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    });
    if (response.data) {
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      window.location.href = "/pages/dashboard.html";
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Đăng ký thất bại");
    } else if (error.request) {
      alert("Không thể kết nối đến server");
    } else {
      alert("Có lỗi xảy ra");
    }
    console.error("Lỗi đăng nhập:", error);
  }
}
