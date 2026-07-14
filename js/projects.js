const addProjectBtn = document.getElementById("addProject");
const addProjectModal = document.getElementById("addProjectModal");
const closeProjectModal = document.getElementById("closeProjectModal");
const companyNameSelect = document.getElementById("companyName");
const teamMembersSelect = document.getElementById("teamMembers");
const renderProjectsTable = document.getElementById("renderProjects");
const clearBtn = document.getElementById("clearBtn");
const searchProject = document.getElementById("searchProject");
const selectedStatus = document.getElementById("selectedStatus");
const selectedTeamMembers = document.getElementById("selectedTeamMembers");
const selectedPriority = document.getElementById("selectedPriority");
const selectedClient = document.getElementById("selectedClient");
const toastContainer = document.getElementById("toastContainer");
const confirmModal = document.getElementById("confirmModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const editProjectModal = document.getElementById("editProjectModal");
const closeEditProjectModal = document.getElementById("closeEditProjectModal");
const createClient = document.getElementById("createClient");
//
//
//
//
//
let clients = [];
let projects = [];
let teamMembers = [];
let projectIdToDelete = null;
let editedProjectId = null;
//
//
//
//
//
// Fetch clients and populate the company name dropdown
function fetchClients() {
  api("clients")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch clients.");
      }
      return response.json();
    })

    .then((data) => {
      companyNameSelect.innerHTML =
        '<option value="Select a Company">Select a Company...</option>';

      data.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.innerHTML = client.companyName;
        companyNameSelect.appendChild(option);
      });
    });
}

// Fetch team members and populate the team members dropdown
function fetchTeam() {
  api("teamMembers")
    .then((response) => response.json())
    .then((data) => {
      teamMembersSelect.innerHTML =
        '<option value="Select a Team Member">Select a Team Member...</option>';

      data.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.fullName;
        option.innerHTML = `${member.fullName} / ${member.department}`;
        teamMembersSelect.appendChild(option);
      });
    });
}

// Helper functions to get CSS classes based on status and priority
function getStatusClass(status) {
  if (status === "Planning") return "planning";
  if (status === "In Progress") return "inProgress";
  if (status === "Review") return "review";
  if (status === "Blocked") return "blocked";
  return "completed";
}

// Helper function to get CSS class based on priority
function getPriorityClass(priority) {
  if (priority === "High") return "high";
  if (priority === "Medium") return "medium";
  return "low";
}

// Create a new project
function createProject(clients, projects, teamMembers) {
  const clientOptions = clients.map((client) => ({
    id: client.id,
    name: client.companyName,
  }));
  const teamMemberOptions = teamMembers.map((member) => ({
    name: member.fullName,
    department: member.department,
    avatar: member.avatar,
    email: member.email,
  }));
  const projectForm = document.getElementById("projectForm");

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createClient.disabled = true;
    const projectData = {
      clientId: companyNameSelect.value,
      projectName: document.getElementById("projectName").value,
      clientName: clientOptions.find(
        (client) => client.id === companyNameSelect.value,
      )?.name,
      teamMembers: teamMembersSelect.value,
      email: teamMemberOptions.find(
        (member) => member.name === teamMembersSelect.value,
      )?.email,
      avatar: teamMemberOptions.find(
        (member) => member.name === teamMembersSelect.value,
      )?.avatar,
      status: document.querySelector('input[name="status"]:checked').value,
      priority: document.querySelector('input[name="priority"]:checked').value,
      dueDate: document.getElementById("dueDate").value,
      budget: parseFloat(document.getElementById("budget").value).toFixed(2),
    };
    api("projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add project.");
          createClient.disabled = false;
          showToast("An error occurred while adding the project.", "error");
        }

        return response.json();
      })
      .then((createdProject) => {
        projects.push(createdProject);
        projectForm.reset();
        createClient.disabled = false;
        addProjectModal.classList.remove("addClient-modal");
        renderInfo(clients, projects, teamMembers);
        showToast("Project added successfully.", "success");
      })
      .catch((error) => {
        console.log("Error:", error);
        createClient.disabled = false;
        showToast("An error occurred while adding the project.", "error");
      });
  });
}

