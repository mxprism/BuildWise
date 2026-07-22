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

const errorMessage = document.getElementById("error-message");

function formatPrice(amount) {
  return `£${amount.toFixed(2)}`;
} 

function saveCalculations() {//tells the browser to save the calculations array in local storage as a string 
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

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

calculateButton.addEventListener("click", () => {
  const material = materialNameInput.value.trim();
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);

if (material === "") {
  showError("Please enter a material name.");
  return;
}

if (!Number.isFinite(quantity) || quantity <= 0) {
  showError("Please enter a quantity greater than 0.");
  return;
}

if (!Number.isFinite(price) || price <= 0) {
  showError("Please enter a price greater than £0.");
  return;
}

clearError();

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
  clearError();
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

const calculatorInputs = [
  materialNameInput,
  quantityInput,
  priceInput
];

calculatorInputs.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateButton.click();
    }
  });
});