
from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation import recommend_properties

app = Flask(__name__)

# Allow frontend to communicate with Flask
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Community-Centric Real Estate API is running"
    })


@app.route("/api/recommend", methods=["POST"])
def get_recommendations():

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Please provide search details."
            }), 400

        # Read user preferences
        budget = data.get("budget")
        max_distance = data.get("max_distance")

        if budget is None or max_distance is None:
            return jsonify({
                "error": "Budget and maximum distance are required."
            }), 400

        criteria = {
            "budget": budget,
            "max_distance": max_distance,
            "category": data.get("category", "Any"),
            "location": data.get("location", ""),
            "required_amenities": data.get(
                "required_amenities", []
            ),
            "transport_required": data.get(
                "transport_required", False
            )
        }

        recommendations = recommend_properties(criteria)

        return jsonify({
            "success": True,
            "total_recommendations": len(recommendations),
            "recommendations": recommendations
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception as error:
        app.logger.exception("Recommendation API failed")

        return jsonify({
            "error": "Something went wrong while finding properties."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
