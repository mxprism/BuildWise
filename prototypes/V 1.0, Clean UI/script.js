const materialNameInput = document.getElementById("material-name");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const totalDisplay = document.getElementById("total");
const calculatorForm = document.getElementById("calculator-form");
const clearAllButton = document.getElementById("clear-all-button");
const pastCalculationsButton = document.getElementById("past-calculations-button");
const addAllButton = document.getElementById("add-all-button");
const clearHistoryButton = document.getElementById("clear-history-button");
const historySection = document.getElementById("history-section");
const historyList = document.getElementById("calculation-history");
const errorMessage = document.getElementById("error-message");
const calculations = JSON.parse(localStorage.getItem("buildwiseCalculations")) || [];

function formatPrice(amount) { return `£${amount.toFixed(2)}`; }
function saveCalculations() { localStorage.setItem("buildwiseCalculations", JSON.stringify(calculations)); }
function showError(message) { errorMessage.textContent = message; }
function clearError() { errorMessage.textContent = ""; }

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
    listItem.textContent = `${calculation.material}: ${calculation.quantity} × ${formatPrice(calculation.price)} = ${formatPrice(calculation.total)}`;
    historyList.appendChild(listItem);
  });
}

function calculateCost() {
  const material = materialNameInput.value.trim();
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);
  if (!material) return showError("Please enter a material name.");
  if (!Number.isFinite(quantity) || quantity <= 0) return showError("Please enter a quantity greater than 0.");
  if (!Number.isFinite(price) || price <= 0) return showError("Please enter a price greater than £0.");
  clearError();
  const total = quantity * price;
  totalDisplay.textContent = formatPrice(total);
  calculations.push({ material, quantity, price, total });
  saveCalculations();
  showPastCalculations();
  historySection.hidden = false;
  pastCalculationsButton.setAttribute("aria-expanded", "true");
}

calculatorForm.addEventListener("submit", (event) => { event.preventDefault(); calculateCost(); });
clearAllButton.addEventListener("click", () => { calculatorForm.reset(); totalDisplay.textContent = "£0.00"; clearError(); materialNameInput.focus(); });
document.querySelectorAll(".clear-field").forEach((button) => button.addEventListener("click", () => { document.getElementById(button.dataset.input).value = ""; }));
pastCalculationsButton.addEventListener("click", () => {
  historySection.hidden = !historySection.hidden;
  const isOpen = !historySection.hidden;
  pastCalculationsButton.setAttribute("aria-expanded", String(isOpen));
  pastCalculationsButton.textContent = isOpen ? "Hide history" : "View history";
  showPastCalculations();
});
addAllButton.addEventListener("click", () => { totalDisplay.textContent = formatPrice(calculations.reduce((sum, calculation) => sum + calculation.total, 0)); });
clearHistoryButton.addEventListener("click", () => { calculations.length = 0; localStorage.removeItem("buildwiseCalculations"); showPastCalculations(); totalDisplay.textContent = "£0.00"; });
quantityInput.addEventListener("keydown", (event) => { if (["e", "E", "+", "-", "."].includes(event.key)) event.preventDefault(); });
priceInput.addEventListener("input", () => { let value = priceInput.value.replace(/[^\d.]/g, ""); const parts = value.split("."); if (parts.length > 2) value = `${parts[0]}.${parts.slice(1).join("")}`; priceInput.value = value; });
