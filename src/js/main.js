/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */






console.log("JS  work");



if (typeof Swal !== "undefined") {
  console.log("SweetAlert loaded successfully");
} else {
  console.log("SweetAlert not loaded - fallback to default alert will be used");
}

//  Nutrition API 
class NutritionAPI {
  static BASE_URL = "https://nutriplan-api.vercel.app/api";

  /* 
    Analyze Nutrition for Food Items
  */
  static async analyzeNutrition(foodName, quantity = 100, unit = "g") {
    try {
      let url = `${this.BASE_URL}/nutrition/analyze`;
      console.log("[analyzeNutrition] Analyzing nutrition for:", foodName);
      console.log("[analyzeNutrition] URL:", url);

      let payload = { food: foodName, quantity, unit };
      console.log("[analyzeNutrition] Payload:", payload);

      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("[analyzeNutrition] Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      let data = await response.json();
      console.log("[analyzeNutrition] Received data:", data);

      let nutrition = data.data || data.nutrition || null;
      console.log("[analyzeNutrition] Nutrition analysis:", nutrition);

      return nutrition;
    } catch (error) {
      console.error("[analyzeNutrition] Error:", error.message);
      console.error("[analyzeNutrition] Full details:", error);
      return null;
    }
  }
}

console.log("[NutritionAPI] Loaded successfully");






class MealsAPI {
  static BASE_URL = "https://nutriplan-api.vercel.app/api";

  /* 1. تجلب وجبات عشوائية للرئيسية */
  static async getRandomMeals(count = 3) {
    try {
      let url = `${this.BASE_URL}/meals/random?count=${count}`;
      console.log("[getRandomMeals] Fetching from:", url);

      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let data = await response.json();
      let meals = data.data || data.results || [];
      return meals;
    } catch (error) {
      console.error("[getRandomMeals] Error:", error.message);
      return [];
    }
  }

  /* 2. البحث عن الوجبات بالاسم */
  static async searchMeals(query, page = 1, limit = 25) {
    try {
      let url = `${this.BASE_URL}/meals/search?q=${query}&page=${page}&limit=${limit}`;
      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let data = await response.json();
      let meals = data.data || data.results || [];

      // Filter out any undefined/null/invalid meal objects
      meals = meals.filter(meal => meal && typeof meal === 'object' && meal.strMeal && meal.strMeal !== 'undefined' && meal.strMeal.trim() !== '');

      // If API returns valid meals, return them
      if (meals && meals.length > 0) {
        return meals;
      } else {
        // Use mock data and filter by query if provided
        console.log("[searchMeals] API returned no valid meals, using filtered mock data");
        let mock = this.getMockMeals();
        if (query && query.trim()) {
          mock = mock.filter(meal => meal.strMeal.toLowerCase().includes(query.toLowerCase()));
        }
        return mock;
      }
    } catch (error) {
      console.error("[searchMeals] Error:", error.message);
      console.log("[searchMeals] Using filtered mock data due to API failure");
      // Use mock data and filter by query if provided
      let mock = this.getMockMeals();
      if (query && query.trim()) {
        mock = mock.filter(meal => meal.strMeal.toLowerCase().includes(query.toLowerCase()));
      }
      return mock;
    }
  }

  /* Mock data for when API is unavailable */
  static getMockMeals() {
    return [
      {
        idMeal: "52772",
        strMeal: "Teriyaki Chicken Casserole",
        strCategory: "Chicken",
        strArea: "Japanese",
        strMealThumb: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
        strInstructions: "Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray. Combine soy sauce, ½ cup water, brown sugar, ginger and garlic in a small saucepan and cover. Bring to a boil over medium heat. Remove lid and cook for one minute once boiling. Meanwhile, stir together the cornstarch and 2 tablespoons of water in a separate dish until smooth. Once sauce is boiling, add mixture to the saucepan and stir to combine. Cook until the sauce starts to thicken then remove from heat. Place the chicken breasts in the prepared pan. Pour one cup of the sauce over top of chicken. Place chicken in oven and bake 35 minutes or until cooked through. Remove from oven and shred chicken in the pan using two forks. Meanwhile, steam the vegetables according to package directions and stir together with the cooked brown rice. Add the remaining sauce to the mixture and stir to combine. Serve the chicken over the rice and veggie mixture."
      },
      {
        idMeal: "52802",
        strMeal: "Beef Bourguignon",
        strCategory: "Beef",
        strArea: "French",
        strMealThumb: "https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg",
        strInstructions: "Heat a large casserole dish over a medium heat and add 1 tbsp of the oil. Tip in the shallots and fry for 2-3 mins until just starting to brown. Scoop out with a slotted spoon and set aside. Add the remaining oil to the pan and fry the pancetta cubes, stirring frequently, for 3 mins until golden and crisp. Remove with a slotted spoon and add to the shallots. Pat the beef cubes dry and season with salt and pepper. Brown the beef in batches in the pan, adding a little more oil if needed, until sealed and golden on all sides. Set aside with the shallots and pancetta. Stir in the flour and cook for 1 min until lightly browned. Gradually pour in the wine, stirring well to scrape up any browned bits from the bottom of the pan. Tip in the stock, thyme and bay leaves. Stir well and bring to the boil. Return the beef, shallots and pancetta to the pan and simmer gently for 1 hr. After 1 hr, add the carrots and simmer for another 30 mins until the beef is tender and the sauce has thickened. Meanwhile, melt the butter in a frying pan and fry the mushrooms for 5 mins. Add the mushrooms to the stew and simmer for a further 15 mins. Check the seasoning and serve with mashed potatoes or crusty bread."
      },
      {
        idMeal: "52777",
        strMeal: "Mediterranean Pasta Salad",
        strCategory: "Pasta",
        strArea: "Italian",
        strMealThumb: "https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg",
        strInstructions: "Bring a large saucepan of salted water to the boil. Add the pasta and cook according to packet instructions. Drain and rinse under cold water, then drain again and tip into a large bowl. Add the tomatoes, olives, feta, cucumber, red onion and parsley. Drizzle over the olive oil and toss everything together. Season with salt and pepper and serve."
      }
    ];
  }

