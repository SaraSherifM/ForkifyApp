import { elements } from "./base";
import  {limitRecipeTitle} from './SearchView';


export const toggleLiketBtn = (isliked) => {

    //<use href="img/icons.svg#icon-heart-outlined"></use>
    // isliked is boolean value

    const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);

};

export const toggleLikeMenue = numLikes => {
elements.likesMenue.style.visibility = numLikes > 0 ? 'visible' :'hidden'; 
};

export const renderLike = like => {
const markup = `
<li>
    <a class="likes__link" href="#${like.id}">
    <figure class="likes__fig">
    <img src="${like.img}" alt="${like.title}">
    </figure>
    <div class="likes__data">
     <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
     <p class="likes__author">${like.auther}</p>
    </div>
    </a>
</li>
`;
elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link [href='#${id}'`);
    if(el) el.parentElement.removeChild(el);
}