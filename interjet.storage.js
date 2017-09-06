var Interjet = Interjet || {};

Interjet.Storage = function(){
    this._session = null;
    this._storage = null;

    this.session = function(item, value){
        if(!this._session) return false;

        if(!value) {
            return JSON.parse(sessionStorage.getItem(item))
        } else {
            sessionStorage.setItem(item, JSON.stringify(value));
            return true;
        }
    }

    this.storage = function(item, value){
        if(!this._storage) return false;

        if(!value) {
            return JSON.parse(localStorage.getItem(item))
        } else {
            localStorage.setItem(item, JSON.stringify(value));
            return true;
        }
    }

    // Constructor
    this._session = 'sessionStorage' in window;
    this._storage = 'localStorage' in window;
};