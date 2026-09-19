const currentUser = getCurrentUser();

let allShifts = [];

function formatCurrency(value) {
    return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function formatMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function renderShiftsTable(shifts) {
    const tableBody = document.getElementById("shiftsTableBody");
    tableBody.innerHTML = "";

    const sorted = [...shifts].sort((a, b) => b.date.localeCompare(a.date));

    sorted.forEach((shift) => {
        const row = document.createElement("tr");
        row.classList.add("clickable-row");
        row.addEventListener("click", () => {
            window.location.href = `add-shift.html?id=${shift.id}`;
        });

        const profit = calculateShiftProfit(shift);

        row.innerHTML = `
            <td>${shift.date}</td>
            <td>${shift.startTime}</td>
            <td>${shift.endTime}</td>
            <td>${formatCurrency(shift.hourlyWage)}</td>
            <td>${shift.place}</td>
            <td>${formatCurrency(profit)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function findBestMonth(shifts) {
    if (shifts.length === 0) {
        return null;
    }

    const totalsByMonth = {};

    shifts.forEach((shift) => {
        const monthKey = shift.date.slice(0, 7);
        const profit = calculateShiftProfit(shift);
        totalsByMonth[monthKey] = (totalsByMonth[monthKey] || 0) + profit;
    });

    let bestMonth = null;
    let bestTotal = -Infinity;

    for (const monthKey in totalsByMonth) {
        if (totalsByMonth[monthKey] > bestTotal) {
            bestTotal = totalsByMonth[monthKey];
            bestMonth = monthKey;
        }
    }

    return { month: bestMonth, total: bestTotal };
}


function populateFilterPlaces() {
    const select = document.getElementById("filterPlace");
    const places = [...new Set(allShifts.map((shift) => shift.place))];

    places.forEach((place) => {
        const option = document.createElement("option");
        option.value = place;
        option.textContent = place;
        select.appendChild(option);
    });
}

function filterShifts(shifts, filters) {
    return shifts.filter((shift) => {
        if (filters.place !== "" && shift.place !== filters.place) {
            return false;
        }


        if (filters.from !== "" && shift.date < filters.from) {
            return false;
        }

        if (filters.to !== "" && shift.date > filters.to) {
            return false;
        }

        return true;
    });
}

function applyFilters() {
    const filters = {
        place: document.getElementById("filterPlace").value,
        from: document.getElementById("filterFrom").value,
        to: document.getElementById("filterTo").value
    };

    const filtered = filterShifts(allShifts, filters);

    const tableWrapper = document.getElementById("tableWrapper");
    const bestMonthBox = document.getElementById("bestMonth");
    const noResultsMessage = document.getElementById("noResultsMessage");

    if (filtered.length === 0) {
        tableWrapper.style.display = "none";
        bestMonthBox.style.display = "none";
        noResultsMessage.style.display = "block";
        return;
    }

    noResultsMessage.style.display = "none";
    tableWrapper.style.display = "block";
    renderShiftsTable(filtered);

    const best = findBestMonth(filtered);
    bestMonthBox.style.display = "block";
    bestMonthBox.textContent =
        `Best month so far: ${formatMonthLabel(best.month)} — ${formatCurrency(best.total)}`;
}

function clearFilters() {
    document.getElementById("filterPlace").value = "";
    document.getElementById("filterFrom").value = "";
    document.getElementById("filterTo").value = "";
    applyFilters();
}

function render() {
    allShifts = getShiftsForUser(currentUser.id);

    const emptyState = document.getElementById("emptyState");
    const filterBar = document.getElementById("filterBar");

    if (allShifts.length === 0) {
        emptyState.style.display = "block";
        filterBar.style.display = "none";
        document.getElementById("tableWrapper").style.display = "none";
        document.getElementById("bestMonth").style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    filterBar.style.display = "flex";

    populateFilterPlaces();
    applyFilters();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("greeting").textContent = "Hello, " + currentUser.firstName;
    document.getElementById("logoutButton").addEventListener("click", logout);

    document.getElementById("filterPlace").addEventListener("change", applyFilters);
    document.getElementById("filterFrom").addEventListener("change", applyFilters);
    document.getElementById("filterTo").addEventListener("change", applyFilters);
    document.getElementById("clearFiltersButton").addEventListener("click", clearFilters);

    render();
});