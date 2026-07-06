const tablebodyIn = document.getElementById("tablebodyIn");
const totalClients = document.getElementById("total_clients");
const pausedAccounts = document.getElementById("paused_accounts");
const activeAccounts = document.getElementById("active_accounts");
const archivedAccounts = document.getElementById("archived_accounts");
const selectedIndustry = document.getElementById("selectedIndustry");
const addClientModal = document.getElementById("addClientModal");
const addClientButton = document.getElementById("addClient");
const closeClientModalButton = document.getElementById("closeClientModal");
const selectedStatus = document.getElementById("selectedStatus");
const searchClients = document.getElementById("searchClients");
const selectedClient = document.getElementById("selectedClient");
const clearBtn = document.getElementById("clearBtn");
const sortByName = document.getElementById("sortByName");
const sortByStatus = document.getElementById("sortByStatus");
const editClientModal = document.getElementById("editClientModal");
const closeEditClientModal = document.getElementById("closeEditClientModal");

const toastContainer = document.getElementById("toastContainer");
const confirmModal = document.getElementById("confirmModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

//
//
let clients = [];
let editedClientId = null;
let clientIdToDelete = null;
//
//
addClientButton.addEventListener("click", () => {
  addClientModal.classList.add("addClient-modal");
});

//

closeClientModalButton.addEventListener("click", () => {
  addClientModal.classList.remove("addClient-modal");
});

closeEditClientModal.addEventListener("click", () => {
  editClientModal.classList.remove("addClient-modal");
});

cancelDelete.addEventListener("click", () => {
  clientIdToDelete = null;

  confirmModal.classList.add("hidden");
  confirmModal.classList.remove("confirm-modal");
});

confirmDelete.addEventListener("click", () => {
  if (!clientIdToDelete) return;

  fetch(`http://localhost:3000/clients/${clientIdToDelete}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete client.");
      }
      clients = clients.filter((client) => client.id !== clientIdToDelete);
      refreshUI();

      showToast("Client deleted successfully.", "success");
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast("An error occurred while deleting the client.", "error");
    })
    .finally(() => {
      clientIdToDelete = null;

      confirmModal.classList.add("hidden");
      confirmModal.classList.remove("confirm-modal");
    });
});

function updateStats(clients) {
  const numOfTotalClients = (totalClients.textContent = clients.length);

  const activeCount = clients.filter(
    (client) => client.status === "Active",
  ).length;
  activeAccounts.textContent = activeCount;

  const pausedCount = clients.filter(
    (client) => client.status === "Paused",
  ).length;
  pausedAccounts.textContent = pausedCount;

  const archivedCount = clients.filter(
    (client) => client.status === "Archived",
  ).length;
  archivedAccounts.textContent = archivedCount;
}

function getStatusClass(status) {
  if (status === "Active") return "success";
  if (status === "Paused") return "warning";
  return "secondary";
}

function renderIndustryOptions(clients) {
  selectedIndustry.innerHTML =
    '<option value="All Industries">All Industries</option>';

  const uniqueIndustries = [
    ...new Set(clients.map((client) => client.industry)),
  ];
  uniqueIndustries.forEach((industry) => {
    const option = document.createElement("option");
    option.value = industry;
    option.textContent = industry;
    selectedIndustry.appendChild(option);
  });
}

function renderClientOptions(clients) {
  selectedClient.innerHTML = `<option value="All Clients">All Clients</option>`;
  const uniqueClients = [
    ...new Set(clients.map((client) => client.companyName)),
  ];
  uniqueClients.forEach((companyName) => {
    const option = document.createElement("option");
    option.value = companyName;
    option.textContent = companyName;
    selectedClient.appendChild(option);
  });
}

function deleteClient(clientId) {
  clientIdToDelete = clientId;
  confirmModal.classList.remove("hidden");
  confirmModal.classList.add("confirm-modal");
}

function updateClientStatus(clientId, status, selectElement) {
  fetch(`http://localhost:3000/clients/${clientId}`, {
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
    .then((updatedClient) => {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        client.status = updatedClient.status;
      }
      updateStats(clients);
      renderClients(getFilteredClients(clients));
      showToast("Client Status updated.", "success");
    })
    .catch((error) => {
      console.log("Error:", error);
      showToast("Could not update client status. Please try again.", "error");
      selectElement.value =
        selectElement.dataset.previousValue || selectElement.value;
    });
}

function renderClients(clients) {
  tablebodyIn.innerHTML = "";

  const tbody = document.createElement("tbody");
  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                                <td style="font-weight: 500">${client.companyName}</td>
                                <td><span class="contact-person">${client.contactPerson}</span> <br /> ${client.contactRole}</td>
                                <td><span class="contact-person">${client.email}</span> <br /> ${client.phone}</td>
                                <td>${client.industry}</td>
                                <td>
                                  <select class="status-select  badge badge--${getStatusClass(client.status)} dropdown" data-client-id="${client.id}">
                                    <option class="badge badge--success" value="Active" ${client.status === "Active" ? "selected" : ""}>Active</option>
                                    <option class="badge badge--warning" value="Paused" ${client.status === "Paused" ? "selected" : ""}>Paused</option>
                                    <option class="badge badge--secondary" value="Archived" ${client.status === "Archived" ? "selected" : ""}>Archived</option>
                                  </select>
                                </td>
                                <td>
                                  <button class="icon-btn"  onclick="editClients('${client.id}')">✏️</button>
                                  <button class="icon-btn"  onclick="deleteClient('${client.id}')">🗑️</button></td>

                        `;
    tablebodyIn.appendChild(row);
  });
}

function editClients(clientId) {
  editClientModal.classList.add("addClient-modal");
  editedClientId = clientId;

  fetch(`http://localhost:3000/clients/${clientId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch client.");
      }
      return response.json();
    })
    .then((client) => {
      document.getElementById("editCompanyName").value = client.companyName;
      document.getElementById("editCompanyDescription").value =
        client.companyDescription;
      document.getElementById("editContactPerson").value = client.contactPerson;
      document.getElementById("editContactRole").value = client.contactRole;
      document.getElementById("editEmail").value = client.email;
      document.getElementById("editPhone").value = client.phone;
      document.getElementById("editWebsite").value = client.website;
      document.getElementById("editIndustry").value = client.industry;
      document.querySelector(
        `input[name="editStatus"][value="${client.status}"]`,
      ).checked = true;
      document.getElementById("editAddress").value = client.address;
      document.getElementById("editCity").value = client.city;
      document.getElementById("editCountry").value = client.country;
      document.getElementById("editVatNumber").value = client.vatNumber;
    });
}

