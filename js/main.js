"use strict";

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all)
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price...
// TODO: in seat details, show available seats around
// TODO: Upload to GitHub Pages

var gElSelectedSeat = null;
var gCinema = createCinema();
// console.log(gCinema);
renderCinema();

function createCinema() {
  var cinema = [];
  for (var i = 0; i < 7; i++) {
    cinema[i] = [];
    for (var j = 0; j < 15; j++) {
      var cell = {
        type: j === 7 ? "X" : "S",
        id: `Seat: ${i}, ${j}`,
        isBooked: false,
        price: 2 + 10 * i,
      };
      cinema[i][j] = cell;
    }
  }
  cinema[4][4].isBooked = true;

  return cinema;
}
function renderCinema() {
  var strHTML = "";
  for (var i = 0; i < gCinema.length; i++) {
    var row = gCinema[i];

    strHTML += `<tr class="cinema-row" >\n`;
    for (var j = 0; j < row.length; j++) {
      var seat = row[j];
      // for seat of type SEAT add seat class
      var className = seat.type === "S" ? "seat" : "";
      // for seat that is booked add booked class
      if (seat.isBooked) {
        className += " booked";
        seat.id += "-Booked";
      }
      // Add a seat title: `Seat: ${i}, ${j}`
      strHTML += `\t<td title="${seat.id}" class="cell ${className}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  // console.log(strHTML)

  var elSeats = document.querySelector(".cinema-seats");
  elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
  var cell = gCinema[i][j];
  // TODO: ignore none seats and booked
  if (cell.type !== "S" || cell.isBooked) return;
  console.log("Cell clicked: ", elCell, i, j);
  // Support selecting a seat
  elCell.classList.toggle("selected");
  if (gElSelectedSeat) {
    gElSelectedSeat.classList.remove("selected");
  }
  gElSelectedSeat = elCell !== gElSelectedSeat ? elCell : null;
  // Only a single seat should be selected
  // Support Unselecting a seat
  // TODO: When seat is selected a popup is shown
  if (gElSelectedSeat) {
    showSeatDetails({ i, j });
  }
}

function showSeatDetails(pos) {
  var elPopup = document.querySelector(".popup");
  var availableSeats = availableSeatsNextTo(pos.i, pos.j);
  var seat = gCinema[pos.i][pos.j];
  elPopup.querySelector("h2 span").innerText = `${pos.i}-${pos.j}`;
  elPopup.querySelector("h3 span").innerText = `$${seat.price}`;
  elPopup.querySelector("h4 span").innerText = availableSeats;
  const elBtn = elPopup.querySelector("button");
  elBtn.dataset.i = pos.i;
  elBtn.dataset.j = pos.j;
  elPopup.hidden = false;
}
function hideSeatDetails() {
  document.querySelector(".popup").hidden = true;
}

function bookSeat(elBtn) {
  console.log("Booking seat, button: ", elBtn.dataset);
  const i = +elBtn.dataset.i;
  const j = +elBtn.dataset.j;
  gCinema[i][j].isBooked = true;
  renderCinema();
  unSelectSeat();
}

function unSelectSeat() {
  hideSeatDetails();
  // TODO: remove 'selected' class and reset el
}

function availableSeatsNextTo(i, j) {
  console.log("gCinema", gCinema[i][j]);
  var choosenSeat = gCinema[i][j];
  //   console.log("gCinema", gCinema[i + 1][j - 1]);
  //   var leftSideSameRow = gCinema[i][j - 1];
  //   var rightSideSameRow = gCinema[i][j + 1];
  //   var middleTopRow = gCinema[i - 1][j];
  //   var middleBottomRow = gCinema[i + 1][j];
  //   var leftTopRow = gCinema[i - 1][j - 1];
  //   var rightTopRow = gCinema[i - 1][j + 1];
  //   var rightBottomRow = gCinema[i + 1][j + 1];
  //   var leftBottomRow = gCinema[i + 1][j - 1];

  const topRow = i - 1;
  const topLeftCol = j - 1;

  //   console.log(topRow, topLeftCol);
  var availables = "\n";

  for (let i = 0; i < 3; i++) {
    const row = gCinema[topRow + i];
    // console.log(row);

    for (let j = 0; j < 3; j++) {
      const seat = row[topLeftCol + j];
      //   console.log(seat);
      if (!seat.isBooked && seat.id != choosenSeat.id) {
        availables += `${seat.id}\n`;
      }
    }
  }
  return availables;
  //   console.log(availables);
}
