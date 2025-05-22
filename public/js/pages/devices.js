const modal = new Modal();

// Form template cho tạo thiết bị
const deviceFormTemplate = `
  <form id="deviceForm">
    <div class="form-group">
      <label for="name">Tên thiết bị</label>
      <input type="text" id="name" name="name" placeholder="Nhập tên thiết bị" required>
    </div>
    <div class="form-group">
      <label for="code">Mã thiết bị</label>
      <input type="text" id="code" name="code" placeholder="Nhập mã thiết bị" required>
    </div>
    <div class="form-group">
      <label for="cost">Giá</label>
      <input type="number" id="cost" name="cost" placeholder="Nhập giá thiết bị" required>
    </div>
    <div class="form-group">
      <label for="description">Mô tả</label>
      <input id="description" name="description" placeholder="Nhập mô tả">
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </div>
  </form>
`;

// Template form chỉnh sửa thiết bị
const editDeviceFormTemplate = (device) => `
  <form id="editDeviceForm">
    <div class="form-group">
      <label for="name">Tên thiết bị</label>
      <input type="text" id="name" name="name" value="${device.name}" required>
    </div>
    <div class="form-group">
      <label for="code">Mã thiết bị</label>
      <input type="text" id="code" name="code" value="${device.code}" required>
    </div>
    <div class="form-group">
      <label for="cost">Giá</label>
      <input type="number" id="cost" name="cost" value="${device.cost}" required>
    </div>
    <div class="form-group">
      <label for="description">Mô tả</label>
      <textarea id="description" name="description" required>${device.description}</textarea>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </div>
  </form>
`;

// Template xác nhận xóa thiết bị
const deleteConfirmTemplate = (device) => `
  <div class="confirm-dialog">
    <p class="confirm-message">Bạn có chắc chắn muốn xóa thiết bị "${device.name}" không?</p>
    <p class="confirm-warning">Hành động này không thể hoàn tác!</p>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="button" class="btn btn-danger" id="confirmDelete">Xóa</button>
    </div>
  </div>
`;

// Template form mượn thiết bị
const borrowDeviceFormTemplate = (device) => `
  <form id="borrowDeviceForm">
    <div class="form-group">
      <label for="name">Tên thiết bị</label>
      <input type="text" id="name" name="name" value="${device.name}" readonly>
    </div>
    <div class="form-group">
      <label for="code">Mã thiết bị</label>
      <input type="text" id="code" name="code" value="${device.code}" readonly>
    </div>
    <div class="form-group">
      <label for="cost">Giá</label>
      <input type="number" id="cost" name="cost" value="${device.cost}" readonly>
    </div>
    <div class="form-group">
      <label for="description">Mô tả</label>
      <textarea id="description" name="description" readonly>${device.description}</textarea>
    </div>
    <div class="form-group">
      <label for="userName">Tên người mượn</label>
      <input type="text" id="userName" name="userName" list="userList" required>
      <datalist id="userList"></datalist>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Xác nhận mượn</button>
    </div>
  </form>
`;

// Hàm xử lý chỉnh sửa thiết bị
async function editDevice(row) {
  try {
    const deviceId = row.id;
    const device = await getDeviceById(deviceId);

    modal.show("Chỉnh sửa thiết bị", editDeviceFormTemplate(device));

    const form = document.getElementById("editDeviceForm");
    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value,
        code: form.code.value,
        cost: Number(form.cost.value),
        description: form.description.value,
      };

      try {
        await updateDevice(deviceId, formData);
        modal.hide();
        loadDevices();
      } catch (error) {
        console.error("Error updating device:", error);
      }
    };
  } catch (error) {
    console.error("Error loading device details:", error);
  }
}