// Render projects in the table
function fetchProjects(projects) {
  renderProjectsTable.innerHTML = "";

  const thred = document.createElement("thead");
  thred.innerHTML = `<tr>
                                      <th>Project Name</th>
                                      <th>Client</th>
                                      <th>Team Member</th>
                                      <th>Email</th>
                                      <th>Status</th>
                                      <th>Priority</th>
                                      <th>Due Date</th>
                                      <th>Budget</th>
                                      <th>Role</th>
                                      <th>Delete</th>
                                      </tr>`;
  renderProjectsTable.appendChild(thred);
  const tbody = document.createElement("tbody");

  if (projects.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 10;
    renderEmptyState(cell, "No projects found.");
    row.appendChild(cell);
    tbody.appendChild(row);
  }

  projects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><a class="table-link" href="#">${project.projectName}</a></td>
                                      <td>${project.clientName}</td>
                                      <td><div class="avatar-container"><img src="${project.avatar}" alt="Avatar" class="avatar avatar--small">${project.teamMembers}</div></td>
                                      <td>${project.email}</td>
                                      <td><select class="status-select dropdown badge badge--${getStatusClass(project.status)}" data-project-id="${project.id}">
                                        <option class="badge badge--planning" value="Planning" ${project.status === "Planning" ? "selected" : ""}>Planning</option>
                                        <option class="badge badge--inProgress" value="In Progress" ${project.status === "In Progress" ? "selected" : ""}>In Progress</option>
                                        <option class="badge badge--review" value="Review" ${project.status === "Review" ? "selected" : ""}>Review</option>
                                        <option class="badge badge--blocked" value="Blocked" ${project.status === "Blocked" ? "selected" : ""}>Blocked</option>
                                        <option class="badge badge--completed" value="Completed" ${project.status === "Completed" ? "selected" : ""}>Completed</option>
                                      </select></td>
                                      <td><select class="priority-select dropdown badge badge--${getPriorityClass(project.priority)}"  data-project-id="${project.id}">
                                        <option class="badge badge--high " value="High" ${project.priority === "High" ? "selected" : ""}>High</option>
                                        <option class="badge badge--medium " value="Medium" ${project.priority === "Medium" ? "selected" : ""}>Medium</option>
                                        <option class="badge badge--low " value="Low" ${project.priority === "Low" ? "selected" : ""}>Low</option>
                                      </select></td>
                                      <td><input class="duedate-select badge" type="date" value="${project.dueDate}" data-project-id="${project.id}"></td>
                                      <td>
                                        <div class=" budget-input">
                                        <span class="currency">€</span>
                                        <input class="budget-select" type="number" value="${project.budget}" data-project-id="${project.id}"/>
                                      </div></td>
                                      <td>${project.role}</td>
                                      <td> <button class="icon-btn"  onclick="editProject('${project.id}')">✏️</button>
                                          <button type="button" class="icon-btn" onclick="deleteProject('${project.id}')">🗑️</button></td>
                                    `;
    tbody.appendChild(row);
  });
  renderProjectsTable.appendChild(tbody);
}

// Delete a project
function deleteProject(projectId) {
  projectIdToDelete = projectId;
  confirmModal.classList.remove("hidden");
  confirmModal.classList.add("confirm-modal");
}

// Update project status
function updateProjectStatus(projectId, status, selectElement) {
  api(`projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update status.");
      }
      return response.json();
    })
    .then((updateProject) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.status = updateProject.status;
      }
      showToast("Project Status updated.", "success");
      applyFilters();
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast("Could not update project status. Please try again.", "error");
      selectElement.value =
        selectElement.dataset.previousValue || selectElement.value;
    });
}

