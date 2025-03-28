// Thank You page JavaScript functionality

// When the page loads, retrieve and display form data from URL parameters
document.addEventListener("DOMContentLoaded", function () {
  // Get form details from URL parameters
  getFormDetails();
});

// Get URL parameters and display form details
function getFormDetails() {
  const params = new URLSearchParams(window.location.search);
  const formDetails = document.getElementById("formDetails");

  // Create HTML for each required form field
  const requiredFields = [
    { param: "first-name", label: "First Name" },
    { param: "last-name", label: "Last Name" },
    { param: "email", label: "Email" },
    { param: "phone", label: "Phone Number" },
    { param: "business-name", label: "Business Name" },
    { param: "timestamp", label: "Submission Date/Time" },
  ];

  let detailsHTML = "";

  requiredFields.forEach((field) => {
    let value = params.get(field.param) || "Not provided";

    // Format the timestamp if it exists
    if (field.param === "timestamp" && value !== "Not provided") {
      try {
        const date = new Date(value);
        value = date.toLocaleString();
      } catch (error) {
        console.error("Error formatting timestamp:", error);
      }
    }

    detailsHTML += `
        <div class="detail-item">
            <div class="detail-label">${field.label}:</div>
            <div class="detail-value">${value}</div>
        </div>`;
  });

  // Add membership level if available
  const membershipLevel = params.get("membership-level");
  if (membershipLevel) {
    let levelDisplay = "Unknown";

    // Convert membership level code to display text
    switch (membershipLevel) {
      case "np":
        levelDisplay = "Non-Profit Membership";
        break;
      case "bronze":
        levelDisplay = "Bronze Membership";
        break;
      case "silver":
        levelDisplay = "Silver Membership";
        break;
      case "gold":
        levelDisplay = "Gold Membership";
        break;
    }

    detailsHTML += `
        <div class="detail-item">
            <div class="detail-label">Membership Level:</div>
            <div class="detail-value">${levelDisplay}</div>
        </div>`;
  }

  formDetails.innerHTML = detailsHTML;
}
