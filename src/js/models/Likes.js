
export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, auther,img){
        const like = {id, title, auther, img };
        this.likes.push(like);
        //persist data into the local storage
        this.persistData();
        console.log(localStorage.getItem('likes'));

        return like;
    }


    deleteLike(id){
        const like = this.likes.findIndex(el => el.id === id);
        //persist data into the local storage
        
        this.likes.splice(like,1);
        this.persistData();
        console.log(localStorage.getItem('likes'));
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restoring likes from local storage if we reloaded the app
        if(storage) this.likes = storage;

    }
}