// Update project priority
function updateProjectPriority(projectId, priority, selectElement) {
  api(`projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priority }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update priority.");
      }
      return response.json();
    })
    .then((updateProject) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.priority = updateProject.priority;
      }
      showToast("Project Priority updated.", "success");
      applyFilters();
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast(
        "Could not update project priority. Please try again.",
        "error",
      );
      selectElement.value =
        selectElement.dataset.previousValue || selectElement.value;
    });
}

//Update project due date
function updateProjectDueDate(projectId, dueDate, selectElement) {
  api(`projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dueDate }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update dueDate.");
      }
      return response.json();
    })
    .then((updateProject) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.dueDate = updateProject.dueDate;
      }
      showToast("Project Due Date updated.", "success");
      applyFilters();
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast("Could not update client dueDate. Please try again.", "error");
      selectElement.value =
        selectElement.dataset.previousValue || selectElement.value;
    });
}

//Update project budget
function updateProjectBudget(projectId, budget, selectElement) {
  api(`projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ budget }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update dueDate.");
      }
      return response.json();
    })
    .then((updateProject) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.budget = updateProject.budget;
      }
      showToast("Project Budget updated.", "success");
      applyFilters();
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast("Could not update Budget. Please try again.", "error");

      selectElement.value =
        selectElement.dataset.previousValue || selectElement.value;
    });
}

// Combine data from clients, projects, and team members to render the project info
function renderInfo(clients, projects, teamMembers) {
  const renderedInfo = projects.map((project) => {
    const client = clients.find((c) => c.id === project.clientId);
    const member = teamMembers.find((m) => m.fullName === project.teamMembers);
    const avatar = teamMembers.find((m) => m.fullName === project.teamMembers);

    const role = teamMembers.find((m) => m.fullName === project.teamMembers);
    return {
      ...project,
      clientName: client ? client.companyName : "Unknown",
      email: member ? member.email : "Unknown",
      avatar: avatar ? avatar.avatar : "Unknown",
      role: role ? role.department : "Unknown",
    };
  });

  fetchProjects(renderedInfo);
}

// Get filtered projects based on search and filter criteria
function getFilteredProjects(projects) {
  let filteredProjects = [...projects];

  const searchValue = searchProject.value.toLowerCase().trim();
  const selectedStatusValue = selectedStatus.value;
  const selectedTeamMembersValue = selectedTeamMembers.value;
  const selectedPriorityValue = selectedPriority.value;
  const selectedClientValue = selectedClient.value;

  if (selectedStatusValue !== "All Statuses") {
    filteredProjects = filteredProjects.filter(
      (project) => project.status === selectedStatusValue,
    );
  }
  if (selectedTeamMembersValue !== "All Team Members") {
    filteredProjects = filteredProjects.filter(
      (project) => project.teamMembers === selectedTeamMembersValue,
    );
  }

  if (selectedPriorityValue !== "All Priorities") {
    filteredProjects = filteredProjects.filter(
      (project) => project.priority === selectedPriorityValue,
    );
  }

  if (selectedClientValue !== "All Clients") {
    filteredProjects = filteredProjects.filter(
      (project) => project.clientName === selectedClientValue,
    );
  }

  if (searchValue) {
    filteredProjects = filteredProjects.filter(
      (project) =>
        project.projectName.toLowerCase().includes(searchValue) ||
        project.clientName.toLowerCase().includes(searchValue) ||
        project.teamMembers.toLowerCase().includes(searchValue) ||
        project.email.toLowerCase().includes(searchValue) ||
        project.status.toLowerCase().includes(searchValue) ||
        project.priority.toLowerCase().includes(searchValue) ||
        project.budget.toLowerCase().includes(searchValue),
    );
  }
  return filteredProjects;
}

// Render team members in the filter dropdown
function renderTeamMembersOptions(teamMembers) {
  selectedTeamMembers.innerHTML = `<option value="All Team Members">All Team Members</option>
                  `;

  teamMembers.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.fullName;
    option.innerHTML = `${member.fullName} / ${member.department}`;
    selectedTeamMembers.appendChild(option);
  });
}

// Render Clients in the filter dropdown
function renderClientOptions(clients) {
  selectedClient.innerHTML = `<option value="All Clients">All Clients</option>
                  `;

  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.companyName;
    option.innerHTML = client.companyName;
    selectedClient.appendChild(option);
  });
}

// Apply filters and render the filtered projects
function applyFilters() {
  const filteredProjects = getFilteredProjects(projects);
  renderInfo(clients, filteredProjects, teamMembers);
}

// Show toast notifications for success or error messages
function showToast(msg, type) {
  const toastType = document.createElement("div");
  toastType.classList.add(`toast`, `toast--${type}`, `toast--show`);
  toastType.innerHTML = `<div class="toast__title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                                        <div class="toast__message">${msg}</div>`;

  toastContainer.appendChild(toastType);
  setTimeout(() => {
    toastType.classList.remove("toast--show");
    toastType.classList.add("toast--hide");
  }, 2000);
  setTimeout(() => toastType.remove(), 2500);
}

// Edit project
function editProject(projectId) {
  editProjectModal.classList.add("addClient-modal");
  editedProjectId = projectId;

  api("clients")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("editCompanyName").innerHTML =
        '<option value="Select a Company">Select a Company...</option>';

      data.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.innerHTML = client.companyName;
        document.getElementById("editCompanyName").appendChild(option);
      });
    });

  api("teamMembers")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("editTeamMembers").innerHTML =
        '<option value="Select a Team Member">Select a Team Member...</option>';

      data.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.fullName;
        option.innerHTML = `${member.fullName} / ${member.department}`;
        document.getElementById("editTeamMembers").appendChild(option);
      });
    });

  api(`projects/${projectId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch projects.");
      }
      return response.json();
    })
    .then((project) => {
      document.getElementById("editProjectName").value = project.projectName;
      document.getElementById("editCompanyName").value = project.clientId;
      document.getElementById("editTeamMembers").value = project.teamMembers;
      document.querySelector(
        `input[name="editStatus"][value="${project.status}"]`,
      ).checked = true;
      document.querySelector(
        `input[name="editPriority"][value="${project.priority}"]`,
      ).checked = true;

      document.getElementById("editDueDate").value = project.dueDate;

      document.getElementById("editBudget").value = project.budget;
    });
}

// Submit edited project data
function submitEditedProjects(projects) {
  const clientOptions = clients.map((client) => ({
    id: client.id,
    name: client.companyName,
  }));
  const teamMemberOptions = teamMembers.map((member) => ({
    name: member.fullName,
    department: member.department,
    avatar: member.avatar,
    email: member.email,
  }));

  const editForm = document.getElementById("editProjectForm");

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedClientId = document.getElementById("editCompanyName").value;
    const selectedClient = clientOptions.find(
      (client) => client.id === selectedClientId,
    );

    const editedProjectData = {
      clientId: selectedClientId,
      projectName: document.getElementById("editProjectName").value,
      clientName: selectedClient?.name,
      teamMembers: document.getElementById("editTeamMembers").value,
      email: teamMemberOptions.find(
        (m) => m.name === document.getElementById("editTeamMembers").value,
      )?.email,
      avatar: teamMemberOptions.find(
        (m) => m.name === document.getElementById("editTeamMembers").value,
      )?.avatar,
      status: document.querySelector('input[name="editStatus"]:checked').value,
      priority: document.querySelector('input[name="editPriority"]:checked')
        .value,
      dueDate: document.getElementById("editDueDate").value,
      budget: parseFloat(document.getElementById("editBudget").value).toFixed(
        2,
      ),
    };

    api(`projects/${editedProjectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProjectData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update project.");
        }
        return response.json();
      })
      .then((editedProjectData) => {
        const project = projects.find((p) => p.id === editedProjectId);
        if (project) {
          Object.assign(project, editedProjectData);
        }
        editProjectModal.classList.remove("addClient-modal");
        renderInfo(clients, projects, teamMembers);
        showToast("Project updated successfully.", "success");
      })
      .catch((error) => {
        console.log("Error:", error);
        showToast("An error occurred while updating the project.", "error");
      });
  });
}
// Initial setup

