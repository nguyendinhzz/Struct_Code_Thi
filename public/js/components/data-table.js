class DataTable {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.config = {
      title: "",
      columns: [],
      data: [],
      actions: [],
      onRowClick: null,
      ...config,
    };
    this.render();
  }

  render() {
    // Tạo section container
    const section = document.createElement("section");
    section.className = "data-section";

    // Tạo header
    const header = document.createElement("div");
    header.className = "data-section-header";

    // Tạo tiêu đề
    const title = document.createElement("h3");
    title.className = "data-section-title";
    title.textContent = this.config.title;
    header.appendChild(title);

    // Tạo nút thêm mới
    if (this.config.addButton) {
      const addButton = document.createElement("button");
      addButton.className = "data-section-add-btn";
      addButton.textContent = this.config.addButton.text;
      addButton.onclick = this.config.addButton.onClick;
      header.appendChild(addButton);
    }

    section.appendChild(header);

    // Tạo table element
    const table = document.createElement("table");
    table.className = "data-table";

    // Render header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    this.config.columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column.title;
      if (column.width) th.style.width = column.width;
      headerRow.appendChild(th);
    });

    // Thêm cột actions nếu có
    if (this.config.actions.length > 0) {
      const th = document.createElement("th");
      th.textContent = "Thao tác";
      headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Render body
    const tbody = document.createElement("tbody");
    this.config.data.forEach((row) => {
      const tr = document.createElement("tr");

      // Thêm sự kiện click cho dòng
      if (this.config.onRowClick) {
        tr.style.cursor = "pointer";
        tr.onclick = (e) => {
          if (!e.target.closest(".action-btn")) {
            this.config.onRowClick(row);
          }
        };
      }

      // Render các cột dữ liệu
      this.config.columns.forEach((column) => {
        const td = document.createElement("td");
        if (column.render) {
          td.innerHTML = column.render(row[column.field], row);
        } else {
          td.textContent = row[column.field] || "";
        }
        tr.appendChild(td);
      });

      // Render cột actions
      if (this.config.actions.length > 0) {
        const td = document.createElement("td");
        td.className = "actions";

        this.config.actions.forEach((action) => {
          if (!action.showIf || action.showIf(row)) {
            const button = document.createElement("button");
            button.className = `action-btn ${action.class || ""}`;
            button.textContent = action.label;
            if (!action.disabled) {
              button.onclick = () => action.onClick(row);
            } else {
              button.disabled = true;
            }
            td.appendChild(button);
          }
        });

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    // section.appendChild(table);

    // Tạo wrapper cho table
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "data-table-wrapper";
    tableWrapper.appendChild(table);

    section.appendChild(tableWrapper);

    // Clear và append section mới
    this.container.innerHTML = "";
    this.container.appendChild(section);
  }

  // Method để cập nhật dữ liệu
  updateData(newData) {
    this.config.data = newData;
    this.render();
  }
}