  /* 3. الفلترة حسب الـ Category */
  static async getMealsByCategory(category, page = 1, limit = 25) {
    try {
      let url = `${this.BASE_URL}/meals/filter?category=${category}&page=${page}&limit=${limit}`;
      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let data = await response.json();
      return data.data || data.results || [];
    } catch (error) {
      console.error("[getMealsByCategory] Error:", error.message);
      return [];
    }
  }

  /* 4. تجلب تفاصيل وجبة محددة بالـ ID */
  static async getMealDetails(id) {
    try {
      let url = `${this.BASE_URL}/meals/${id}`;
      console.log("[getMealDetails] Fetching details for ID:", id);

      let response = await fetch(url);
      if (!response.ok) throw new Error("Meal not found");

      let data = await response.json();
      console.log("[getMealDetails] Raw API response:", data);

      // Extract meal data from the result property if it exists
      let meal = data.result || data.data || data.meal || data;
      console.log("[getMealDetails] Extracted meal object:", meal);

      // Normalize the meal object to expected structure
      if (meal && typeof meal === 'object') {
        meal = {
          idMeal: meal.idMeal || meal.id,
          strMeal: meal.strMeal || meal.name || meal.title,
          strMealThumb: meal.strMealThumb || meal.image || meal.thumbnail,
          strCategory: meal.strCategory || meal.category,
          strArea: meal.strArea || meal.area || meal.origin,
          strInstructions: meal.strInstructions || meal.instructions || meal.description,
          calories: meal.calories || 485,
          protein: meal.protein || 42,
          carbs: meal.carbs || 52,
          fat: meal.fat || 8,
        };

        // Handle array instructions
        if (Array.isArray(meal.strInstructions)) {
          meal.strInstructions = meal.strInstructions.join(' ');
        }
      }

      console.log("[getMealDetails] Normalized meal object:", meal);
      return meal;
    } catch (error) {
      console.error("[getMealDetails] Error:", error.message);
      return null;
    }
  }

  /* 5. Get meal categories */
  static async getCategories() {
    try {
      let url = `${this.BASE_URL}/meals/categories`;
      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let data = await response.json();
      let categories = data.data || data.categories || data.results || [];

      // If API returns empty or invalid data, use mock data
      if (!categories || categories.length === 0) {
        console.log("[getCategories] API returned empty data, using mock data");
        return this.getMockCategories();
      }

      return categories;
    } catch (error) {
      console.error("[getCategories] Error:", error.message);
      console.log("[getCategories] Using mock data due to API failure");
      return this.getMockCategories();
    }
  }

  /* Mock categories for when API is unavailable */
  static getMockCategories() {
    return [
      { strCategory: "Beef" },
      { strCategory: "Chicken" },
      { strCategory: "Dessert" },
      { strCategory: "Lamb" },
      { strCategory: "Miscellaneous" },
      { strCategory: "Pasta" },
      { strCategory: "Pork" },
      { strCategory: "Seafood" },
      { strCategory: "Side" },
      { strCategory: "Starter" },
      { strCategory: "Vegan" },
      { strCategory: "Vegetarian" },
      { strCategory: "Breakfast" }
    ];
  }

  /* 6. Get meal areas */
  static async getAreas() {
    try {
      let url = `${this.BASE_URL}/meals/areas`;
      let response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let data = await response.json();
      return data.data || data.areas || [];
    } catch (error) {
      console.error("[getAreas] Error:", error.message);
      return [];
    }
  }
}

// Products API
class ProductsAPI {
  static BASE_URL = "https://nutriplan-api.vercel.app/api";

  static async searchProducts(query, page = 1, limit = 24) {
    try {
      let url = `${this.BASE_URL}/products/search?q=${query}&page=${page}&limit=${limit}`;
      let res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      let data = await res.json();
      return data.results || data.data || data.products || [];
    } catch (error) {
      console.error("[searchProducts] Error:", error.message);
      return [];
    }
  }

  static async getCategories() {
    try {
      let url = `${this.BASE_URL}/products/categories`;
      let res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      let data = await res.json();
      return data.data || data.categories || data.results || [];
    } catch (error) {
      console.error("[getCategories] Error:", error.message);
      return [];
    }
  }

