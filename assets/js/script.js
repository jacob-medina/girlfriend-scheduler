const minTimeBlock = 9;
const maxTimeBlock = 17;
const updateTimeSeconds = 60;  // update display every 60 seconds
var updateInterval;


// converts 24 hour time to 12 hour time
function to12Hour(time) {
  if (time < 12) { return time + " AM"; }

  else if (time === 12) { return "12 PM"; }

  else { return (time - 12) + " PM"; }
}


function saveTimeBlock(event) {
  var timeBlock = $(event.target).parent();
  if (!timeBlock.is(".time-block")) {
    timeBlock = timeBlock.parent();
  }
  const textArea = timeBlock.find('.description');

  localStorage.setItem(timeBlock.attr('id'), textArea.val());

  const savedNotification = document.getElementById("saved-notification");
  bootstrap.Toast.getOrCreateInstance(savedNotification).show();
}


// generates time block elements and their child elements
function generateTimeBlocks() {
  for (var time = minTimeBlock; time <= maxTimeBlock; time++) {
    var timeBlock = $('<section>');
    timeBlock.attr('id', 'hour-' + time);
    timeBlock.attr('class', 'row time-block');
    timeBlock.append(`
    <div class="col-2 col-md-2 col-lg-1 hour text-center py-3">
      <span class="col-12 fs-2 align-middle">${to12Hour(time)}</span>
    </div>
    <textarea class="col-8 col-md-9 col-lg-10 description fs-2" rows="2"></textarea>
    <button class="btn saveBtn col-2 col-md-1" aria-label="save">
      <span class="material-symbols-outlined">favorite</span>
    </button>`);

    var saveButton = timeBlock.find('.saveBtn');
    saveButton.on('click', saveTimeBlock);

    $('#time-block-container').append(timeBlock);
  }
}


// updates time block colors based on current time
function updateTimeBlockColors() {
  var timeBlocks = $('.time-block');

  for (var timeBlock of timeBlocks) {
    timeBlock = $(timeBlock);

    const hours = Number(timeBlock.attr('id').slice(5));  // get hour block as number
    const blockTime = dayjs().startOf('day').add(hours, 'hour');  // time block as a Date
    const timeDifference = blockTime.diff(dayjs().startOf('hour'), 'hour');  // difference between blockTime and current time

    timeBlock.attr('class', 'row time-block');  // reset time block classes

    // set class based on time difference
    if (timeDifference < 0) { timeBlock.addClass('past'); }
    else if (timeDifference === 0) { timeBlock.addClass('present'); }
    else { timeBlock.addClass('future'); }

  }
}


// update text that displays current date
function updateCurrentDate() {
  $('#currentDay').text(dayjs().format('dddd, MMMM D'));
}


// update time-based elements
function update() {
  updateTimeBlockColors();
  updateCurrentDate();
}


// updates time blocks with local storage data (if any)
function pullFromLocalStorage() {
  var timeBlocks = $('.time-block');

  for (var time = minTimeBlock; time <= maxTimeBlock; time++) {
    const text = localStorage.getItem('hour-' + time);

    if (text === null || text === undefined) { continue; }

    const timeBlock = $('#hour-' + time);
    timeBlock.find('.description').text(text);
  }
}


// function movePen(event) {
//   $('#pen').css({
//     left: event.pageX,
//     top: event.pageY
//   });
// }


// executes a single time once the webpage loads
function init() {
  generateTimeBlocks();

  // start update loop
  updateInterval = setInterval(update, updateTimeSeconds * 1000);
  update();

  pullFromLocalStorage();

  $(document).mousemove(movePen);
}


$(init);