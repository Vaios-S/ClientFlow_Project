const ctx = document.getElementById("statusChart");
const budgetChart = document.getElementById("budgetChart");
const totalProjects = document.getElementById("totalProjects");
const totalBlocked = document.getElementById("totalBlocked");
const totalCompleted = document.getElementById("totalCompleted");
const totalBudget = document.getElementById("totalBudget");
const blockedList = document.getElementById("blockedlist");

function updateStats(projects) {
  let totalBudgetCount = 0;
  const numOfTotalProjects = (totalProjects.textContent = projects.length);

  const blockedCount = projects.filter(
    (project) => project.status === "Blocked",
  ).length;
  totalBlocked.textContent = blockedCount;

  const completedCount = projects.filter(
    (project) => project.status === "Completed",
  ).length;
  totalCompleted.textContent = completedCount;

  projects.forEach((project) => {
    totalBudgetCount += parseFloat(project.budget);
  });
  totalBudget.textContent = `${totalBudgetCount.toLocaleString("el-GR", {
    style: "currency",
    currency: "EUR",
  })}`;
}

function renderBlockedProjects(projects) {
  blockedList.innerHTML = "";

  const blockedProjects = projects.filter(
    (project) => project.status === "Blocked",
  );

  const blockedProjectsSorted = blockedProjects.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  blockedProjectsSorted.forEach((project) => {
    const dueDate = new Date(project.dueDate);
    const today = new Date();

    const diffMs = dueDate - today;
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const listItem = document.createElement("div");
    listItem.classList.add("list-item");

    listItem.innerHTML = `
             <p class="list-item__title">${project.projectName}</p>
             <p class="list-item__meta">${project.clientName} · Due in ${daysRemaining} days</p>
      `;

    blockedList.append(listItem);
  });
}

function renderStatusChart(projects) {
  const plannigCount = projects.filter(
    (project) => project.status === "Planning",
  ).length;
  const inProgressCount = projects.filter(
    (project) => project.status === "In Progress",
  ).length;
  const reviewCount = projects.filter(
    (project) => project.status === "Review",
  ).length;
  const blockedCount = projects.filter(
    (project) => project.status === "Blocked",
  ).length;
  const completedCount = projects.filter(
    (project) => project.status === "Completed",
  ).length;

  const data = {
    labels: ["Planning", "In Progress", "Review", "Blocked", "Completed"],
    datasets: [
      {
        label: "",
        data: [
          plannigCount,
          inProgressCount,
          reviewCount,
          blockedCount,
          completedCount,
        ],
        borderColor: [
          "rgb(198, 193, 122)",
          "rgb(143, 182, 193)",
          "rgb(182, 163, 214)",
          "rgb(227, 168, 160)",
          "rgb(169, 209, 142)",
        ],
        borderWidth: 2,
        borderRadius: 14,
        backgroundColor: [
          "rgba(198, 193, 122, 0.7)",
          "rgba(143, 182, 193, 0.7)",
          "rgba(182, 163, 214, 0.7)",
          "rgba(227, 168, 160, 0.7)",
          "rgba(169, 209, 142, 0.7)",
        ],
      },
    ],
  };

  new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#8f958f",
          },
          grid: {
            color: "rgba(17, 24, 39, 0.05)",
          },
        },
        x: {
          ticks: {
            color: "#6f746f",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function renderBudgetChart(projects) {
  let sumElStaIni = 0;
  let sumNikPapIni = 0;
  let sumMarKonIni = 0;
  let sumGioAleIni = 0;
  let sumDimKarIni = 0;
  let sumSofKarIni = 0;
  let sumAntRizIni = 0;
  let sumNatPetIni = 0;

  const elSta = projects.filter(
    (project) => project.teamMembers === "Eleni Stavrou",
  );
  const sumElSta = elSta.forEach((b) => {
    sumElStaIni += parseFloat(b.budget);
  });

  const nikPap = projects.filter(
    (project) => project.teamMembers === "Nikos Papadopoulos",
  );
  const sumNikPap = nikPap.forEach((b) => {
    sumNikPapIni += parseFloat(b.budget);
  });

  const marKon = projects.filter(
    (project) => project.teamMembers === "Maria Konstantinou",
  );
  const sumMarKon = marKon.forEach((b) => {
    sumMarKonIni += parseFloat(b.budget);
  });

  const gioAle = projects.filter(
    (project) => project.teamMembers === "Giorgos Alexiou",
  );
  const sumGioAle = gioAle.forEach((b) => {
    sumGioAleIni += parseFloat(b.budget);
  });

  const dimKar = projects.filter(
    (project) => project.teamMembers === "Dimitris Karalis",
  );
  const sumDimKar = dimKar.forEach((b) => {
    sumDimKarIni += parseFloat(b.budget);
  });

  const sofKar = projects.filter(
    (project) => project.teamMembers === "Sofia Karagianni",
  );
  const sumSofKar = sofKar.forEach((b) => {
    sumSofKarIni += parseFloat(b.budget);
  });

  const antRiz = projects.filter(
    (project) => project.teamMembers === "Antonis Rizos",
  );
  const sumAntRiz = antRiz.forEach((b) => {
    sumAntRizIni += parseFloat(b.budget);
  });

  const natPet = projects.filter(
    (project) => project.teamMembers === "Natalia Petrou",
  );
  const sumNatPet = natPet.forEach((b) => {
    sumNatPetIni += parseFloat(b.budget);
  });

  const data = {
    labels: [
      "Nikos Papadopoulos",
      "Maria Konstantinou",
      "Giorgos Alexiou",
      "Eleni Stavrou",
      "Dimitris Karalis",
      "Sofia Karagianni",
      "Antonis Rizos",
      "Natalia Petrou",
    ],
    datasets: [
      {
        label: "",
        data: [
          sumNikPapIni,
          sumMarKonIni,
          sumGioAleIni,
          sumElStaIni,
          sumDimKarIni,
          sumSofKarIni,
          sumAntRizIni,
          sumNatPetIni,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(46, 204, 113)",
          "rgb(231, 76, 60)",
          "rgb(149, 165, 166)",
        ],
        hoverOffset: 4,
        borderColor: "rgb(250, 250, 250, 0)",
      },
    ],
  };

  new Chart(budgetChart, {
    type: "doughnut",
    data: data,

    plugins: [ChartDataLabels],

    options: {
      responsive: true,
      maintainAspectRatio: false,

      cutout: "60%",

      layout: {
        padding: 20,
      },

      plugins: {
        legend: {
          position: "right",

          labels: {
            color: "#d1d5db",

            padding: 18,

            usePointStyle: true,

            pointStyle: "circle",

            boxWidth: 10,
            boxHeight: 10,

            font: {
              size: 13,
              weight: "500",
            },
          },
        },

        datalabels: {
          color: "#ffffff",

          font: {
            size: 11,
            weight: "700",
          },

          formatter(value) {
            return `€${value}`;
          },
        },

        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: €${context.raw}`;
            },
          },
        },
      },
    },
  });
}
Promise.all([
  fetch("http://localhost:3000/clients"),
  fetch("http://localhost:3000/projects"),
  fetch("http://localhost:3000/teamMembers"),
])
  .then(([clients, projects, teamMembers]) => {
    return Promise.all([clients.json(), projects.json(), teamMembers.json()]);
  })
  .then(([clients, projects, teamMembers]) => {
    updateStats(projects);
    renderBlockedProjects(projects);
    renderStatusChart(projects);
    renderBudgetChart(projects);
  });
