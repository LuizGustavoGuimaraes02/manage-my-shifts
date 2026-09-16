const shiftForm = document.getElementById("shiftForm");
const formErrors = document.getElementById("formErrors");
const workplaceSelect = document.getElementById("workplaceSelect");
const newWorkplaceGroup = document.getElementById("newWorkplaceGroup");
const newWorkplaceInput = document.getElementById("newWorkplace");
const saveButton = document.getElementById("saveButton");
const savingIndicator = document.getElementById("savingIndicator");

const currentUser = getCurrentUser();

function getTodayLocalISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const params = new URLSearchParams(window.location.search);
const editingShiftId = params.get("id");
const isEditMode = editingShiftId !== null;

function showErrors(errors) {
    formErrors.innerHTML = "";

    if (errors.length === 0) {
        return;
    }

    const list = document.createElement("ul");
    list.className = "error-list";

    errors.forEach((message) => {
        const item = document.createElement("li");
        item.textContent = message;
        list.appendChild(item);
    });

    formErrors.appendChild(list);
}


function populateWorkplaces(selectedPlace) {
    const places = getShiftsForUser(currentUser.username)
        .map((shift) => shift.place);


    const uniquePlaces = [...new Set(places)];

    uniquePlaces.forEach((place) => {
        const option = document.createElement("option");
        option.value = place;
        option.textContent = place;
        workplaceSelect.insertBefore(option, workplaceSelect.lastElementChild);
    });

    if (selectedPlace) {
        workplaceSelect.value = selectedPlace;
    }
}

workplaceSelect.addEventListener("change", function () {
    const isNew = workplaceSelect.value === "__new__";
    newWorkplaceGroup.style.display = isNew ? "block" : "none";
    newWorkplaceInput.required = isNew;
});

function getSelectedWorkplace() {
    if (workplaceSelect.value === "__new__") {
        return newWorkplaceInput.value.trim();
    }
    return workplaceSelect.value;
}

function validate(data) {
    const errors = [];

     if (data.date === "") {
        errors.push("Date is required.");
    } else if (data.date > getTodayLocalISO()) {
        errors.push("Shift date cannot be in the future.");
    }

    if (data.startTime === "" || data.endTime === "") {
        errors.push("Start and end time are required.");
    } else if (data.endTime <= data.startTime) {
        errors.push("End time must be later than start time.");
    }

    const wage = Number(data.hourlyWage);
    if (data.hourlyWage === "" || isNaN(wage) || wage <= 0) {
        errors.push("Hourly wage must be a positive number.");
    }

    if (data.place === "") {
        errors.push("Workplace is required.");
    }

    if (data.name === "") {
        errors.push("Shift name is required.");
    } else if (isShiftNameTaken(currentUser.username, data.name, editingShiftId)) {
        errors.push("You already have a shift with this name. Choose a different one.");
    }

    return errors;
}

shiftForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        date: document.getElementById("shiftDate").value,
        startTime: document.getElementById("startTime").value,
        endTime: document.getElementById("endTime").value,
        hourlyWage: document.getElementById("hourlyWage").value,
        place: getSelectedWorkplace(),
        name: document.getElementById("shiftName").value.trim(),
        comments: document.getElementById("comments").value.trim()
    };

    const errors = validate(data);

    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    showErrors([]);
    saveButton.disabled = true;
    savingIndicator.style.display = "inline-block";

    const shiftFields = {
        username: currentUser.username,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        hourlyWage: Number(data.hourlyWage),
        place: data.place,
        name: data.name,
        comments: data.comments
    };

    setTimeout(function () {
        if (isEditMode) {
            updateShift(editingShiftId, shiftFields);
        } else {
            addShift({ id: generateShiftId(), createdAt: new Date().toISOString(), ...shiftFields });
        }

        window.location.href = "home.html";
    }, 400);
});

function loadForEdit() {
    const shift = getShiftById(editingShiftId);

    if (shift === null || shift.username !== currentUser.username) {

        window.location.replace("home.html");
        return;
    }

    document.getElementById("pageTitle").textContent = "Edit Shift | Manage My Shifts";
    document.getElementById("formTitle").textContent = "Edit Shift";
    saveButton.textContent = "Save changes";

    document.getElementById("shiftDate").value = shift.date;
    document.getElementById("startTime").value = shift.startTime;
    document.getElementById("endTime").value = shift.endTime;
    document.getElementById("hourlyWage").value = shift.hourlyWage;
    document.getElementById("shiftName").value = shift.name;
    document.getElementById("comments").value = shift.comments;

    populateWorkplaces(shift.place);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("greeting").textContent = "Hello, " + currentUser.firstName;
    document.getElementById("logoutButton").addEventListener("click", logout);

    document.getElementById("shiftDate").max = getTodayLocalISO();

    if (isEditMode) {
        loadForEdit();
    } else {
        populateWorkplaces();
    }
});

