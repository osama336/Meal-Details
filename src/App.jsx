import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import MealDetails from './MealDetails'
function App() {
  const [meals, setMeals] = useState([])
  const [selectedMealId, setSelectedMealId] = useState(null)
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchMeals("chicken")
    fetchCategories()
  }, [])
  const fetchMeals = async (query) => {
    try {
     
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error(err);
    } 
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
      );
      setCategories(res.data.meals);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchByCategory = async (category) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <div className='container'>
        <h1 className='text-center my-5'>Amazing Meals</h1>
        <div className="row mb-3 g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchMeals(e.target.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchByCategory(e.target.value);
              }}
            >
              <option value="">Filter by category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat.strCategory}>
                  {cat.strCategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='row'>
          {meals.map((m) =>
            <div key={m.idMeal} style={{ cursor: "pointer" }}
              onClick={() => setSelectedMealId(m.idMeal)}
              className='card mb-4 col-lg-3 col-md-4 
            shadow rounded-3'>
              <img src={m.strMealThumb} alt=""
                className='card-img-top' />
              <h5 className='text-center p-3'>{m.strMeal}</h5>
            </div>)}
          {selectedMealId &&
            <MealDetails mealId={selectedMealId}
              close={() => setSelectedMealId(null)} />
          }
        </div>
      </div>
    </>
  )
}
export default App