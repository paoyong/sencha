function getAgeString(age) {
    var bannerAge = '';

    if (age.seconds === undefined) {
        age.seconds = 0;
    }

    // Format the age accordingly
    if (age.days) {
        bannerAge = age.days;

        if (age.days === 1) {
            bannerAge += ' day ';
        } else {
            bannerAge += ' days ';
        }
    }
    else if (age.hours) {
        bannerAge = age.hours;

        if (age.hours === 1) {
            bannerAge = ' an hour ';
        } else {
            bannerAge += ' hours ';
        }
    }
    else if (age.minutes) {
        bannerAge = age.minutes;

        if (age.minutes === 1) {
            bannerAge += ' minute ';
        } else {
            bannerAge += ' minutes ';
        }
    } else {
        bannerAge = age.seconds;

        if (age.seconds === 1) {
            bannerAge += ' second ';
        } else {
            bannerAge += ' seconds ';
        }
    }

    return bannerAge;
}

function getCommentCountString(numComments) {
    var commentString = '';
    commentString += numComments + ' comment';

    if (numComments !== 1) {
        commentString += 's';
    }

    return commentString;
}

function findAndUpdateUpvoted(currArr, targetId, isUpvoting) {
    for (var i = 0, len = currArr.length; i < len; i++) {
        if (currArr[i].id === targetId) {
            currArr[i].upvoted = isUpvoting;

            if (isUpvoting) {
                currArr[i].score++;
            } else {
                currArr[i].score--;
            }
        }
    }

    return currArr;
}

