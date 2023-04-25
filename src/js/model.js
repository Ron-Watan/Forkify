// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

//[ EXPORT to CONTROLLER]
export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
}

export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    createRecipeObject(data);
    console.log(state.recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err + ' FROM MODEL ');
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err + ' FROM MODEL ');
    throw err;
  }
}

export function getSearchResultspage(page = state.search.page) {
  // Result of recipes on (this)page  => controller

  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //10
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //nerQt = oldQt * (newServing / oldServings)
  });
  state.recipe.servings = newServings;
}
function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export function addBookmark(recipe) {
  // Add bookmarks
  state.bookmarks.push(recipe);
  console.log(state.bookmarks);
  // Mark current recipe as bookmarked = true for html
  state.recipe.bookmarked = true;
  // if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}
export function deleteBookmark(id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  console.log(index);
  state.bookmarks.splice(index, 1);

  //or
  // state.bookmarks.forEach((el, i) => {
  //   if(el.id===id)console.log(i)
  // })

  // Mark current recipe as remove bookmarked = false for html

  // state.recipe.bookmarked = false;
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

function init() {
  // Load bookmarked
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);

  //or
  // if (bookmarks) state.bookmarks.push(...JSON.parse(bookmarks));
}
init();

export async function uploadRecipe(newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el=>el.trim());
      if (ingArr.length !== 3)
        throw new Error(
          'Wrong ingredients format! plese use the correct format'
        );

      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  // console.log(ingredients, newRecipe);

  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    servings: +newRecipe.servings,
    cooking_time: +newRecipe.cookingTime,
    ingredients,
  };
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  // state.recipe = createRecipeObject(data);
  addBookmark(createRecipeObject(data));
}

/////////////////
function clearBookmark() {
  localStorage.clear('bookmarks');
}

// clearBookmark()
