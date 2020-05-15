
// Global app controller

//error file unsafe
//https://stackoverflow.com/questions/35115789/using-svg-use-icons-external-reference-does-not-show-icons-in-chrome-when-vi

// import string from './models/Search';
// import {add , muliply ,ID} from './views/SearchView';

// console.log(`using imported functions!${add(ID,7)} `)


///////////////////////////////////////////////////////////
// we will not use fetch as it is not supported in all browsers we will need an http liberary 
// there is one called axios we need to download it npm i axios --save and import it 


//building controller lets talk about state
//what is the state of our app or our data at one given moment we want it in one central object
// there is liberaries that work as state mangement  for this like redux b

import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';
import Recipe from './models/Recipe';

import  * as recipeView  from './views/RecipeView';
import  * as searchView  from './views/SearchView';
import  * as listView  from './views/ListView';
import  * as likeView  from './views/LikeView';
import {elements,renderLoader, clearLoader} from './views/base';


/* Global State of the App
    1- Search object
    2- Curent recipe object
    3- Shopping object
    4- Liked recipes  

*/ 
const state = {};


/*  Search Controller */
const controlSearch = async () => {

    // 1) get query from the view our query here is the recipe name for example pizza
    const query = searchView.getInputQuery(); 
    // console.log(query)

    if(query){
        // 2)  new search object and add it to state
        state.search = new Search(query);
    }

     // 3) Prepare UI for results
        //clear input fields
        searchView.clearInput();
        // clear results
        searchView.clearResult();
        //spinner
        renderLoader(elements.resultDiv);

    try{

    // 4) Search for recipes
    await state.search.getResult();

    //5) Render results on UI
        //console.log(state.search.result);
        //clear loader before rendering results 
        clearLoader();
        searchView.renderResults(state.search.result);
    }
    catch(error){
        console.log('error processing request');
        clearLoader();
    }

};

elements.searchForm.addEventListener('submit', e => {
    //in order to prevent page from reloading 
    e.preventDefault();
    controlSearch();
});

elements.resultPages.addEventListener('click', e => {

    const btn = e.target.closest('.btn-inline');
    //console.log(btn);

    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResult();
        searchView.renderResults(state.search.result,goToPage);

        //console.log(goToPage);
    }
});


/** Recipe Controller  */
const controlRecipe = async () => {
    //1- get the hash 
    //window.location is the entire url 
    //to remove the # use .replace
const id = window.location.hash.replace('#','');
//console.log(id);

if(id) {

    //2- prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //high light selected recipe
    if(state.search) searchView.highLightedSelected(id);

    //3- create new recipe object
     state.recipe = new Recipe(id);
     //Testing
     //window.r = state.recipe ;

    try{

        //4- get recipe data  and parse ingredients
        await state.recipe.getRecipe();
        //console.log(state.recipe.ingredients);
        state.recipe.parseIngredients();
        //5- call serving and cooking time
        state.recipe.calcServings();
    
        state.recipe.calcTime();
    
        //6- render recipe
        
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        //console.log(state.recipe);
    }
    catch(error){
        console.log(error);
        alert(error);
    }

    }

};

//Control List
const controlList = () => {
    // 1- create new list  if there is none yet 
    if(!state.list) state.list = new List();

    console.log(state.list);

    //2- Add each ingredient to the list and UI
    state.recipe.ingredients.forEach( el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });

};

elements.shopping.addEventListener('click',e => {
const id = e.target.closest('.shopping__item').dataset.itemid;
//console.log(id); //correct

//handle the delete button event
if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //Delete from state
    state.list.deleteItem(); //working but does not select the element upponpassing this id
    //delete from UI
    listView.deleteItem(); //delete from the top doesnt delete the wanted element
}   
// count update
else if(e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value,10);
    state.list.updateCount(id,val);
}
});

/* 
Likes Controller
*/
//Likes For Testing 
//
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    console.log(currentId)
    // User has not yet liked this recipe
    if(!state.likes.isLiked(currentId)){
        //add Like to the state, likes array in likes class Model
        const newLike = state.likes.addLike( 
            currentId, 
            state.recipe.title, 
            state.recipe.auther, 
            state.recipe.image   );

        //Toggle Like button
        likeView.toggleLiketBtn(true);


        //Add Like to the UI likes list 
        likeView.renderLike(newLike);
        //console.log(state.likes);
    }
    // User has liked this recipe
    else {
        
        //remove Like from the state
        state.likes.deleteLike(currentId);

        //Toggle Like button
        likeView.toggleLiketBtn (false);

        //remove Like to the UI list 
        //console.log(state.likes);  
        likeView.deleteLike(currentId);  
    }

    likeView.toggleLikeMenue(state.likes.getNumLikes());
    
};

// // Restore liked recipe on page reload local storage 
window.addEventListener('load',() => {
    state.likes = new Likes();
    state.likes.readStorage();
    likeView.toggleLikeMenue(state.likes.getNumLikes());
    //render existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));

});
// in the url there is # symbol that changes whenever we press on different recipe, there is an event called hashchange
// in which when it is changed we will call our recipeController
//what happens is that if the hash does not change the controlRecipe wont happen like for example when we reload the page 
//we get nothing
//for so we will create a load event listener,with same function to fire controlRecipe function
//adding the same event function to different events

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',  controlRecipe);

// we can do it in a better way, add multiple events to one function

['hashchange','load'].forEach(event => {window.addEventListener(event, controlRecipe)});

// handeling recipe button clicks
elements.recipe.addEventListener('click', e => {
    //btn-decrease * and all its childrn
    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        if(state.recipe.servings > 1){

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredient(state.recipe);
        }  
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        //console.log(state.recipe);
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredient(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *'))
    {
        //add ingredient to shopping list 
        controlList();
        //console.log('clicked');

    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        // like controller
        controlLike();
    }

    //console.log(state.recipe);

});
    







