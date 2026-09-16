const SHIFTS_KEY = "mms_shifts";

function getAllShifts() {
    const raw = localStorage.getItem(SHIFTS_KEY);

    if (raw === null) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveAllShifts(shifts) {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
}

function getShiftsForUser(username) {
    return getAllShifts().filter((shift) => shift.username === username);
}

function getShiftById(shiftId) {
    return getAllShifts().find((shift) => shift.id === shiftId) || null;
}

function addShift(shift) {
    const shifts = getAllShifts();
    shifts.push(shift);
    saveAllShifts(shifts);
}

function updateShift(shiftId, updatedFields) {
    const shifts = getAllShifts();
    const index = shifts.findIndex((shift) => shift.id === shiftId);

    if (index === -1) {
        return false;
    }

    shifts[index] = {
        ...shifts[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
    };

    saveAllShifts(shifts);
    return true;
}

function deleteShift(shiftId) {
    const shifts = getAllShifts();
    const remaining = shifts.filter((shift) => shift.id !== shiftId);
    saveAllShifts(remaining);
}

function generateShiftId() {
    return crypto.randomUUID();
}


function calculateHoursWorked(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return (endTotalMinutes - startTotalMinutes) / 60;
}

function calculateShiftProfit(shift) {
    const hours = calculateHoursWorked(shift.startTime, shift.endTime);
    return hours * shift.hourlyWage;
}


function isShiftNameTaken(username, shiftName, excludeShiftId = null) {
    const normalized = shiftName.trim().toLowerCase();

    return getShiftsForUser(username).some((shift) =>
        shift.id !== excludeShiftId &&
        shift.name.toLowerCase() === normalized
    );
}