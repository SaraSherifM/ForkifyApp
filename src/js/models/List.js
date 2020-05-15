import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items =[];
    }

    addItem(count,unit,ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
    /*splice takes start index and how many positions it will takeit then return those elements and delete them from original array it is similar to slice with the difference that slice accept start and end index */
    // [2,4,8].splice(1,1) =>  4 , array become [2,8]
    //[2,4,8].slice(1,1) =>  4 , array become [2,4,8]
        this.items.splice(index,1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}