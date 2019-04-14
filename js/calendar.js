const currentDate = new Date();
const today = currentDate.getDate();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const appointments = new Map();
const backdrop = document.querySelector(".backdrop");
const form = document.querySelector("form");
const alert = document.querySelector(".alert");
const appointmentInput = document.querySelector(".appointment-text");
const selectedDate = document.querySelector(".selectedDate");
const monthText = months[currentDate.getMonth()];

const getDaysInMonth = () => {
  return 32 - new Date(currentYear, currentMonth, 32).getDate();
};

const getFirstDay = () => {
  return new Date(currentYear, currentMonth).getDay();
};

const renderCalendar = onDateClick => {
  const tableBody = document.createElement("tbody");
  for (let dayInMonth = 0; dayInMonth < 6; dayInMonth++) {
    const tableRow = document.createElement("tr");
    tableBody.appendChild(renderWeekRow(tableRow, dayInMonth, onDateClick));
  }
  document.querySelector("table").appendChild(tableBody);
};

let day = 1;
const renderWeekRow = (tableRow, dayInMonth, onDateClick) => {
  let firstDay = getFirstDay();
  let daysInMonth = getDaysInMonth();

  for (let weekDay = 1; weekDay <= 7; weekDay++) {
    const tableData = document.createElement("td");
    if (day > daysInMonth) {
      break;
    }
    if (dayInMonth === 0 && weekDay < firstDay) {
      const data = document.createTextNode("");
      tableData.appendChild(data);
    } else {
      const data = document.createTextNode(day + " ");
      const appointmentBadge = document.createTextNode("");
      tableData.appendChild(data);
      tableData.appendChild(appointmentBadge);
      if (day === today) {
        tableData.classList.add("current-day");
      }
      tableData.onclick = onDateClick;
      day += 1;
    }
    tableRow.appendChild(tableData);
  }
  return tableRow;
};

const prepopulateAppointment = date => {
  if (appointments.has(date)) {
    alert.style.display = "flex";
    alert.classList.remove("alert-error");
    alert.classList.add("alert-warning");
    alert.children[0].innerHTML =
      "Warning: You are editing an existing appointment";
    const prevAppointment = appointments.get(date);
    appointmentInput.value = prevAppointment;
  } else {
    appointmentInput.value = "";
  }
};

document.querySelector(".current-month").innerHTML = monthText;

const onDateClick = e => {
  const dateCell = e.target;

  if (
    dateCell.childNodes.length > 1 &&
    !isNaN(Number(dateCell.childNodes[0].data))
  ) {
    const date = Number(dateCell.childNodes[0].data);
    if (date >= today) {
      selectedDate.value = date;

      prepopulateAppointment(date);

      backdrop.style.visibility = "visible";

      form.onsubmit = e => {
        e.preventDefault();
        const date = Number(selectedDate.value);
        const appointment = appointmentInput.value;
        if (!appointment) {
          alert.style.display = "flex";
          alert.classList.remove("alert-warning");
          alert.classList.add("alert-error");
          alert.children[0].innerHTML =
            "Error: You cannot add an empty appointment";
          return;
        }
        appointments.set(date, appointment);
        dateCell.classList.add("event-day");
        dateCell.style;
        dateCell.childNodes[1].data = appointment;
        backdrop.style.visibility = "hidden";
        alert.style.display = "none";
        const deleteAppointmentButton = document.createElement("span");
        deleteAppointmentButton.innerHTML = "X";
        deleteAppointmentButton.onclick = e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          appointments.delete(date);
          dateCell.classList.remove("event-day");
          dateCell.childNodes[1].data = "";
          e.target.style.display = "none";
        };
        deleteAppointmentButton.classList.add("delete-appointment");
        dateCell.appendChild(deleteAppointmentButton);
      };
    }
  } else {
    throw new Error("Invalidate date");
  }
};

document.querySelector(".cancel-button").onclick = () => {
  backdrop.style.visibility = "hidden";
  alert.style.display = "none";
};

(function() {
  renderCalendar(onDateClick);
})();
