const materialNameInput = document.getElementById("material-name");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const totalDisplay = document.getElementById("total");

const calculateButton = document.getElementById("calculate-button");
const clearAllButton = document.getElementById("clear-all-button");
const pastCalculationsButton = document.getElementById(
  "past-calculations-button"
);
const addAllButton = document.getElementById("add-all-button");
const clearHistoryButton = document.getElementById("clear-history-button");

const historySection = document.getElementById("history-section");
const historyList = document.getElementById("calculation-history");

const calculations =
  JSON.parse(localStorage.getItem("buildwiseCalculations")) || [];

function formatPrice(amount) {
  return `£${amount.toFixed(2)}`;
}

function saveCalculations() {
  localStorage.setItem("buildwiseCalculations", JSON.stringify(calculations));
}

function showPastCalculations() {
  historyList.innerHTML = "";

  if (calculations.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "No calculations saved yet.";
    historyList.appendChild(listItem);
    return;
  }

  calculations.forEach((calculation) => {
    const listItem = document.createElement("li");

    listItem.textContent =
      `${calculation.material}: ${calculation.quantity} × ` +
      `${formatPrice(calculation.price)} = ${formatPrice(calculation.total)}`;

    historyList.appendChild(listItem);
  });
}

calculateButton.addEventListener("click", () => {
  const material = materialNameInput.value.trim();
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);

 if (material === "" || !Number.isFinite(quantity) || !Number.isFinite(price) ||  quantity <= 0 || price <= 0) {
    alert("Please enter a material name, quantity, and price.");
    return; }

  const total = quantity * price;

  totalDisplay.textContent = formatPrice(total);

  calculations.push({
    material: material,
    quantity: quantity,
    price: price,
    total: total
  });

saveCalculations();
showPastCalculations();
historySection.hidden = false;
});

clearAllButton.addEventListener("click", () => {
  materialNameInput.value = "";
  quantityInput.value = "";
  priceInput.value = "";
  totalDisplay.textContent = "£0.00";
});

document.querySelectorAll(".clear-field").forEach((button) => {
  button.addEventListener("click", () => {
    const inputId = button.dataset.input;
    document.getElementById(inputId).value = "";
  });
});

pastCalculationsButton.addEventListener("click", () => {
  historySection.hidden = !historySection.hidden;
  showPastCalculations();
});

addAllButton.addEventListener("click", () => {
  const totalOfAllCalculations = calculations.reduce(
    (runningTotal, calculation) => runningTotal + calculation.total,
    0
  );

  totalDisplay.textContent = formatPrice(totalOfAllCalculations);
});

clearHistoryButton.addEventListener("click", () => {
  calculations.length = 0;
  localStorage.removeItem("buildwiseCalculations");
  showPastCalculations();
  totalDisplay.textContent = "£0.00";
});

quantityInput.addEventListener("keydown", (event) => {
  if (["e", "E", "+", "-", "."].includes(event.key)) {
    event.preventDefault();
  }
});

priceInput.addEventListener("input", () => {
  let value = priceInput.value.replace(/[^\d.]/g, "");

  const decimalParts = value.split(".");

  if (decimalParts.length > 2) {
    value = `${decimalParts[0]}.${decimalParts.slice(1).join("")}`;
  }

  priceInput.value = value;
});