const container = document.querySelector('.container')
const movieSelect = document.getElementById('movie')

var ticketPrice = +movieSelect.value

function updateCost() {
    console.log("update cost is calling")
    const selectedSeats = document.querySelectorAll('.row .seat.selected')
    console.log(selectedSeats)
    var finalCost = document.getElementById('finalCost')
    finalCost.style.display = "block"
    finalCost.style.visibility = "visible"

    const selectedsSeatsCount = selectedSeats.length;
    console.log(selectedsSeatsCount)

    var cost = document.getElementById('cost')
    console.log("cost", cost)
    cost.innerText = "Total cost is " + selectedsSeatsCount * ticketPrice
}

movieSelect.addEventListener('change', (e) => {
    var screenNo = e.target.selectedIndex + 1

    var screen1 = document.getElementById('screen1')
    var screen2 = document.getElementById('screen2')
    var screen3 = document.getElementById('screen3')

    if (screenNo === 1) {
        screen1.style.display = "flex"
        screen1.style.visibility = "visible"

        screen2.style.display = "none"
        screen2.style.visibility = "hidden"

        screen3.style.display = "none"
        screen3.style.visibility = "hidden"
    } else if (screenNo === 2) {
        screen2.style.display = "flex"
        screen2.style.visibility = "visible"

        screen1.style.display = "none"
        screen1.style.visibility = "hidden"

        screen3.style.display = "none"
        screen3.style.visibility = "hidden"
    } else if (screenNo === 3) {
        screen3.style.display = "flex"
        screen3.style.visibility = "visible"

        screen2.style.display = "none"
        screen2.style.visibility = "hidden"

        screen1.style.display = "none"
        screen1.style.visibility = "hidden"
    }

    ticketPrice = +e.target.value
    updateCost()
})

container.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateCost()
    }
});


updateCost()