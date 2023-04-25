//[ IMPORT from MODEL]
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
//[ IMPORT from VIEW]
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime'; // async/await
import 'core-js/stable'; // everything else

///////////////////////////////////////

// if (module.hot) {
//   module.hot.dispose();
// }

// if (module.hot) {
//   module.hot.accept();
// }
///////////////////////////////////////

async function controlRecipe() {
  //: ASYNC
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // [0] Update results view to mark selected at Search results
    resultsView.update(model.getSearchResultspage());

    //[ IMPORT from MODEL]
    // [1] Loading recipe from Model
    await model.loadRecipe(id); //: AWAIT // not store data bcoz not retrun anything
    // [2] define new avarible from state in Model
    // const { recipe } = model.state;

    //[ IMPORT RECIPE VIEW]

    // [3] Rendering recipe
    recipeView.render(model.state.recipe); //or
    // const recipeView = new recipeView(model.state.recipe);

    // [4] Rendering bookmark
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
}
async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // 1. Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query); // not store data bcoz not retrun anything

    // 3. Render results
    resultsView.render(model.getSearchResultspage());
    // 4. Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}
function controlPagination(goToPage) {
  // 1. Reder New results
  resultsView.render(model.getSearchResultspage(goToPage));
  // 2. Render New pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe serrvings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // [2] Rendering recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}
function controlAddBookmark() {
  // 1. Add or Remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view only bookmark
  recipeView.update(model.state.recipe);
  // 3. Render Bookmark List
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddrecipe(newRecipe) {
  try {
    // addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    // addRecipeView.renderMessege();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddrecipe);

  // addRecipeView.addHandlerShowWindow();
}
init();

// document.querySelector('body').addEventListener('click', controlAddBookmark);

///////////////////////////////////////
// https://forkify-api.herokuapp.com/v2
// npm i parcel -D
//  npm i core-js regenerator-runtime
