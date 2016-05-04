/**
 * Created by ghanavela on 3/19/2016.
 */

app.constant('EnvConfig', (function() {
    // Define your variable
    var devResource = 'http://52.73.228.44:8080/';
	var devImgResource = 'http://52.73.228.44/BulkwizeImages/';
    // Use the variable in your constants
    return {
        HOST: devResource,
		ImgPath:devImgResource,
    }
})());
