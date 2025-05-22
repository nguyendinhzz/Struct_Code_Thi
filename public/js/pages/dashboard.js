const loadDashboardData = async () => {
  try {
    // Lấy thống kê từ API
    const deviceStatistics = await getDeviceStatistics();
    const userStatistics = await getUserStatistics();
    const loanStatistics = await getLoanStatistics();

    // Cập nhật số liệu
    document.getElementById("totalDevices").textContent =
      deviceStatistics.totalDevices;
    document.getElementById("availableDevices").textContent =
      deviceStatistics.availableDevices;
    document.getElementById("borrowedDevices").textContent =
      deviceStatistics.borrowedDevices;

    document.getElementById("totalUsers").textContent =
      userStatistics.totalUsers;
    document.getElementById("borrowingUsers").textContent =
      userStatistics.borrowingUsers;

    document.getElementById("totalLoans").textContent =
      loanStatistics.totalLoans;
    document.getElementById("unreturnedLoans").textContent =
      loanStatistics.unreturnedLoans;
    document.getElementById("returnedLoans").textContent =
      loanStatistics.returnedLoans;

    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue("--color-primary").trim();
    const primaryDarkColor = style
      .getPropertyValue("--color-primary-dark")
      .trim();
    const successColor = style.getPropertyValue("--color-success").trim();
    const borderColor = style.getPropertyValue("--color-border").trim();
    const textColor = style.getPropertyValue("--color-text").trim();

    const loansCtx = document.getElementById("loansChart").getContext("2d");
    new Chart(loansCtx, {
      type: "bar",
      data: {
        labels: loanStatistics.chartData.labels,
        datasets: [
          {
            label: "Lượt mượn",
            data: loanStatistics.chartData.borrowCounts,
            backgroundColor: primaryColor,
            borderColor: primaryDarkColor,
            borderWidth: 1,
          },
          {
            label: "Lượt trả",
            data: loanStatistics.chartData.returnCounts,
            backgroundColor: successColor,
            borderColor: successColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              color: textColor,
            },
            grid: {
              color: borderColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: borderColor,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: textColor,
            },
          },
        },
      },
    });

    // Vẽ biểu đồ top thiết bị
    const devicesCtx = document
      .getElementById("topDevicesChart")
      .getContext("2d");
    new Chart(devicesCtx, {
      type: "bar",
      data: {
        labels: deviceStatistics.topDevices.map((d) => d.name),
        datasets: [
          {
            label: "Số lần mượn",
            data: deviceStatistics.topDevices.map((d) => d.count),
            backgroundColor: primaryColor,
            borderColor: primaryDarkColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              color: textColor,
            },
            grid: {
              color: borderColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: borderColor,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: textColor,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

document.addEventListener("DOMContentLoaded", loadDashboardData);
