/**
 * Created by ghanavela on 3/13/2016.
 */
app.factory('AuthServices', function () {
    var USER_DETAILS = "USER-DETAILS";
    var AuthServices = {
        isLogin :  false,
        authInfo: {
            isLogin : "" || flase
        },
        get: function(){
            return  JSON.parse(localStorage.getItem(USER_DETAILS) ||  '[]');
        },
        put: function(user){
            return localStorage.setItem(USER_DETAILS,JSON.stringify(user));
        }

    }
    return AuthServices;
})