function getFilteredClients(clients) {
  let filteredClients = [...clients];
  const searchValue = searchClients.value.toLowerCase().trim();

  const selectedIndustryValue = selectedIndustry.value;
  const currentStatus = selectedStatus.value;
  const selectedClientValue = selectedClient.value;
  if (selectedIndustryValue !== "All Industries") {
    filteredClients = filteredClients.filter(
      (client) => client.industry === selectedIndustryValue,
    );
  }
  if (currentStatus !== "All") {
    filteredClients = filteredClients.filter(
      (client) => client.status === currentStatus,
    );
  }

  if (selectedClientValue !== "All Clients") {
    filteredClients = filteredClients.filter(
      (client) => client.companyName === selectedClientValue,
    );
  }

  if (searchValue) {
    filteredClients = filteredClients.filter(
      (client) =>
        client.companyName.toLowerCase().includes(searchValue) ||
        client.contactPerson.toLowerCase().includes(searchValue) ||
        client.industry.toLowerCase().includes(searchValue),
    );
  }
  return filteredClients;
}

function submitEditedClients(clients) {
  const editForm = document.getElementById("editClientForm");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editedClientData = {
      companyName: document.getElementById("editCompanyName").value,
      companyDescription: document.getElementById("editCompanyDescription")
        .value,
      contactPerson: document.getElementById("editContactPerson").value,
      contactRole: document.getElementById("editContactRole").value,
      email: document.getElementById("editEmail").value,
      phone: document.getElementById("editPhone").value,
      website: document.getElementById("editWebsite").value,
      industry: document.getElementById("editIndustry").value,
      status: document.querySelector('input[name="editStatus"]:checked').value,
      address: document.getElementById("editAddress").value,
      city: document.getElementById("editCity").value,
      country: document.getElementById("editCountry").value,
      vatNumber: document.getElementById("editVatNumber").value,
    };

    fetch(`http://localhost:3000/clients/${editedClientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedClientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update client.");
        }
        return response.json();
      })
      .then((editedClientData) => {
        const client = clients.find((c) => c.id === editedClientId);
        if (client) {
          Object.assign(client, editedClientData);
        }

        editClientModal.classList.remove("addClient-modal");
        refreshUI();
        showToast("Client updated successfully.", "success");
      })
      .catch((error) => {
        console.log("Error:", error);
        showToast("An error occurred while updating the client.", "error");
      });
  });
}

function addClient(clients) {
  const clientForm = document.getElementById("clientForm");
  clientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const clientData = {
      companyName: document.getElementById("companyName").value,
      companyDescription: document.getElementById("companyDescription").value,
      contactPerson: document.getElementById("contactPerson").value,
      contactRole: document.getElementById("contactRole").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      website: document.getElementById("website").value,
      industry: document.getElementById("industry").value,
      status: document.querySelector('input[name="status"]:checked').value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      country: document.getElementById("country").value,
      vatNumber: document.getElementById("vatNumber").value,
    };

    fetch("http://localhost:3000/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add client.");
        }
        return response.json();
      })
      .then((createdClient) => {
        clients.push(createdClient);
        clientForm.reset();
        addClientModal.classList.remove("addClient-modal");
        refreshUI();
        showToast("Client added successfully.", "success");
      })
      .catch((error) => {
        console.log("Error:", error);
        showToast("An error occurred while adding the client.", "error");
      });
  });
}

function refreshUI() {
  updateStats(clients);

  renderIndustryOptions(clients);

  renderClientOptions(clients);

  renderClients(clients);
}

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

fetch("http://localhost:3000/clients")
  .then((response) => response.json())
  .then((data) => {
    clients = data;
    let sortState = 0;
    let sortStateStatus = 0;

    refreshUI();

    addClient(clients);

    submitEditedClients(clients);

    sortByStatus.addEventListener("click", () => {
      sortStateStatus++;
      const originalClients = [...clients];
      const sortedClientsAZ = [...clients].sort((a, b) =>
        a.status.localeCompare(b.status),
      );
      const sortedClientsZA = [...clients].sort((a, b) =>
        b.status.localeCompare(a.status),
      );
      if (sortStateStatus > 2) {
        sortStateStatus = 0;
      }
      if (sortStateStatus === 0) {
        renderClients(originalClients);
      }

      if (sortStateStatus === 1) {
        renderClients(sortedClientsAZ);
      }

      if (sortStateStatus === 2) {
        renderClients(sortedClientsZA);
      }
    });

    sortByName.addEventListener("click", () => {
      sortState++;
      const originalClients = [...clients];
      const sortedClientsAZ = [...clients].sort((a, b) =>
        a.companyName.localeCompare(b.companyName),
      );
      const sortedClientsZA = [...clients].sort((a, b) =>
        b.companyName.localeCompare(a.companyName),
      );
      if (sortState > 2) {
        sortState = 0;
      }
      if (sortState === 0) {
        renderClients(originalClients);
      }

      if (sortState === 1) {
        renderClients(sortedClientsAZ);
      }

      if (sortState === 2) {
        renderClients(sortedClientsZA);
      }
    });

    clearBtn.addEventListener("click", () => {
      searchClients.value = "";
      selectedIndustry.value = "All Industries";
      selectedStatus.value = "All";
      searchClients.value = "";
      refreshUI();
    });

    selectedIndustry.addEventListener("change", () => {
      const filteredClients = getFilteredClients(clients);
      renderClients(filteredClients);
    });
    selectedStatus.addEventListener("change", () => {
      const filteredClients = getFilteredClients(clients);
      renderClients(filteredClients);
    });
    searchClients.addEventListener("input", () => {
      const filteredClients = getFilteredClients(clients);
      renderClients(filteredClients);
    });
    selectedClient.addEventListener("change", () => {
      const filteredClients = getFilteredClients(clients);
      renderClients(filteredClients);
    });
    tablebodyIn.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-select")) {
        const clientId = e.target.dataset.clientId;
        const status = e.target.value;
        updateClientStatus(clientId, status, e.target);
      }
    });
  })

  .catch((error) => {
    console.log("Error:", error);
  });
