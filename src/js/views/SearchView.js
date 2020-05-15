
import { elements } from './base';


export const clearInput = () => {
    elements.searchInput.value ='';
};
export const clearResult = () => {
    elements.resultList.innerHTML = '';
    elements.resultPages.innerHTML = '';
};

export const highLightedSelected = id => {
    const resultArr = document.querySelectorAll('.results__link--active');
    //console.log(resultArr);

    resultArr.forEach( element => {
        element.classList.remove('results__link--active');
    });
    //.results__link 
    document.querySelector(`a[href='#${id}']`).classList.add('results__link--active');
};

/*
//example 'pasta with tomato and spinach'
    first iteration acc : 0 /cur: pasta / acc + cur.length = 5 / push to newTitle =  ['pasta']
    seconde acc: 5 / cur: with / acc + cur.length = 8 / newTitle = ['pasta', 'with']
    third acc: 8 / cur: tomato / acc + cur.length = 15 / ['pasta', 'with', 'tomato']
    4ht acc: 15 / cur: and /  acc + cur.length = 18 / now 'nd' is not pushed to the array newTitle
*/
//there is a bug for recipe 8 is a special case 
export const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = [];
    
    if(title.length > limit )
    {
        // split returns an array of 5 elements
        //reduce take a call back function that have parameters accumulator and current 
        //seconde parameter for reduce  accomulator set to zero
        title.split(' ').reduce((acc,cur) => {

                if(acc + cur.length <= limit){
                    newTitle.push(cur);
                }

                return acc + cur.length;
        }, 0);

        // return the result
        return  `${newTitle.join(' ')} ...`;
    };

    return title;
}

// get the input search word
export const getInputQuery = () => elements.searchInput.value;

// render the results array
//will create function for printing one recipe
const renderRecipe = recipe => {
    const markup = `
     <li>
        <a class="likes__link" href="#${recipe.recipe_id}">
        <figure class="likes__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitRecipeTitle(recipe.title)} </h4>
            <p class="likes__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;

elements.resultList.insertAdjacentHTML('beforeend', markup);  
//console.log(elements.searchList);

};

//type: 'prev' or 'type'
const createButton = (page,type) => `

<button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev'? page - 1 : page + 1 }>
    <span> Page ${type === 'prev'? page - 1 : page + 1 }</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left' : 'right' }"></use>
    </svg>
</button>

`;

const renderBtns =  (page ,numResults, resPerPage) => {

    let button;
    const pages = numResults/resPerPage;

    if(page === 1 && pages > 1){
        //only button next page 
        button = createButton(page,'next');
    }
    else if (page < pages){
        // display both buttons 
        button = ` 
            ${createButton(page,'prev')} 
           ${createButton(page,'next')} `;
    }
    else {  //if( page === pages && pages > 1 )
        // only button to go prev page
        button = createButton(page,'prev');
    }

    elements.resultPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page   
    const start = (page - 1) * resPerPage;
    const end = resPerPage * page;

    recipes.slice(start,end).forEach(renderRecipe );

    //render pagination buttons
    renderBtns(page,recipes.length,resPerPage);
};

