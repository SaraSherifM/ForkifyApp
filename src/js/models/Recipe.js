import axios from 'axios';

export default class Recipe {

    constructor(id){
        this.id = id;
    }


    async getRecipe(){
        //let result;
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //console.log(res);
            this.title = res.data.recipe.title;
            this.auther = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.image = res .data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            
        }
        catch (error) {
            alert(error);
        }
        
    }

    //assume each 3 ingredient takes 15 mins
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3)
        this.time = periods * 15;
    };
    calcServings(){
        this.servings = 4;
    };

    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort,'kg','g'];

        const newIngredients = this.ingredients.map(el => {

            let ingredient = el.toLowerCase();

            //1- uniform units
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
               
            });

             //2- remove parentheses
             ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //3- parse ingredients into count, unit and ingredient
            //we will separate number, units and the actual ingredients
             const arrIng = ingredient.split(' ');
              //this.ingredients.forEach(item => { arrIng.push(item.split(' ')) });  WRONG BY ME
             // problem here it wa this.ingredients.split(' ')//error split is not a function
            const unitIndex = arrIng.findIndex( element => units.includes(element));
            
            let objIng;

            if(unitIndex > -1){
                //there is a unit
                // Ex: 4 1/2 cups, arrCount = [4,1/2]
                // Ex: 4  cups, arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;

                if(arrCount.length === 1){
                    //no fractions one number only 
                    // in the orignal recipe it has 2-1/2 in this case if we evaluates it will decrease but we want to add them so replace
                    count = eval(arrIng[0].replace('-','+'));

                } else {
                    // two numbers we will join them with + and then evaluate them
                    // eval(4 + 1/2) ==> 4.5 evaluates string as in numerical operation
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            }
            else if ( parseInt(arrIng[0],10) ){
                //means there is no unit but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            }
            else //if (unitIndex === -1)
            {
                //there is no unit nor number in the 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            return objIng;
        });


        this.ingredients = newIngredients;
    };

    updateServings(type){
        //Servings 
        const newServings = type ==='dec'? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= newServings/ this.servings;
        });


        this.servings = newServings;
    }
} 



