var config = require('./config.js');

module.exports = {
    checkIfAgeWordIsValid: function(ageWord) {
        // Check if the age word is valid.
        var isValid = false;
        for (var i = 0, len = config.supportedAgeWords.length; i < len; i++) {
            if (ageWord === config.supportedAgeWords[i]) {
                isValid = true;
            }
        }

        return isValid;
    }
}