// Open the modal when clicking the "Add Project" button
addProjectBtn.addEventListener("click", () => {
  addProjectModal.classList.add("addClient-modal");
});
// Close the modal when clicking the cancel button
closeProjectModal.addEventListener("click", () => {
  addProjectModal.classList.remove("addClient-modal");
});

//Close modal when clicking the close button
cancelDelete.addEventListener("click", () => {
  projectIdToDelete = null;

  confirmModal.classList.add("hidden");
  confirmModal.classList.remove("confirm-modal");
});

// Confirm deletion of a project
confirmDelete.addEventListener("click", () => {
  if (!projectIdToDelete) return;

  api(`projects/${projectIdToDelete}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete project.");
      }

      projects = projects.filter((project) => project.id !== projectIdToDelete);

      renderInfo(clients, projects, teamMembers);

      showToast("Project deleted successfully.", "success");
    })
    .catch((error) => {
      console.error("Error deleting project:", error);
      showToast("Error deleting project.", "error");
    })
    .finally(() => {
      projectIdToDelete = null;

      confirmModal.classList.add("hidden");
      confirmModal.classList.remove("confirm-modal");
    });
});

//Close edit project modal when clicking the close button
closeEditProjectModal.addEventListener("click", () => {
  editProjectModal.classList.remove("addClient-modal");
});

showPageError(
  "An error occurred while fetching Projects. Please try again later.",
);

// Fetch clients and projects data in parallel and initialize the app
Promise.all([api("clients"), api("projects"), api("teamMembers")])
  .then(([clientsData, projectsData, teamMembersData]) => {
    return Promise.all([
      clientsData.json(),
      projectsData.json(),
      teamMembersData.json(),
    ]);
  })
  .then(([clientsData, projectsData, teamMembersData]) => {
    clients = clientsData;
    projects = projectsData;
    teamMembers = teamMembersData;

    hidePageError();

    fetchClients(clients);

    fetchTeam(teamMembers);

    createProject(clients, projects, teamMembers);

    renderInfo(clients, projects, teamMembers);

    renderTeamMembersOptions(teamMembers);

    renderClientOptions(clients);

    submitEditedProjects(projects);

    clearBtn.addEventListener("click", () => {
      searchProject.value = "";
      selectedStatus.value = "All Statuses";
      selectedTeamMembers.value = "All Team Members";
      selectedPriority.value = "All Priorities";
      selectedClient.value = "All Clients";
      renderInfo(clients, projects, teamMembers);
    });

    selectedStatus.addEventListener("change", applyFilters);

    selectedTeamMembers.addEventListener("change", applyFilters);

    selectedPriority.addEventListener("change", applyFilters);

    selectedClient.addEventListener("change", applyFilters);

    searchProject.addEventListener("input", applyFilters);

    renderProjectsTable.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-select")) {
        const projectId = e.target.dataset.projectId;
        const status = e.target.value;
        updateProjectStatus(projectId, status, e.target);
      }
    });

    renderProjectsTable.addEventListener("change", (e) => {
      if (e.target.classList.contains("priority-select")) {
        const projectId = e.target.dataset.projectId;
        const priority = e.target.value;
        updateProjectPriority(projectId, priority, e.target);
      }
    });

    renderProjectsTable.addEventListener("change", (e) => {
      if (e.target.classList.contains("duedate-select")) {
        const projectId = e.target.dataset.projectId;
        const duedate = e.target.value;
        updateProjectDueDate(projectId, duedate, e.target);
      }
    });

    renderProjectsTable.addEventListener("change", (e) => {
      if (e.target.classList.contains("budget-select")) {
        const projectId = e.target.dataset.projectId;
        const budget = parseFloat(e.target.value).toFixed(2);
        updateProjectBudget(projectId, budget, e.target);
      }
    });
  })
  .catch(() =>
    showPageError(
      "An error occurred while fetching Projects. Please try again later.",
    ),
  );