  static async searchByBarcode(barcode) {
    try {
      let url = `${this.BASE_URL}/products/barcode/${barcode}`;
      let res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      let data = await res.json();
      return data.data || data.product || null;
    } catch (error) {
      console.error("[searchByBarcode] Error:", error.message);
      return null;
    }
  }
}



/*  DOM Helpers  */
let $ = (id) => document.getElementById(id);

/*  Categories  */
async function loadProductCategories() {
  console.log("[loadProductCategories] Loading product categories");
  let container = $("product-categories");
  if (!container) {
    console.error("[loadProductCategories] Container not found");
    return;
  }

  console.log("[loadProductCategories] Container found");
  let categories = await ProductsAPI.getCategories();
  console.log(`[loadProductCategories] Number of categories received: ${categories.length}`);
  console.log("[loadProductCategories] First category structure:", categories[0]);

  // Clear old buttons
  container.innerHTML = "";
  console.log("[loadProductCategories] Old buttons cleared");

  if (categories.length === 0) {
    console.log("[loadProductCategories] No categories found");
    return;
  }

  categories.forEach((cat, index) => {
    let categoryName = typeof cat === "string" ? cat : (cat.name || cat.title || cat.category || JSON.stringify(cat));
    let categoryId = typeof cat === "object" ? (cat.id || cat._id || index) : index;

    console.log(`[loadProductCategories] Category #${index + 1}:`, categoryName);

    let btn = document.createElement("button");
    btn.className =
      "product-category-btn px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-emerald-200 transition whitespace-nowrap";
    btn.textContent = categoryName;
    btn.dataset.category = categoryName;

    btn.addEventListener("click", () => {
      console.log("[loadProductCategories] Category clicked:", categoryName);
      // Update active state
      document.querySelectorAll(".product-category-btn").forEach(b => {
        b.classList.remove("bg-emerald-500", "text-white");
        b.classList.add("bg-gray-100");
      });
      btn.classList.remove("bg-gray-100");
      btn.classList.add("bg-emerald-500", "text-white");

      searchProducts(categoryName);
    });

    container.appendChild(btn);
  });

  console.log("[loadProductCategories] All categories loaded");
}

/*  Render Products  */
function renderProducts(products) {
  console.log("[renderProducts] Rendering products");
  let grid = $("products-grid");
  let count = $("products-count");

  if (!grid || !count) {
    console.error("[renderProducts] Grid or count element not found");
    return;
  }

  console.log(`[renderProducts] Number of products: ${products.length}`);
  grid.innerHTML = "";
  count.textContent = `Found ${products.length} products`;

  if (products.length === 0) {
    console.log("[renderProducts] No products found");
    grid.innerHTML = `
      <div class="col-span-full text-center text-gray-500 py-10">
        No products found
      </div>
    `;
    return;
  }

  products.forEach((p, index) => {
    console.log(`[renderProducts] Product #${index + 1}:`, p.name);
    let div = document.createElement("div");
    div.className =
      "bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden";

    div.innerHTML = `
      <div class="h-40 bg-gray-100 flex items-center justify-center">
        <img src="${p.image || ""}" class="h-full object-contain" />
      </div>

      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1">
          ${p.brand || "Unknown Brand"}
        </p>

        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
          ${p.name}
        </h3>

        <div class="grid grid-cols-4 gap-2 text-center text-xs">
          <div class="bg-emerald-50 p-1 rounded">
            <b>${p.protein || 0}g</b><br/>Protein
          </div>
          <div class="bg-blue-50 p-1 rounded">
            <b>${p.carbs || 0}g</b><br/>Carbs
          </div>
          <div class="bg-purple-50 p-1 rounded">
            <b>${p.fat || 0}g</b><br/>Fat
          </div>
          <div class="bg-orange-50 p-1 rounded">
            <b>${p.calories || 0}</b><br/>Kcal
          </div>
        </div>
      </div>
    `;

    grid.appendChild(div);
  });

  console.log("[renderProducts] All products rendered");
}

/*  Search Logic  */
async function searchProducts(query) {
  console.log("[searchProducts] Searching for:", query);
  if (!query) {
    console.log("[searchProducts] Query is empty!");
    return;
  }

  let countEl = $("products-count");
  if (countEl) {
    console.log("[searchProducts] Updating loading status...");
    countEl.textContent = "Loading...";
  }

  console.log("[searchProducts] Fetching data from API...");
  let products = await ProductsAPI.searchProducts(query);
  console.log(`[searchProducts] Number of products received: ${products.length}`);
  console.log("[searchProducts] Rendering products in UI...");
  renderProducts(products);
  console.log("[searchProducts] Search completed");
}

/*  Events  */
function bindProductSearch() {
  console.log("[bindProductSearch] Binding product search events");
  let input = $("product-search-input");
  let btn = $("search-product-btn");

  if (!input) console.error("[bindProductSearch] product-search-input not found");
  if (!btn) console.error("[bindProductSearch] search-product-btn not found");
  if (!input || !btn) {
    console.error("[bindProductSearch] Search elements missing");
    return;
  }

  console.log("[bindProductSearch] Search elements found");

  btn.addEventListener("click", () => {
    let q = input.value.trim();
    console.log("[bindProductSearch] Searching for:", q);
    searchProducts(q);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let q = input.value.trim();
      console.log("[bindProductSearch] Searching via Enter key:", q);
      searchProducts(q);
    }
  });

  console.log("[bindProductSearch] All events bound");
}

/*  Init  */
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Init Products] Initializing product page");
  loadProductCategories();
  bindProductSearch();
  console.log("[Init Products] Initialization completed");
});

let getElementById = (id) => {
  console.log(`[getElementById] Searching for element: "${id}"`);
  let element = document.getElementById(id);
  if (element) {
    console.log("Found element ");
  } else {
    console.log("Element not found ");
  }
  return element;
};

