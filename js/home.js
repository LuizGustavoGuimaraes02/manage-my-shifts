const currentUser = getCurrentUser();

function formatCurrency(value) {
    return value.toLocaleString(undefined, {
        style: "currency",
        currency: "CAD"
    });
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

function formatMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);

    return date.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function render() {
    const shifts = getShiftsForUser(currentUser.username);

    const emptyState = document.getElementById("emptyState");
    const tableWrapper = document.getElementById("tableWrapper");
    const bestMonthBox = document.getElementById("bestMonth");

    if (shifts.length === 0) {
        emptyState.style.display = "block";
        tableWrapper.style.display = "none";
        bestMonthBox.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    tableWrapper.style.display = "block";

    renderShiftsTable(shifts);

    const best = findBestMonth(shifts);
    bestMonthBox.style.display = "block";
    bestMonthBox.textContent =
        `Best month so far: ${formatMonthLabel(best.month)} — ${formatCurrency(best.total)}`;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("greeting").textContent = "Hello, " + currentUser.firstName;
    document.getElementById("logoutButton").addEventListener("click", logout);

    render();
});