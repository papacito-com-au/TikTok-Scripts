// Bulk/Automated Unfollow Non-Followers on TikTok
// Repository: https://github.com/papacito-com-au/TikTok-Scripts

// How To Use: Copy/Paste into Developer Console of either Chrome or Firefox.
// You MUST be logged in, and on your profile page. Click the "Following" link to bring up the small window.
// [Optional] Scroll down the list to begin loading more and more targets into the browser and/or modify the variable to suit.
// BE CAREFUL! Don't go nuts with the configuration... I think unfollowing about up to 100 people with these settings is OK per day but hey, your account - your rules!

//* CONFIG - YOU CAN MODIFY THIS!*/
var unfollowMinDelay = 3; // in seconds
var unfollowMaxDelay = 15; // in seconds
var numOfTimesToScrollBeforeExecuting = 3; // If 0, won't scroll.

var whitelist = [ //be sure to use lowercase (e.g. PAPACITO becomes papacito)
    'papacito.com.au', // Would stop you unfollowing papacito.com.au (if you follow it and that account doesn't follow you)
    'exampleusername', // Example provided to show you can add new lines, it must end with a comma if it isn't the last item.
];
//* END CONFIG */

function getRandomDelay(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function beginUnfollowing() {
    console.log("[INFO] Finding accounts to unfollow...");

    // Find all "Following" buttons on screen
    let unfollowTargets = document.querySelectorAll("button");
    unfollowTargets = Array.from(unfollowTargets).filter(button => button.textContent.trim() === "Following");

    console.log("[INFO] Loaded... Will unfollow " + unfollowTargets.length + " users.");

    let lastDelay = 0;
    unfollowTargets.forEach((button, i) => {
        let delay = getRandomDelay(unfollowMinDelay + lastDelay, unfollowMaxDelay + lastDelay);
        lastDelay = delay;

        setTimeout(() => {
            let userContainer = button.closest("div").parentElement.parentElement; // get the parent to identify the account
            let userId = userContainer.querySelector("p").textContent.trim();
            if (whitelist.includes(userId)) {
                console.log("[INFO] Skipped whitelisted user: " + userId);
                return;
            }
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            button.click();
            console.log("[SUCCESS] Unfollowed " + userId + " [" + (i + 1) + "/" + unfollowTargets.length + "]");
        }, (delay * 1000));

        if ((i + 1) === unfollowTargets.length) {
            console.log("[INFO] Script will finish in " + delay + " seconds.");
            lastDelay = 0; // reset the delay
        }
    });
}

function kickOff() {
    let followingButtons = document.querySelectorAll("button");
    followingButtons = Array.from(followingButtons).filter(button => button.textContent.trim() === "Following");

    if (followingButtons.length == 0) {
        console.log("[CRITICAL] No valid accounts(s) detected for script. Are you on your page? Did you click the Followers link?");
    } else {
        let UserListWindow = followingButtons[0].closest("div").parentElement.parentElement.parentElement.parentElement.parentElement;
        if (numOfTimesToScrollBeforeExecuting > 0) {
            console.log("[INFO] Scrolling Enabled!");
            for (let i = 0; i < numOfTimesToScrollBeforeExecuting; i++) {
                setTimeout(() => {
                    console.log("[INFO] Scrolling...");
                    UserListWindow.scrollTo({ top: UserListWindow.scrollHeight, behavior: 'smooth' });
                }, ((i + 1) * 2000));

                if ((i + 1) === numOfTimesToScrollBeforeExecuting) {
                    setTimeout(() => {
                        beginUnfollowing();
                    }, ((i + 2) * 2000));
                }
            }
        } else {
            beginUnfollowing();
        }
    }
}

// Start the script
kickOff();