/* FoodLog Class */
class FoodLog {
  constructor() {
    console.log("[FoodLog.constructor] Creating FoodLog object");
    try {
      let storedData = localStorage.getItem("foodLog");
      this.items = storedData ? JSON.parse(storedData) : [];
      console.log(`   Loaded ${this.items.length} items from localStorage`);
      if (this.items.length > 0) {
        console.log("   Loaded items:", this.items);
      }
    } catch (error) {
      console.error("[FoodLog.constructor] Error loading from localStorage:", error.message);
      console.log("[FoodLog.constructor] Initializing with empty array");
      this.items = [];
    }
  }

  add(item) {
    console.log("[FoodLog.add] Adding new item");
    console.log(`   - Name: ${item.name}`);
    console.log(`   - Calories: ${item.calories}`);
    console.log(`   - Protein: ${item.protein}g`);
    console.log(`   - Carbs: ${item.carbs}g`);
    console.log(`   - Fat: ${item.fat}g`);

    let newItem = {
      ...item,
      date: new Date().toDateString(),
    };

    console.log(`   - Date: ${newItem.date}`);
    this.items.push(newItem);
    console.log(`   Total items now: ${this.items.length}`);
    this.save();
  }

  clear() {
    console.log("[FoodLog.clear] Removing all items");
    console.log(`   Items before clear: ${this.items.length}`);
    this.items = [];
    console.log("   All items removed");
    this.save();
  }

  save() {
    console.log("[FoodLog.save] Saving data to localStorage");
    try {
      localStorage.setItem("foodLog", JSON.stringify(this.items));
      console.log(`   Successfully saved ${this.items.length} items`);
    } catch (e) {
      console.error("   Failed to save:", e.message);
    }
  }

  getTodayItems() {
    let today = new Date().toDateString();
    console.log(`[FoodLog.getTodayItems] Getting today's items: ${today}`);

    let items = this.items.filter((i) => {
      console.log(`   Checking: ${i.name} (Date: ${i.date})`);
      return i.date === today;
    });

    console.log(`   Found ${items.length} items for today`);
    return items;
  }

