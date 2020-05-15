import axios from 'axios';

export default class Search {

    constructor(query){
        this.query = query;
    }


    async getResult(){
        //let result;
        try {
            const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //console.log(res)
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch (error) {
            alert(error);
        }
        
    }
} 



