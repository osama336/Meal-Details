import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // fixed import (usually .min.css)

export default function MealDetails({ mealId, close }) {
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        if (res.data.meals && res.data.meals[0]) {
          setMeal(res.data.meals[0]);
        }
      } catch (error) {
        console.error("Failed to fetch meal:", error);
      }
    };

    if (mealId) {
      fetchMeal();
    }
  }, [mealId]);

  if (!meal) {
    return <div className="text-center p-5">Loading meal details...</div>;
  }

  // Collect ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      const displayMeasure = measure && measure.trim() !== "" ? measure : "";
      ingredients.push(
        displayMeasure ? `${ingredient} - ${displayMeasure}` : ingredient
      );
    }
  }

  return (
    <div
      className="modal show fade"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{meal.strMeal}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={close}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <img
              src={meal.strMealThumb}
              className="img-fluid mb-4 d-block mx-auto"
              style={{ borderRadius: "12px", maxHeight: "400px", objectFit: "cover" }}
              alt={meal.strMeal}
            />

            <h4>Ingredients</h4>
            {ingredients.length > 0 ? (
              <ul className="list-group list-group-flush mb-4">
                {ingredients.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed.</p>
            )}

            <h4 className="mt-4">Instructions</h4>
            <p style={{ whiteSpace: "pre-line" }}>{meal.strInstructions}</p>

            {meal.strYoutube && (
              <div className="mt-4">
                <h5>YouTube Tutorial</h5>
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-danger"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}