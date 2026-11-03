
// ======================================
// COMMUNITY REAL ESTATE ANALYTICS
// ======================================

const properties = [
    { id: 1, name: "Green Nest PG", category: "Student", rent: 8500, distance: 1.2, amenities: "Food, WiFi, CCTV", transport: "Yes", community: 85, suitability: 74.50, status: "Pending" },
    { id: 2, name: "City Comfort PG", category: "Student", rent: 7000, distance: 3.5, amenities: "WiFi, CCTV", transport: "Yes", community: 75, suitability: null, status: "Pending" },
    { id: 3, name: "Student Home PG", category: "Student", rent: 8800, distance: 0.8, amenities: "Food, WiFi, CCTV", transport: "Yes", community: 90, suitability: 77.00, status: "Pending" },
    { id: 4, name: "Sunrise PG", category: "Student", rent: 8000, distance: 2.0, amenities: "Food, CCTV", transport: "No", community: 80, suitability: null, status: "Pending" },
    { id: 5, name: "Campus Stay PG", category: "Student", rent: 9000, distance: 1.5, amenities: "Food, WiFi", transport: "Yes", community: 88, suitability: 68.05, status: "Pending" },
    { id: 6, name: "Green Valley Apartment", category: "Residential", rent: 15000, distance: 2.5, amenities: "Parking, WiFi, Security", transport: "Yes", community: 82, suitability: null, status: "Pending" },
    { id: 7, name: "Urban Living Flat", category: "Residential", rent: 18000, distance: 1.8, amenities: "Lift, Parking, Security", transport: "Yes", community: 87, suitability: null, status: "Pending" },
    { id: 8, name: "City Business Hub", category: "Commercial", rent: 25000, distance: 4.0, amenities: "Parking, Security", transport: "Yes", community: 78, suitability: null, status: "Pending" },
    { id: 9, name: "Metro Office Space", category: "Commercial", rent: 35000, distance: 1.5, amenities: "Parking, WiFi, Security", transport: "Yes", community: 86, suitability: null, status: "Pending" },
    { id: 10, name: "Family Comfort Home", category: "Residential", rent: 22000, distance: 3.0, amenities: "Parking, Security, Lift", transport: "Yes", community: 91, suitability: null, status: "Pending" }
];

// ======================================
// OVERVIEW CARDS
// ======================================

const categories = ["Student", "Residential", "Commercial"];

const categoryCounts = categories.map(category =>
    properties.filter(p => p.category === category).length
);

document.getElementById("totalCount").textContent = properties.length;
document.getElementById("studentCount").textContent = categoryCounts[0];
document.getElementById("residentialCount").textContent = categoryCounts[1];
document.getElementById("commercialCount").textContent = categoryCounts[2];

// ======================================
// CATEGORY CHARTS
// ======================================

if (typeof Chart !== "undefined") {

    new Chart(document.getElementById("categoryChart"), {
        type: "bar",
        data: {
            labels: categories,
            datasets: [{
                label: "Number of Properties",
                data: categoryCounts,
                backgroundColor: ["#27865D", "#E5A13B", "#4786C6"],
                borderRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });

    new Chart(document.getElementById("categoryPieChart"), {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: categoryCounts,
                backgroundColor: ["#27865D", "#E5A13B", "#4786C6"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

}

// ======================================
// PROPERTY SELECTION
// ======================================

const selection = document.getElementById("propertySelection");

properties.forEach(property => {

    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "property-check";
    checkbox.value = property.id;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + property.name));

    selection.appendChild(label);
    selection.appendChild(document.createElement("br"));

});

// ======================================
// PROPERTY COMPARISON
// ======================================

const compareBtn = document.getElementById("compareBtn");

compareBtn.addEventListener("click", function () {

    const selectedIds = Array.from(
        document.querySelectorAll(".property-check:checked")
    ).map(item => Number(item.value));

    const message = document.getElementById("comparisonMessage");
    const result = document.getElementById("comparisonResult");

    result.innerHTML = "";

    if (selectedIds.length < 2) {
        message.textContent = "Please select at least two properties.";
        message.style.color = "red";
        return;
    }

    const selectedProperties = properties.filter(property =>
        selectedIds.includes(property.id)
    );

    message.textContent = "Property Comparison Results";
    message.style.color = "#174d38";

    const features = [
        ["Category", p => p.category],
        ["Monthly Rent", p => "₹" + p.rent.toLocaleString("en-IN")],
        ["Distance", p => p.distance + " km"],
        ["Amenities", p => p.amenities],
        ["Transport", p => p.transport],
        ["Community Score", p => p.community + "/100"],
        ["Suitability Score", p =>
            p.suitability === null ? "Not calculated" : p.suitability + "%"],
        ["Verification Status", p => p.status]
    ];

    let table = `
        <div class="table-container">
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Feature</th>
                    ${selectedProperties.map(p => `<th>${p.name}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
    `;

    features.forEach(([feature, getValue]) => {

        table += `<tr><th>${feature}</th>`;

        selectedProperties.forEach(property => {
            table += `<td>${getValue(property)}</td>`;
        });

        table += "</tr>";

    });

    table += `
            </tbody>
        </table>
        </div>
    `;

    result.innerHTML = table;

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});