  getSummary() {
    console.log("[FoodLog.getSummary] Calculating daily nutrition summary");

    let todayItems = this.getTodayItems();
    console.log(`   Number of meals: ${todayItems.length}`);

    let summary = todayItems.reduce(
      (acc, item) => {
        console.log(`   Aggregating: ${item.name}`);
        console.log(`     Calories: ${acc.calories} + ${item.calories || 0} = ${acc.calories + (item.calories || 0)}`);
        console.log(`     Protein: ${acc.protein} + ${item.protein || 0} = ${acc.protein + (item.protein || 0)}`);
        console.log(`     Carbs: ${acc.carbs} + ${item.carbs || 0} = ${acc.carbs + (item.carbs || 0)}`);
        console.log(`     Fat: ${acc.fat} + ${item.fat || 0} = ${acc.fat + (item.fat || 0)}`);

        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    console.log("   Final summary:", summary);
    return summary;
  }
}

/* App Class */
class App {
  constructor() {
    console.log("[App.constructor] Creating App object");

    this.foodLog = new FoodLog();
    this.currentMeal = null;

    this.sections = {
      home: [
        "search-filters-section",
        "meal-categories-section",
        "all-recipes-section",
      ],
      meal: ["meal-details"],
      products: ["products-section"],
      foodlog: ["foodlog-section"],
    };

    console.log("   Sections initialized:", Object.keys(this.sections));
    this.init();
  }

  init() {
    console.log("[App.init] Initializing main app");
    window.addEventListener("hashchange", () => {
      console.log("[App.hashchange] URL hash changed");
      this.router();
    });
    console.log("[App.init] Hashchange listener bound");

    this.router();
    this.bindUI();
    this.updateFoodLogUI();

    console.log("[App.init] Main initialization completed");
  }


  hideAllSections() {
    console.log("[hideAllSections] Hiding all sections");
    Object.values(this.sections)
      .flat()
      .forEach((id) => {
        let el = $(id);
        if (el) {
          el.style.display = "none";
          console.log(`  Hidden: ${id}`);
        }
      });
  }

  show(sectionKey) {
    console.log("[show] Displaying section:", sectionKey);
    this.hideAllSections();
    this.sections[sectionKey].forEach((id) => {
      let el = $(id);
      if (el) {
        el.style.display = "block";
        console.log(`  Shown: ${id}`);
      }
    });
  }

  loadMealDetails(hash) {
    let params = new URLSearchParams(hash.split("?")[1]);
    let mealId = params.get("id");
    console.log("[loadMealDetails] Fetching meal details:", mealId);

    if (!mealId || mealId === "undefined") {
      console.log("[loadMealDetails] Meal ID not found or invalid");
      return;
    }

    console.log("[loadMealDetails] Calling API...");
    MealsAPI.getMealDetails(mealId).then((meal) => {
      if (meal && typeof meal === 'object') {
        this.currentMeal = meal;
        let mealName = meal.strMeal || meal.name || "Unknown";
        console.log("[loadMealDetails] Meal data loaded:", mealName);
        console.log("[loadMealDetails] Loaded data:", {
          name: mealName,
          category: meal.strCategory || meal.category || "N/A",
          area: meal.strArea || meal.area || "N/A",
          image: meal.strMealThumb || meal.image || "N/A"
        });

        // Update the meal details UI
        this.updateMealDetailsUI(meal);
      } else {
        console.error("[loadMealDetails] Failed to load meal - invalid data:", meal);
      }
    }).catch((error) => {
      console.error("[loadMealDetails] Error fetching meal:", error.message);
    });
  }

  router() {
    let hash = location.hash.replace("#", "");
    console.log("[router] Handling route:", hash || "home");

    if (hash.startsWith("meal")) {
      console.log("[router] Navigating to: meal details");
      this.show("meal");
      this.loadMealDetails(hash);
    } else if (hash === "products") {
      console.log("[router] Navigating to: products");
      this.show("products");
    } else if (hash === "foodlog") {
      console.log("[router] Navigating to: foodlog");
      this.show("foodlog");
      this.updateFoodLogUI();
    } else {
      console.log("[router] Navigating to: home (default)");
      this.show("home");
    }
  }

  bindUI() {
    console.log("[bindUI] Binding all UI events");

    // Sidebar Navigation Links
    console.log("[bindUI] Binding sidebar navigation buttons");
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        let text = link.innerText.toLowerCase();
        console.log(`[Sidebar Click] Clicked on: "${text}"`);

        if (text.includes("product")) {
          console.log("[Navigation] Go to Products");
          location.hash = "products";
        } else if (text.includes("food")) {
          console.log("[Navigation] Go to Food Log");
          location.hash = "foodlog";
        } else {
          console.log("[Navigation] Go to Home");
          location.hash = "home";
        }
      });
    });
    console.log("[bindUI] Sidebar navigation buttons bound");

    // Recipe Card Click Handler
    console.log("[bindUI] Binding recipe card click events");
    document.addEventListener("click", (e) => {
      let card = e.target.closest(".recipe-card");
      if (card) {
        let id = card.dataset.mealId;
        let name = card.dataset.mealName || "Unknown";
        console.log(`[Recipe Click] Clicked on meal: ${name} (ID: ${id})`);
        location.hash = `meal?id=${id}`;
      }
    });
    console.log("[bindUI] Recipe card click events bound");

    // Log Meal Button
    console.log("[bindUI] Binding Log Meal button");
    $("log-meal-btn")?.addEventListener("click", async () => {
      console.log("[Log Meal Button] Clicked Log Meal button");

      if (this.currentMeal) {
        // Check if nutrition data is missing and fetch from API if needed
        if (!this.currentMeal.calories || !this.currentMeal.protein || !this.currentMeal.carbs || !this.currentMeal.fat) {
          console.log("[Log Meal] Nutrition data missing, calling NutritionAPI...");
          let nutrition = await NutritionAPI.analyzeNutrition(this.currentMeal.strMeal, 100, "g");
          if (nutrition) {
            this.currentMeal.calories = nutrition.calories || this.currentMeal.calories || 485;
            this.currentMeal.protein = nutrition.protein || this.currentMeal.protein || 42;
            this.currentMeal.carbs = nutrition.carbs || this.currentMeal.carbs || 52;
            this.currentMeal.fat = nutrition.fat || this.currentMeal.fat || 8;
            console.log("[Log Meal] Nutrition data updated from API");
          } else {
            console.log("[Log Meal] API failed, using defaults");
          }
        }
      }

      let meal = this.currentMeal ? {
        id: this.currentMeal.idMeal,
        name: this.currentMeal.strMeal,
        category: this.currentMeal.strCategory,
        area: this.currentMeal.strArea,
        calories: this.currentMeal.calories || 485,
        protein: this.currentMeal.protein || 42,
        carbs: this.currentMeal.carbs || 52,
        fat: this.currentMeal.fat || 8,
        image: this.currentMeal.strMealThumb,
      } : {
        name: "Teriyaki Chicken",
        calories: 485,
        protein: 42,
        carbs: 52,
        fat: 8,
      };

      console.log(`[Log Meal] Preparing to log meal: ${meal.name}`);
      console.log(` - Calories: ${meal.calories}`);
      console.log(` - Protein: ${meal.protein}g`);
      console.log(` - Carbs: ${meal.carbs}g`);
      console.log(` - Fat: ${meal.fat}g`);

      // Show SweetAlert confirmation first
      try {
        if (typeof Swal !== "undefined" && Swal) {
          console.log("[Log Meal] Showing SweetAlert confirmation");
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success ml-auto",
              cancelButton: "btn btn-danger mr-auto",
              actions: "flex justify-between w-full"
            },
            buttonsStyling: false
          });

          
          const style = document.createElement('style');
          style.innerHTML = `
                                                        
          .swal-confirm-btn {
          background-color: #18471a; /* أخضر */
         color: white;
         padding: 10px 20px;
         margin-left: 10px; /* المسافة بين الزرين */
         border: none;
         border-radius: 5px;
         cursor: pointer;
         font-weight: bold;
        }
        .swal-cancel-btn {
        background-color: #ca2f24; /* أحمر */
       color: white;
       padding: 10px 20px;
       border: none;
       border-radius: 5px;
       cursor: pointer;
      font-weight: bold;
      }
    .swal-confirm-btn:hover {
    background-color: #45a049;
   }
  .swal-cancel-btn:hover {
   background-color: #da190b; 
   }`;
        
    
          document.head.appendChild(style);
          
          swalWithBootstrapButtons.fire({
            title: "Are you sure you want to log this meal?",
            text: `"${meal.name}" will be added to your food log`,
            icon: "question",
            showCancelButton: true,

            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, log it!",

            customClass: {
              confirmButton: 'swal-confirm-btn',
              cancelButton: 'swal-cancel-btn'
            },

            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Only log the meal if user confirms
              console.log("[Log Meal] User confirmed - logging meal");
              this.foodLog.add(meal);
              console.log("[Log Meal] Meal added to log");

              // Save to local storage
              localStorage.setItem("loggedMeal", JSON.stringify(meal));
              console.log("[Log Meal] Meal saved to local storage");

              this.updateFoodLogUI();

              // Show success notification
              swalWithBootstrapButtons.fire({
                title: "Logged!",
                text: `"${meal.name}" has been added to your food log`,
                icon: "success"
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              console.log("[Log Meal] User cancelled - meal not logged");
              // No action needed, meal was not logged
            }
          });
        } else {
          console.log("[Log Meal] SweetAlert not available - using alert");
          // Fallback to simple confirm dialog
          if (confirm(`Log "${meal.name}" to your food log?`)) {
            this.foodLog.add(meal);
            console.log("[Log Meal] Meal added to log");

            localStorage.setItem("loggedMeal", JSON.stringify(meal));
            console.log("[Log Meal] Meal saved to local storage");

            this.updateFoodLogUI();
            alert(`"${meal.name}" has been logged successfully!`);
          } else {
            console.log("[Log Meal] User cancelled - meal not logged");
          }
        }
      } catch (error) {
        console.error("[Log Meal] Error showing confirmation:", error.message);
        // Fallback - still log the meal but show error
        this.foodLog.add(meal);
        this.updateFoodLogUI();
        localStorage.setItem("loggedMeal", JSON.stringify(meal));
        alert(`"${meal.name}" has been logged successfully!`);
      }
    });
    console.log("[bindUI] Log Meal button bound");

    // Clear FoodLog Button
    console.log("[bindUI] Binding Clear FoodLog button");
    $("clear-foodlog")?.addEventListener("click", () => {
      console.log("[Clear FoodLog Button] Clicked Clear button");
      console.log("[Clear FoodLog] Clearing all items");
      this.foodLog.clear();
      console.log("[Clear FoodLog] Log cleared");
      this.updateFoodLogUI();
      console.log("[Clear FoodLog] UI updated");
    });
    console.log("[bindUI] Clear FoodLog button bound");

    // Back to Meals Button
    console.log("[bindUI] Binding Back to Meals button");
    $("back-to-meals-btn")?.addEventListener("click", () => {
      console.log("[Back to Meals Button] Clicked Back to Meals button");
      location.hash = "home";
    });
    console.log("[bindUI] Back to Meals button bound");

    console.log("[bindUI] All UI events bound successfully");
  }

  updateFoodLogUI() {
    console.log("[updateFoodLogUI] Updating food log UI");

    let list = $("logged-items-list");
    if (!list) {
      console.error("[updateFoodLogUI] logged-items-list element not found");
      return;
    }

    let items = this.foodLog.getTodayItems();
    let summary = this.foodLog.getSummary();

    console.log(`[updateFoodLogUI] Number of meals today: ${items.length}`);
    console.log("[updateFoodLogUI] Summary:", summary);

    list.innerHTML = "";

    if (items.length === 0) {
      console.log("[updateFoodLogUI] No meals logged today");
      list.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3"></i>
                <p>No meals logged today</p>
            </div>`;
      $("clear-foodlog").style.display = "none";
      console.log("[updateFoodLogUI] Hide clear button");
      this.updateProgressBars(summary);
      return;
    }

    $("clear-foodlog").style.display = "block";
    console.log("[updateFoodLogUI] Show clear button");

    items.forEach((item, index) => {
      console.log(`  [Item ${index + 1}] Name: ${item.name}, Calories: ${item.calories}`);
      console.log(`     - Protein: ${item.protein || 0}g, Carbs: ${item.carbs || 0}g, Fat: ${item.fat || 0}g`);

      let div = document.createElement("div");
      div.className = "flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm";
      div.innerHTML = `
            <div class="flex-1">
                <p class="font-semibold text-gray-900">${item.name}</p>
                <p class="text-xs text-gray-500">P: ${item.protein || 0}g | C: ${item.carbs || 0}g | F: ${item.fat || 0}g</p>
            </div>
            <span class="font-semibold text-emerald-600 ml-4">${item.calories} kcal</span>
        `;
      list.appendChild(div);
      console.log("     Item added to UI");
    });

    this.updateProgressBars(summary);
    console.log("[updateFoodLogUI] Update completed");
  }

  updateProgressBars(summary) {
    console.log("[updateProgressBars] Updating progress bars");

    let targets = {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 65
    };

    console.log(`   Targets: Calories=${targets.calories}, Protein=${targets.protein}g, Carbs=${targets.carbs}g, Fat=${targets.fat}g`);
    console.log(`   Current: Calories=${summary.calories}, Protein=${summary.protein}g, Carbs=${summary.carbs}g, Fat=${summary.fat}g`);

    // Save today's nutrition summary to local storage
    let todayNutrition = {
      date: new Date().toDateString(),
      summary: summary,
      targets: targets
    };
    localStorage.setItem("todayNutrition", JSON.stringify(todayNutrition));
    console.log("[updateProgressBars] Today's nutrition saved to local storage");

    // Update Calories
    let caloriesPercent = Math.min((summary.calories / targets.calories) * 100, 100);
    let caloriesBar = document.querySelector(".bg-emerald-500");
    let caloriesText = document.querySelector(".bg-emerald-50 .text-gray-500");
    if (caloriesBar && caloriesText) {
      caloriesBar.style.width = caloriesPercent + "%";
      caloriesText.textContent = `${summary.calories} / ${targets.calories} kcal`;
      console.log(`   Calories: ${caloriesPercent.toFixed(1)}% (${summary.calories}/${targets.calories})`);
    }

    // Update Protein
    let proteinPercent = Math.min((summary.protein / targets.protein) * 100, 100);
    let proteinBars = document.querySelectorAll("div.bg-blue-50 .bg-blue-500");
    let proteinText = document.querySelectorAll("div.bg-blue-50 .text-gray-500");
    if (proteinBars[0] && proteinText[0]) {
      proteinBars[0].style.width = proteinPercent + "%";
      proteinText[0].textContent = `${summary.protein} / ${targets.protein} g`;
      console.log(`   Protein: ${proteinPercent.toFixed(1)}% (${summary.protein}/${targets.protein}g)`);
    }

    // Update Carbs
    let carbsPercent = Math.min((summary.carbs / targets.carbs) * 100, 100);
    let carbsBars = document.querySelectorAll("div.bg-amber-50 .bg-amber-500");
    let carbsText = document.querySelectorAll("div.bg-amber-50 .text-gray-500");
    if (carbsBars[0] && carbsText[0]) {
      carbsBars[0].style.width = carbsPercent + "%";
      carbsText[0].textContent = `${summary.carbs} / ${targets.carbs} g`;
      console.log(`   Carbs: ${carbsPercent.toFixed(1)}% (${summary.carbs}/${targets.carbs}g)`);
    }

    // Update Fat
    let fatPercent = Math.min((summary.fat / targets.fat) * 100, 100);
    let fatBars = document.querySelectorAll("div.bg-purple-50 .bg-purple-500");
    let fatText = document.querySelectorAll("div.bg-purple-50 .text-gray-500");
    if (fatBars[0] && fatText[0]) {
      fatBars[0].style.width = fatPercent + "%";
      fatText[0].textContent = `${summary.fat} / ${targets.fat} g`;
      console.log(`Fat: ${fatPercent.toFixed(1)}% (${summary.fat}/${targets.fat}g)`);
    }

    console.log("[updateProgressBars] Update completed");
  }

  updateMealDetailsUI(meal) {
    console.log("[updateMealDetailsUI] Updating meal details UI for:", meal.strMeal || meal.name);

    // Update hero section
    const heroImg = document.querySelector("#meal-details img");
    if (heroImg) {
      heroImg.src = meal.strMealThumb || meal.image || "";
      heroImg.alt = meal.strMeal || meal.name || "Meal";
    }

    const heroTitle = document.querySelector("#meal-details h1");
    if (heroTitle) {
      heroTitle.textContent = meal.strMeal || meal.name || "Unknown Meal";
    }

    // Update category tags
    const categoryTags = document.querySelectorAll("#meal-details .px-3.py-1.bg-emerald-500");
    if (categoryTags[0]) {
      categoryTags[0].textContent = meal.strCategory || meal.category || "Unknown";
    }

    const areaTags = document.querySelectorAll("#meal-details .px-3.py-1.bg-blue-500");
    if (areaTags[0]) {
      areaTags[0].textContent = meal.strArea || meal.area || "Unknown";
    }

    // Update servings and calories
    const servingsEl = $("hero-servings");
    if (servingsEl) {
      servingsEl.textContent = "4 servings"; // Default, could be dynamic
    }

    const caloriesEl = $("hero-calories");
    if (caloriesEl) {
      caloriesEl.textContent = `${meal.calories || 485} cal/serving`;
    }

    // Update ingredients (simplified - using mock ingredients for now)
    const ingredientsContainer = document.querySelector("#meal-details .grid.grid-cols-1.md\\:grid-cols-2");
    if (ingredientsContainer) {
      // For now, just show a placeholder - in a real app you'd parse ingredients
      ingredientsContainer.innerHTML = `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
          <span class="text-gray-700">Ingredients will be displayed here</span>
        </div>
      `;
    }

    // Update instructions
    const instructionsContainer = document.querySelector("#meal-details .space-y-4");
    if (instructionsContainer && meal.strInstructions) {
      const instructions = meal.strInstructions.split('. ').filter(step => step.trim());
      instructionsContainer.innerHTML = instructions.map((step, index) => `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            ${index + 1}
          </div>
          <p class="text-gray-700 leading-relaxed pt-2">${step.trim()}</p>
        </div>
      `).join('');
    }

    console.log("[updateMealDetailsUI] Meal details UI updated");
  }
}
/* Home Page Functions */
async function loadMealCategories() {
  console.log("[loadMealCategories] Loading meal categories");
  let categories = await MealsAPI.getCategories();
  console.log(`[loadMealCategories] Number of categories received: ${categories.length}`);

  let grid = $("categories-grid");
  if (!grid) {
    console.error("[loadMealCategories] Categories grid not found");
    return;
  }

  grid.innerHTML = ""; // Clear existing

  categories.forEach((cat, index) => {
    let categoryName = typeof cat === "string" ? cat : (cat.strCategory || cat.name || cat.category || JSON.stringify(cat));
    console.log(`[loadMealCategories] Category #${index + 1}:`, categoryName);

    let div = document.createElement("div");
    div.className = "category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group";
    div.dataset.category = categoryName;
    div.innerHTML = `
      <div class="flex items-center gap-2.5">
        <div class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          <i class="fa-solid fa-utensils"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">${categoryName}</h3>
        </div>
      </div>
    `;

    div.addEventListener("click", () => {
      console.log("[Category Click] Filtering by:", categoryName);
      loadMealsByCategory(categoryName);
    });

    grid.appendChild(div);
  });

  console.log("[loadMealCategories] All categories loaded");
}

