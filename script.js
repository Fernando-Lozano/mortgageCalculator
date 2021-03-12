const form = document.querySelector("form");

// extracts values from calculator
form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Worked");
    console.dir(e.target);
    const inputs = {
        price: Number(e.target[0].value),
        down: Number(e.target[1].value),
        interest: Number(e.target[2].value) / 100,
        period: Number(e.target[3].value)
    }
    calculate(inputs);
});

const displays = {
    payments: document.querySelector("#payements"),
    payed: document.querySelector("#payed"),
    insurance: document.querySelector("#insurance"),
    interestTotal: document.querySelector("#interestTotal")
}  

function calculate({price, down, interest, period}) {
    let     months = period * 12,
            monthInterest = interest / 12;
    // do calcs

    // monthly payments
    let payments = (price * monthInterest * ((1 + monthInterest) ** (12 * period))) / ((1 + monthInterest) ** (12 * period) - 1);

    finalCost = payMortgage(price, payments, monthInterest, acc=0);
}

// recursively pay mortgage
function payMortgage(mortgage, payments, interest)

// (100000 * (.06 / 12) * ((1 + (0.06 / 12)) ** (12 * 30))) / ((1 + (0.06 / 12)) ** (12 * 30) - 1);
