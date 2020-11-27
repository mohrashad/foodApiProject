import axois from 'axios';
import {apiKey} from '../config';
export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axois(`https://api.spoonacular.com/recipes/${this.id}/information?includeNutrition=false&apiKey=${apiKey}`);
            const {sourceUrl: url, image, title, extendedIngredients, sourceName: author} = res.data;
            this.url = url;
            this.img = image;
            this.title = title;
            this.ingredients = extendedIngredients;
            this.author = author;
        }catch(err){
            alert(err);
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong  = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'],
              unistsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'],
              units = [...unistsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {

            // uniform units
            let ingredient = el.original.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unistsShort[i]);
            });

            // remove parthenses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // parse ingredients into count, unit and ingerdient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            if(unitIndex > -1){
                // there is a unit
                const arrCount = arrIng.slice(1, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[1].replace('-', '+'));
                }else {
                    count = eval(arrIng.slice(0, unitIndex));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }else if(parseInt(arrIng[0], 10)){
                // there is no unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }
            }else if(unitIndex === -1){
                // there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        // update servings
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;


        // update ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });


        this.servings = newServings;
    }
}