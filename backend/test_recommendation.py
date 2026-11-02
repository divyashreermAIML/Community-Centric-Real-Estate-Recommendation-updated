
from recommendation import recommend_properties

criteria = {
    "budget": 9000,
    "max_distance": 2,
    "category": "Student",
    "location": "Bangalore",
    "required_amenities": ["Food", "WiFi"],
    "transport_required": True
}

results = recommend_properties(criteria)

print("\nRECOMMENDED PROPERTIES")
print("----------------------")

for property_data in results:

    print("\nProperty:", property_data["name"])
    print("Rent: Rs.", property_data["rent"])
    print("Distance:", property_data["distance"], "km")
    print(
        "Suitability:",
        property_data["suitability_score"], "%"
    )

print("\nTotal recommendations:", len(results))
