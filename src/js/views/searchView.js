import {elements} from './base';

export const getInput = _ => elements.searchInput.value;

export const clearInput = _ => elements.searchInput.value = '';

export const clearResults =  _ => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = document.querySelectorAll('.results__link');
    resultsArr.forEach(el => el.classList.remove('results__link--active'));
    
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, recipe, limit = 17) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the new title
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipeobj => {
    const {id: url, image, title: label, sourceName:source} = recipeobj;
    const html = `<li>
                    <a class="results__link results__link--active" href="#${url}">
                        <figure class="results__fig">
                            <img src="${image}" alt="${label}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(label)}</h4>
                            <p class="results__author">${source}</p>
                        </div>
                    </a>
                </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', html);
};

const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'next' ? page + 1: page - 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
        <span>Page ${type === 'next' ? page + 1: page - 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1){
        // display next button only
        button = createButtons(page, 'next');
    }else if (page < pages){
        // diaplay both buttons
        button = `
            ${createButtons(page, 'prev')}
            ${createButtons(page, 'next')}
        `
    }else if (page === pages && pages > 1){
        // display previous button only
        button = createButtons(page, 'prev');
    }

    // append buttons in document
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1  , resPerPage = 10) => {
    // render results of the current page
    const start = (page - 1) * resPerPage,
          end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagenation buttons
    renderButtons(page, recipes.length, resPerPage);
};