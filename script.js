const form = document.querySelector("form");
const section = document.querySelector("section");
const displayDivs = document.querySelectorAll(".results");
const displays = {
    payments: document.querySelector("#payments"),
    payed: document.querySelector("#payed"),
    insurance: document.querySelector("#insurance"),
    interestTotal: document.querySelector("#interestTotal"),
    afterxYears: document.querySelectorAll(".bigger")
}
const inputs = {};
var payments = 0;
var endPrice;
var monthInterest = 0;
let counter = 1;

// extracts values from calculator
form.addEventListener("submit", (e) => {
    e.preventDefault();
    inputs.price = Number(e.target[0].value),
    inputs.down = Number(e.target[1].value) / 100,
    inputs.interest = Number(e.target[2].value) / 100,
    inputs.period = Number(e.target[3].value)
    calculate(inputs);
    counter = 1;
    doPayments(counter * 12, payments, endPrice, monthInterest);
});


function calculate({price, down, interest, period}) {
    let     months = period * 12;
    monthInterest = roundtoFour(interest / 12);
    let premium = getCmhcPremium(down) / 100;
    // let premium = 0;
    price *= Math.abs(down-1); // removes downpayment
    let premiumCost = (price * premium); // cost of insurance
    price += premiumCost;
    endPrice = price; // did this because im lazy

    // gets monthly payments
    payments = roundtoTwo(((price * monthInterest * ((1 + monthInterest) ** (12 * period))) / ((1 + monthInterest) ** (12 * period) - 1)));
    let finalCost = roundtoTwo((payments * months));

    section.classList.remove("d-none");
    // displays all div displays
    displayEffect();

    // displays results
    displays.payments.textContent = numberWithSpaces(payments);
    displays.payed.textContent = numberWithSpaces(finalCost);
    displays.insurance.textContent = numberWithSpaces(premiumCost.toFixed(2));
    displays.interestTotal.textContent = numberWithSpaces((finalCost - price).toFixed(2));

}

// payed after x amount of years
const   years = document.querySelector("#years"),
        principal = document.querySelector("#principal"),
        interest = document.querySelector("#interest"),
        left = document.querySelector(".left"),
        right = document.querySelector(".right");


left.addEventListener("click", () => {
    if (counter === 1) {
        // do nothing
        return;
    }
    else {
        counter--;
        doPayments(counter*12, payments, endPrice, monthInterest);
    }
});
right.addEventListener("click", () => {
    if (counter === inputs.period) {
        // do nothing
        return;
    }
    else {
        counter++;
        doPayments(counter*12, payments, endPrice, monthInterest);
    }
});


// The following premium rates were extracted from
// https://www.cmhc-schl.gc.ca/en/finance-and-investing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/                 cmhc-mortgage-loan-insurance-cost
// on 3/13/2021
function getCmhcPremium(downPayment) {
    let premiums = [
        {atLeast: 0.35, premium: 0.60},
        {atLeast: 0.25, premium: 1.70},
        {atLeast: 0.20, premium: 2.40},
        {atLeast: 0.15, premium: 2.80},
        {atLeast: 0.10, premium: 3.10},
        {atLeast: 0.05, premium: 4.00},
    ]
    for (let option of premiums) {
        if (downPayment >= option.atLeast) {
            return option.premium;
        }
    }
    return premiums[0].premium; // minimum down payment possible
}

// from https://stackoverflow.com/questions/16637051/adding-space-between-numbers
function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}
async function displayEffect() {
    for (let display of displayDivs) {
        await new Promise(r => setTimeout(r, 200));
        display.classList.add("displayResults");
    }
    await new Promise(r => setTimeout(r, 1000));
    section.classList.remove("overflowHide");
    displayDivs[0].scrollIntoView({ behavior: 'smooth' });
}

function doPayments(counter, payments, price, monthInterest) {
    let     interestCount = 0,
            principalCount = 0;
    for (let i = 0; i < counter; i++) {
        let interestPayment = roundtoTwo(price * monthInterest);
        let principalPayment = roundtoTwo(payments - interestPayment);
        interestCount += interestPayment;
        principalCount += principalPayment;
        price = roundtoTwo(price - principalPayment);
    }
    years.textContent = counter/12;
    principal.textContent = "$" + numberWithSpaces(principalCount.toFixed(2));
    interest.textContent = "$" + numberWithSpaces(interestCount.toFixed(2));
}
// from
// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function roundtoTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
function roundtoFour(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}