
import pandas as pd
from pathlib import Path

# Load the property dataset
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "dataset" / "properties.csv"

WEIGHTS = {
    "budget": 0.30,
    "location": 0.25,
    "amenities": 0.20,
    "transport": 0.15,
    "community": 0.10
}


def load_properties():
    """Load property records from the CSV file."""
    return pd.read_csv(DATASET_PATH)


def calculate_scores(property_data, budget, max_distance,
                     required_amenities, transport_required):
    """Calculate the five-factor suitability score."""

    # Budget score
    rent_ratio = property_data["rent"] / budget

    if rent_ratio <= 0.75:
        budget_score = 100
    elif rent_ratio <= 0.85:
        budget_score = 85
    elif rent_ratio <= 0.95:
        budget_score = 70
    else:
        budget_score = 60

    # Location score
    distance = float(property_data["distance"])

    location_score = max(
        0,
        100 * (1 - distance / max_distance)
    )

    # Amenities score
    available_amenities = str(
        property_data["amenities"]
    ).split(";")

    if required_amenities:
        matched = sum(
            1 for amenity in required_amenities
            if amenity in available_amenities
        )

        amenities_score = (
            matched / len(required_amenities)
        ) * 100
    else:
        amenities_score = 100

    # Transport score
    if transport_required:
        transport_score = (
            100 if property_data["transport"] == "Yes" else 0
        )
    else:
        transport_score = 100

    # Community score
    community_score = float(
        property_data["community_score"]
    )

    # Final weighted score
    final_score = (
        budget_score * WEIGHTS["budget"]
        + location_score * WEIGHTS["location"]
        + amenities_score * WEIGHTS["amenities"]
        + transport_score * WEIGHTS["transport"]
        + community_score * WEIGHTS["community"]
    )

    return {
        "budget_score": round(budget_score, 2),
        "location_score": round(location_score, 2),
        "amenities_score": round(amenities_score, 2),
        "transport_score": round(transport_score, 2),
        "community_score": round(community_score, 2),
        "suitability_score": round(final_score, 2)
    }


def recommend_properties(criteria):
    """Filter, score and rank suitable properties."""

    budget = float(criteria["budget"])
    max_distance = float(criteria["max_distance"])

    if budget <= 0 or max_distance <= 0:
        raise ValueError("Budget and distance must be greater than zero.")

    category = criteria.get("category", "Any")
    location = criteria.get("location", "").strip().lower()

    required_amenities = criteria.get(
        "required_amenities", []
    )

    transport_required = criteria.get(
        "transport_required", False
    )

    if not isinstance(required_amenities, list):
        raise ValueError("Required amenities must be a list.")

    properties = load_properties()

    # Filter by budget
    properties = properties[
        properties["rent"] <= budget
    ]

    # Filter by maximum distance
    properties = properties[
        properties["distance"] <= max_distance
    ]

    # Filter by category
    if category != "Any":
        properties = properties[
            properties["category"].str.lower()
            == category.lower()
        ]

    # Filter by location, if provided
    if location:
        properties = properties[
            properties["location"].str.lower().str.contains(
                location, na=False
            )
        ]

    # Filter by transport
    if transport_required:
        properties = properties[
            properties["transport"] == "Yes"
        ]

    results = []

    for _, property_data in properties.iterrows():

        scores = calculate_scores(
            property_data,
            budget,
            max_distance,
            required_amenities,
            transport_required
        )

        result = property_data.to_dict()
        result.update(scores)

        results.append(result)

    # Rank properties from highest score to lowest
    results.sort(
        key=lambda item: item["suitability_score"],
        reverse=True
    )

    return results
