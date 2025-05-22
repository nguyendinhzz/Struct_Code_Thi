function getPageTitle() {
  const path = window.location.pathname;
  switch (path) {
    case "/pages/dashboard.html":
      return "Trang chủ";
    case "/pages/users.html":
      return "Người dùng";
    case "/pages/devices.html":
      return "Thiết bị";
    case "/pages/projects.html":
      return "Dự án";
    case "/pages/profile.html":
      return "Hồ sơ";
    case "/pages/loans.html":
      return "Mượn trả thiết bị";
    default:
      return "Trang chủ";
  }
}

function setHeaderTitle() {
  const headerTitle = document.querySelector(".header-title");
  if (headerTitle) {
    headerTitle.textContent = getPageTitle();
  }
}

function handleLogout() {
  localStorage.removeItem("access_token");
  window.location.href = "/pages/signin.html";
}

function loadLayout() {
  axios
    .get("/partials/header.html")
    .then((response) => {
      document.getElementById("header-container").innerHTML = response.data;
      setHeaderTitle();
    })
    .catch((error) => console.error("Lỗi khi load header:", error));

  axios
    .get("/partials/sidebar.html")
    .then((response) => {
      document.getElementById("sidebar-container").innerHTML = response.data;
      setActiveMenuItem();
      initializeSidebarEvents();
      initializeSidebarToggle();
    })
    .catch((error) => console.error("Lỗi khi load sidebar:", error));

  axios
    .get("/partials/footer.html")
    .then((response) => {
      document.getElementById("footer-container").innerHTML = response.data;
    })
    .catch((error) => console.error("Lỗi khi load footer:", error));
}

document.addEventListener("DOMContentLoaded", loadLayout);
const API_BASE_URL = "http://localhost:3000/api/";
