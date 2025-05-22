function setActiveMenuItem() {
  const currentPath = window.location.pathname;

  const menuItems = document.querySelectorAll("ul.nav-links li");
  menuItems.forEach((item) => item.classList.remove("active"));

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link && link.getAttribute("href") === currentPath) {
      item.classList.add("active");
    }
  });
}

function initializeSidebarEvents() {
  document.querySelectorAll("ul.nav-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
      document.querySelectorAll("ul.nav-links li").forEach((item) => {
        item.classList.remove("active");
      });
      this.closest("li").classList.add("active");
    });
  });
}

function initializeSidebarToggle() {
  const toggleButton = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.querySelector(".main-content");

  let isSidebarCollapsed = true;

  if (localStorage.getItem("sidebarCollapsed") !== null) {
    isSidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  }

  if (isSidebarCollapsed) {
    sidebar.classList.add("collapsed");
    if (mainContent) {
      mainContent.classList.add("sidebar-collapsed");
    }
  }

  if (toggleButton && sidebar) {
    toggleButton.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      if (mainContent) {
        mainContent.classList.toggle("sidebar-collapsed");
      }
      localStorage.setItem(
        "sidebarCollapsed",
        sidebar.classList.contains("collapsed")
      );
    });
  }
}

window.setActiveMenuItem = setActiveMenuItem;
window.initializeSidebarEvents = initializeSidebarEvents;
window.initializeSidebarToggle = initializeSidebarToggle;
