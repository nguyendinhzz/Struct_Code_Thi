const modal = new Modal();

const userFormTemplate = `
 <form id="userForm">
    <div class="form-group">
      <label for="firstName">Tên</label>
      <input type="text" id="firstName" name="firstName" placeholder="Nhập tên người dùng" required>
    </div>
    <div class="form-group">
      <label for="lastName">Họ</label>
      <input type="text" id="lastName" name="lastName" placeholder="Nhập họ người dùng" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" id="email" name="email" placeholder="Nhập email" required>
    </div>
    <div class="form-group">
      <label for="phone">Số điện thoại</label>
      <input type="text" id="phone" name="phone" placeholder="Nhập số điện thoại" required>
    </div>
    <div class="form-group">
      <label for="password">Mật khẩu</label>
      <input type="text" id="password" name="password" placeholder="Nhập mật khẩu" required>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </div>
  </form>
`;

const editUserFormTemplate = (user) => `
  <form id="editUserForm">
    <div class="form-group">
      <label for="firstName">Tên</label>
      <input type="text" id="firstName" name="firstName" value="${user.firstName}" required>
    </div>
    <div class="form-group">
      <label for="lastName">Họ</label>
      <input type="text" id="lastName" name="lastName" value="${user.lastName}" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" id="email" name="email" value="${user.email}" required>
    </div>
    <div class="form-group">
      <label for="phone">Số điện thoại</label>
      <input type="text" id="phone" name="phone" value="${user.phone}" required>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </div>
  </form>
`;

// Template xác nhận xóa dự án
const deleteConfirmTemplate = (user) => `
  <div class="confirm-dialog">
    <p class="confirm-message">Bạn có chắc chắn muốn xóa dự án "${user.firstName} ${user.lastName}" không?</p>
    <p class="confirm-warning">Hành động này không thể hoàn tác!</p>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="button" class="btn btn-danger" id="confirmDelete">Xóa</button>
    </div>
  </div>
`;

async function editUser(row) {
  try {
    // Lấy thông tin dự án cần sửa
    const userId = row.id;
    const user = await getUserById(userId);
    // Hiển thị modal với form đã điền sẵn thông tin
    modal.show("Chỉnh sửa người dùng", editUserFormTemplate(user));

    const form = document.getElementById("editUserForm");
    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
      };

      try {
        await updateUser(userId, formData);
        modal.hide();
        loadUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };
  } catch (error) {
    console.error("Error loading user details:", error);
  }
}

async function deleteUser(row) {
  try {
    const userId = row.id;

    modal.show("Xác nhận xóa", deleteConfirmTemplate(row));

    const confirmButton = document.getElementById("confirmDelete");
    confirmButton.onclick = async () => {
      try {
        await deleteUserById(userId);
        modal.hide();
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
  } catch (error) {
    console.error("Error in delete user:", error);
  }
}

const usersTable = new DataTable("users-container", {
  title: "Quản lý người dùng",
  addButton: {
    text: "Thêm người dùng",
    onClick: () => {
      modal.show("Thêm người dùng mới", userFormTemplate);

      const form = document.getElementById("userForm");
      form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          email: form.email.value,
          phone: form.phone.value,
          password: form.password.value,
        };

        try {
          await createUser(formData);
          modal.hide();
          loadUsers();
        } catch (error) {
          console.error("Error creating user:", error);
        }
      };
    },
  },
  columns: [
    {
      field: "firstName",
      title: "Tên",
    },
    {
      field: "lastName",
      title: "Họ",
    },
    {
      field: "email",
      title: "Email",
    },
    {
      field: "phone",
      title: "Số điện thoại",
    },
  ],
  actions: [
    {
      label: "Sửa",
      class: "edit",
      onClick: (row) => editUser(row),
    },
    {
      label: "Xóa",
      class: "delete",
      onClick: (row) => deleteUser(row),
    },
  ],
  onRowClick: async (row) => {
    try {
      const userDetail = await getUserById(row.id);

      document.querySelector(".modal-container").classList.add("detail-modal");
      document.querySelector(".modal-content").classList.add("detail-content");

      const content = `
        <div class="detail-info">
          <p><strong>Họ và tên:</strong> ${userDetail.firstName} ${userDetail.lastName}</p>
          <p><strong>Email:</strong> ${userDetail.email}</p>
          <p><strong>Số điện thoại:</strong> ${userDetail.phone}</p>
        </div>
      `;

      modal.show("Chi tiết thông tin", content);
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  },
});

async function loadUsers() {
  const users = await getUsers();
  usersTable.updateData(users);
}

document.addEventListener("DOMContentLoaded", loadUsers);
