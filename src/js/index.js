// import all files
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Like';
import * as likeView from './views/likeView';
import '../css/style.css';

// the state of app
const state = {};

// search controller
const controlSearch = async _ => {
    // get the query from the view
    const query = searchView.getInput();

    if (query){
        // create a new search object and add it to the state
        state.search = new Search(query);

        // prepare the ui for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for the recipes
            await state.search.getResults();
    
            // render the results in the ui
            clearLoader();
            searchView.renderResults(state.search.result);   
        } catch (err) {
            alet(err);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// recipe controller
const controlRecipe = async _ => {
    // get id from url
    const id = window.location.hash.replace('#', '');
    if (id){
        // prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) searchView.highlightSelected(id);
        
        // create new recipe object
        state.recipe = new Recipe(id);

        try {
             // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            alert(err);
        }
    }   
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// list controller
const controlList = _ => {
    // create a new list if there in none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and ui
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};

// like controller
const controlLike = _ => {
    if (!state.likes) state.likes = new Likes();

    // user hasn't yet liked current recipe
    const curId = state.recipe.id;
    if (!state.likes.isLiked(curId)){
        // add like to the state object
        const {title, author, img} = state.recipe;
        const newLike = state.likes.addLike(curId, title, author, img);

        // toogle the like button
        // state.likes.isLiked(curId)
        likeView.toggleLikeBtn(true);

        // add like to ui list
        likeView.renderLike(newLike);

    // user hasn't yet liked current recipe
    }else {
        // remove like to the state object
        state.likes.deleteLike(curId);

        // toogle the like button
        likeView.toggleLikeBtn(false);

        // remove like from ui list
        likeView.deleteLike(curId);
    }

    likeView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page load
window.addEventListener('load', _ => {
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // toogle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like))
});


// handle update and delete list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from state object
        state.list.deleteItem(id);

        // delete from Ui
        listView.deleteItem(id);
        
        // handle the count update
    } else if (e.target.matches('.shopping__count__value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }
});

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        // deacrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsInredients(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        // increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsInredients(state.recipe);
    }else if (e.target.matches('.recipe__btn__add, .recipe__btn__add *')) {
        // add ingredients to the shopping list
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        // excuate like controller
        controlLike();
    }
});