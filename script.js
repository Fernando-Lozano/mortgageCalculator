const form = document.querySelector("form");
const displays = {
    payments: document.querySelector("#payments"),
    payed: document.querySelector("#payed"),
    insurance: document.querySelector("#insurance"),
    interestTotal: document.querySelector("#interestTotal")
}  

// extracts values from calculator
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = {
        price: Number(e.target[0].value),
        down: Number(e.target[1].value) / 100,
        interest: Number(e.target[2].value) / 100,
        period: Number(e.target[3].value)
    }
    calculate(inputs);
});


function calculate({price, down, interest, period}) {
    let     months = period * 12,
            monthInterest = interest / 12;
    let premium = getCmhcPremium(down) / 100;
    // let premium = 0;
    price *= Math.abs(down-1); // removes downpayment
    let premiumCost = (price * premium); // cost of insurance
    price += premiumCost;

    // gets monthly payments
    let payments = ((price * monthInterest * ((1 + monthInterest) ** (12 * period))) / ((1 + monthInterest) ** (12 * period) - 1)).toFixed(2);
    let finalCost = (payments * months).toFixed(2);

    // display all results
    displays.payments.textContent = numberWithSpaces(payments);
    displays.payed.textContent = numberWithSpaces(finalCost);
    displays.insurance.textContent = numberWithSpaces(premiumCost.toFixed(2));
    displays.interestTotal.textContent = numberWithSpaces((finalCost - price).toFixed(2));

}

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