(function() {
    Array.prototype.common = function(a, b) {
        return a.filter( e => {
            let ret = false;
            for (i in b) {
                if(b[i].ID === e.id) {
                    ret = true;
                    break;
                }
            }
            return ret;
        });
    };
    
    Array.prototype.inGoogle = function(a, b) {
        return a.filter( e => {
            let ret = true;
            for (i in b) {
                if(b[i].ID === e.id) {
                    ret = false;
                    break;
                }
            }
            return ret;
        });
    };
    
    Array.prototype.inDatabase = function(a, b) {
        return b.filter( e => {
            let ret = true;
            for (i in a) {
                if(a[i].id === e.ID) {
                    ret = false;
                    break;
                }
            }
            return ret;
        });
    };
})();
