import axios from 'axios';
import {apiKey} from '../config';
export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&number=100&apiKey=${apiKey}&addRecipeInformation=true`);
            this.result = res.data.results;
        }catch(err){
            alert(err)
        }
    }
}