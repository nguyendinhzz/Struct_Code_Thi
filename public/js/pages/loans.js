const modal = new Modal();

// Template xác nhận trả thiết bị
const returnConfirmTemplate = (loan) => `
  <div class="confirm-dialog">
    <p class="confirm-message">Bạn có chắc chắn muốn trả thiết bị "${loan.device.name}" không?</p>
    <p class="confirm-warning">Hành động này không thể hoàn tác!</p>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="button" class="btn btn-danger" id="confirmReturn">Trả</button>
    </div>
  </div>
`;

const returnDevice = async (row) => {
  try {
    modal.show("Trả thiết bị", returnConfirmTemplate(row));
    const confirmButton = document.getElementById("confirmReturn");
    confirmButton.onclick = async () => {
      try {
        await returnDeviceByUserId(row.user.id, [row.device.id]);
        modal.hide();
        loadLoans();
      } catch (error) {
        console.error("Error returning device:", error);
      }
    };
  } catch (error) {
    console.error("Error showing return confirmation:", error);
  }
};

const loansTable = new DataTable("loans-container", {
  title: "Quản lý mượn trả thiết bị",
  columns: [
    {
      field: "user",
      title: "Tên",
      render: (value) => {
        return value.firstName + " " + value.lastName;
      },
    },
    {
      field: "user",
      title: "Số điện thoại",
      render: (value) => {
        return value.phone;
      },
    },
    {
      field: "device",
      title: "Tên thiết bị",
      render: (value) => {
        return value.name;
      },
    },
    {
      field: "dateReceived",
      title: "Ngày mượn",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
  ],
  actions: [
    {
      label: "Trả",
      class: "return",
      onClick: (row) => returnDevice(row),
      showIf: (row) => row.dateReturned === null,
    },
    {
      label: "Đã trả",
      class: "returned",
      showIf: (row) => row.dateReturned !== null,
      disabled: true,
    },
  ],
  onRowClick: async (row) => {
    try {
      const loanDetail = row;

      document.querySelector(".modal-container").classList.add("detail-modal");
      document.querySelector(".modal-content").classList.add("detail-content");

      const content = `
        <div class="detail-info">
          <p><strong>Họ và tên:</strong>
            ${loanDetail.user.firstName} ${loanDetail.user.lastName}
          </p>
          <p><strong>Email:</strong> ${loanDetail.user.email}</p>
          <p><strong>Số điện thoại:</strong> ${loanDetail.user.phone}</p>
          <p><strong>Tên thiết bị:</strong> ${loanDetail.device.name}</p>
          <p><strong>Mã thiết bị:</strong> ${loanDetail.device.code}</p>
          <p><strong>Ngày mượn:</strong> ${new Date(
            loanDetail.dateReceived
          ).toLocaleDateString("vi-VN")}</p>
          <p><strong>Ngày trả:</strong> ${
            loanDetail.dateReturned
              ? new Date(loanDetail.dateReturned).toLocaleDateString("vi-VN")
              : '<span class="text-warning">Chưa trả</span>'
          }</p>
        </div>
      `;

      modal.show("Chi tiết thông tin", content);
    } catch (error) {
      console.error("Error loading loan details:", error);
    }
  },
});

async function loadLoans() {
  const loans = await getLoans();
  loansTable.updateData(loans);
}

document.addEventListener("DOMContentLoaded", loadLoans);