async function loadMealsByCategory(category) {
  console.log("[loadMealsByCategory] Loading meals for category:", category);
  let meals = await MealsAPI.getMealsByCategory(category);
  console.log(`[loadMealsByCategory] Number of meals received: ${meals.length}`);
  renderMeals(meals);
}

async function loadAllMeals() {
  console.log("[loadAllMeals] Loading all meals");
  let meals = await MealsAPI.searchMeals("", 1, 25); // Empty query to get all
  console.log(`[loadAllMeals] Number of meals received: ${meals.length}`);
  renderMeals(meals);
}

function renderMeals(meals) {
  console.log("[renderMeals] Rendering meals");
  let grid = $("recipes-grid");
  let count = $("recipes-count");

  if (!grid || !count) {
    console.error("[renderMeals] Grid or count element not found");
    return;
  }

  // Log the first meal object to inspect its structure
  if (meals.length > 0) {
    console.log("Meal object:", meals[0]);
  }

  // Normalize meal objects to expected structure
  meals = meals.map(meal => {
    if (!meal || typeof meal !== 'object') return null;
    let instructions = meal.strInstructions || meal.instructions || meal.description;
    if (Array.isArray(instructions)) {
      instructions = instructions.join(' ');
    }
    return {
      idMeal: meal.idMeal || meal.id,
      strMeal: meal.strMeal || meal.name || meal.title,
      strMealThumb: meal.strMealThumb || meal.image || meal.thumbnail,
      strCategory: meal.strCategory || meal.category,
      strArea: meal.strArea || meal.area || meal.origin,
      strInstructions: instructions,
    };
  }).filter(meal => meal && meal.strMeal);

  console.log(`[renderMeals] Filtered meals: ${meals.length} valid meals`);

  // If no valid meals after filtering, use mock data
  if (meals.length === 0) {
    console.log("[renderMeals] No valid meals found, using mock data");
    meals = MealsAPI.getMockMeals();
  }

  grid.innerHTML = "";
  count.textContent = `Showing ${meals.length} recipes`;

  if (meals.length === 0) {
    console.log("[renderMeals] No meals available even with mock data");
    grid.innerHTML = `
      <div class="col-span-full text-center text-gray-500 py-10">
        No recipes found
      </div>
    `;
    return;
  }

  meals.forEach((meal, index) => {
    console.log(`[renderMeals] Meal #${index + 1}:`, meal.strMeal);
    let div = document.createElement("div");
    div.className = "recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
    div.dataset.mealId = meal.idMeal;
    div.dataset.mealName = meal.strMeal;

    div.innerHTML = `
      <div class="relative h-48 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.strMealThumb || ""}" alt="${meal.strMeal}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.strCategory || "Unknown"}</span>
          <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.strArea || "Unknown"}</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.strMeal}</h3>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${meal.strInstructions ? meal.strInstructions.substring(0, 100) + "..." : "Delicious recipe to try!"}</p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900">
            <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
            ${meal.strCategory || "Unknown"}
          </span>
          <span class="font-semibold text-gray-500">
            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
            ${meal.strArea || "Unknown"}
          </span>
        </div>
      </div>
    `;

    grid.appendChild(div);
  });

  console.log("[renderMeals] All meals rendered");
}