// Hàm xử lý xóa thiết bị
async function deleteDevice(row) {
  try {
    const deviceId = row.id;

    modal.show("Xác nhận xóa", deleteConfirmTemplate(row));

    const confirmButton = document.getElementById("confirmDelete");
    confirmButton.onclick = async () => {
      try {
        await deleteDeviceById(deviceId);
        modal.hide();
        loadDevices();
      } catch (error) {
        console.error("Error deleting device:", error);
      }
    };
  } catch (error) {
    console.error("Error in delete device:", error);
  }
}

const borrowDevice = async (row) => {
  try {
    const deviceId = row.id;
    const device = await getDeviceById(deviceId);
    modal.show("Mượn thiết bị", borrowDeviceFormTemplate(device));
    const users = await getUsers();
    const userList = document.getElementById("userList");
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = `${user.firstName} ${user.lastName}`;
      option.dataset.userId = user.id;
      userList.appendChild(option);
    });

    const form = document.getElementById("borrowDeviceForm");
    form.onsubmit = async (e) => {
      e.preventDefault();
      const userName = form.userName.value;
      const selectedUser = users.find(
        (user) => `${user.firstName} ${user.lastName}` === userName
      );

      if (!selectedUser) {
        alert("Vui lòng chọn người dùng hợp lệ từ danh sách");
        return;
      }

      try {
        await borrowDeviceByUserId(selectedUser.id, [deviceId]);
        modal.hide();
        loadDevices();
      } catch (error) {
        console.error("Error borrowing device:", error);
      }
    };
  } catch (error) {
    console.error("Error borrowing device:", error);
  }
};

// Bảng dữ liệu
const devicesTable = new DataTable("devices-container", {
  title: "Quản lý thiết bị",
  addButton: {
    text: "Thêm thiết bị",
    onClick: () => {
      modal.show("Thêm thiết bị mới", deviceFormTemplate);

      const form = document.getElementById("deviceForm");
      form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = {
          name: form.name.value,
          code: form.code.value,
          cost: Number(form.cost.value),
          description: form.description.value,
        };

        try {
          await createDevice(formData);
          modal.hide();
          loadDevices();
        } catch (error) {
          console.error("Error creating device:", error);
        }
      };
    },
  },
  columns: [
    { field: "name", title: "Tên thiết bị" },
    { field: "code", title: "Mã thiết bị" },
    { field: "cost", title: "Giá" },
    { field: "statusName", title: "Trạng thái" },
  ],
  actions: [
    {
      label: "Mượn",
      class: "borrow",
      onClick: (row) => borrowDevice(row),
      showIf: (row) => (row.statusName === "Available") | "Có sẵn",
    },
    { label: "Sửa", class: "edit", onClick: (row) => editDevice(row) },
    { label: "Xóa", class: "delete", onClick: (row) => deleteDevice(row) },
  ],
  onRowClick: async (row) => {
    try {
      const deviceDetail = await getDeviceById(row.id);

      document.querySelector(".modal-container").classList.add("detail-modal");
      document.querySelector(".modal-content").classList.add("detail-content");

      const content = `
        <div class="detail-info">
          <p><strong>Tên thiết bị:</strong> ${deviceDetail.name}</p>
          <p><strong>Mã thiết bị:</strong> ${deviceDetail.code}</p>
          <p><strong>Giá:</strong> ${deviceDetail.cost}</p>
          <p><strong>Mô tả:</strong> ${
            deviceDetail.description
              ? deviceDetail.description
              : "Không có mô tả"
          }</p>
          <p><strong>Trạng thái:</strong> ${deviceDetail.statusName}</p>
        </div>
      `;

      modal.show("Chi tiết thông tin", content);
    } catch (error) {
      console.error("Error loading device details:", error);
    }
  },
});

// Load dữ liệu
async function loadDevices() {
  try {
    const devices = await getDevices();
    devicesTable.updateData(devices);
  } catch (error) {
    console.error("Error loading devices:", error);
  }
}

// Khởi tạo khi trang load
document.addEventListener("DOMContentLoaded", loadDevices);
