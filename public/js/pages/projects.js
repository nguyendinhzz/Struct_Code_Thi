const modal = new Modal();

// Form template cho tạo dự án
const projectFormTemplate = `
  <form id="projectForm">
    <div class="form-group">
      <label for="name">Tên dự án</label>
      <input type="text" id="name" name="name" placeholder="Nhập tên dự án" required>
    </div>
    <div class="form-group">
      <label for="startDate">Ngày bắt đầu</label>
      <input type="date" id="startDate" name="startDate" required>
    </div>
    <div class="form-group">
      <label for="endDate">Ngày kết thúc</label>
      <input type="date" id="endDate" name="endDate" required>
    </div>
    <div class="form-group">
      <label for="description">Mô tả</label>
      <input id="description" name="description" placeholder="Nhập mô tả"></input>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </div>
  </form>
`;

// Template form chỉnh sửa dự án
const editProjectFormTemplate = (project) => `
  <form id="editProjectForm">
    <div class="form-group">
      <label for="name">Tên dự án</label>
      <input type="text" id="name" name="name" value="${project.name}" required>
    </div>
    <div class="form-group">
      <label for="startDate">Ngày bắt đầu</label>
      <input type="date" id="startDate" name="startDate" value="${
        project.startDate.split("T")[0]
      }" required>
    </div>
    <div class="form-group">
      <label for="endDate">Ngày kết thúc</label>
      <input type="date" id="endDate" name="endDate" value="${
        project.endDate.split("T")[0]
      }" required>
    </div>
    <div class="form-group">
      <label for="description">Mô tả</label>
      <textarea id="description" name="description" required>${
        project.description
      }</textarea>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </div>
  </form>
`;

// Template xác nhận xóa dự án
const deleteConfirmTemplate = (project) => `
  <div class="confirm-dialog">
    <p class="confirm-message">Bạn có chắc chắn muốn xóa dự án "${project.name}" không?</p>
    <p class="confirm-warning">Hành động này không thể hoàn tác!</p>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="modal.hide()">Hủy</button>
      <button type="button" class="btn btn-danger" id="confirmDelete">Xóa</button>
    </div>
  </div>
`;

// Hàm xử lý chỉnh sửa dự án
async function editProject(row) {
  try {
    // Lấy thông tin dự án cần sửa
    const projectId = row.id;
    const project = await getProjectById(projectId);
    // Hiển thị modal với form đã điền sẵn thông tin
    modal.show("Chỉnh sửa dự án", editProjectFormTemplate(project));

    const form = document.getElementById("editProjectForm");
    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value,
        startDate: form.startDate.value,
        endDate: form.endDate.value,
        description: form.description.value,
      };

      try {
        await updateProject(projectId, formData);
        modal.hide();
        loadProjects();
      } catch (error) {
        console.error("Error updating project:", error);
      }
    };
  } catch (error) {
    console.error("Error loading project details:", error);
  }
}

// Hàm xử lý xóa dự án
async function deleteProject(row) {
  try {
    const projectId = row.id;

    modal.show("Xác nhận xóa", deleteConfirmTemplate(row));

    const confirmButton = document.getElementById("confirmDelete");
    confirmButton.onclick = async () => {
      try {
        await deleteProjectById(projectId);
        modal.hide();
        loadProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    };
  } catch (error) {
    console.error("Error in delete project:", error);
  }
}

const projectsTable = new DataTable("projects-container", {
  title: "Quản lý dự án",
  addButton: {
    text: "Thêm dự án",
    onClick: () => {
      modal.show("Thêm dự án mới", projectFormTemplate);

      const form = document.getElementById("projectForm");
      form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = {
          name: form.name.value,
          startDate: form.startDate.value,
          endDate: form.endDate.value,
          description: form.description.value,
        };

        try {
          await createProject(formData);
          modal.hide();
          loadProjects();
        } catch (error) {
          console.error("Error creating project:", error);
        }
      };
    },
  },
  columns: [
    {
      field: "name",
      title: "Tên dự án",
    },
    {
      field: "startDate",
      title: "Ngày bắt đầu",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      field: "endDate",
      title: "Ngày kết thúc",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
  ],
  actions: [
    {
      label: "Sửa",
      class: "edit",
      onClick: (row) => editProject(row),
    },
    {
      label: "Xóa",
      class: "delete",
      onClick: (row) => deleteProject(row),
    },
  ],
  onRowClick: async (row) => {
    try {
      const projectDetail = await getProjectById(row.id);

      document.querySelector(".modal-container").classList.add("detail-modal");
      document.querySelector(".modal-content").classList.add("detail-content");

      const content = `
        <div class="detail-info">
          <p><strong>Tên dự án:</strong> ${projectDetail.name}</p>
          <p><strong>Ngày bắt đầu:</strong> ${new Date(
            projectDetail.startDate
          ).toLocaleDateString("vi-VN")}</p>
          <p><strong>Ngày kết thúc:</strong> ${new Date(
            projectDetail.endDate
          ).toLocaleDateString("vi-VN")}</p>
          <p><strong>Mô tả:</strong> ${
            projectDetail.description
              ? projectDetail.description
              : "Không có mô tả"
          }</p>
        </div>
      `;

      modal.show("Chi tiết thông tin", content);
    } catch (error) {
      console.error("Error loading device details:", error);
    }
  },
});

// Load dữ liệu
async function loadProjects() {
  try {
    const projects = await getProjects();
    projectsTable.updateData(projects);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

// Khởi tạo khi trang load
document.addEventListener("DOMContentLoaded", loadProjects);