function bindHomePageEvents() {
  console.log("[bindHomePageEvents] Binding home page events");

  // Search input
  let searchInput = $("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      let query = e.target.value.trim();
      console.log("[Search Input] Query:", query);
      if (query.length > 2) {
        searchMeals(query);
      } else if (query.length === 0) {
        loadAllMeals();
      }
    });
  }

  // All Recipes button
  let allBtn = document.querySelector("button.bg-emerald-600");
  if (allBtn) {
    allBtn.addEventListener("click", () => {
      console.log("[All Recipes] Loading all meals");
      loadAllMeals();
    });
  }

  console.log("[bindHomePageEvents] Home page events bound");
}

async function searchMeals(query) {
  console.log("[searchMeals] Searching for:", query);
  let meals = await MealsAPI.searchMeals(query);
  console.log(`[searchMeals] Number of meals received: ${meals.length}`);
  renderMeals(meals);
}

/*  Start  */
document.addEventListener("DOMContentLoaded", () => {
  console.log(" [Init] Starting full app initialization");

  //Setting up Products Section
  console.log("[Init] setting up products");
  loadProductCategories();
  bindProductSearch();
  console.log("[Init] Product setup is complete");

  // Setting up the main app
  console.log("[Init] Setting up the main app");
  window.app = new App();
  console.log("[Init] App setup is complete");

  // Setting up Home Page
  console.log("[Init] setting up home page");
  loadMealCategories();
  loadAllMeals();
  bindHomePageEvents();
  console.log("[Init] Home page setup is complete");

  // Remove Loading Overlay
  setTimeout(() => {
    console.log("[Init] Remove loading screen...");
    $("app-loading-overlay").style.opacity = "0";
    setTimeout(() => {
      $("app-loading-overlay").style.display = "none";
      console.log("[Init] Full setup is complete!");
    }, 500);
  }, 800);
});
