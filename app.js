const axios = require('axios');
const username = "rishabha";
const accessToken = "Ij61w5deaSs0yN0cEQHp1XP23gX2VlXTUOYfnJWNxXekquTYWq";
axios.defaults.baseURL = 'https://api.lambdatest.com/screenshots/v1';
axios.defaults.headers.common['Authorization'] = "Basic " + Buffer.from(username + ":" + accessToken).toString('base64');
axios.defaults.headers.common['Content-Type'] = 'application/json';

class AttemptsExcededError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'AttemptsExcededError';
    }
}

const attemptsErr = new AttemptsExcededError('Max attempts exceeded');


//TODO Test stop test and user urls
async function checkTestStatus(testId) {

    try {
        const response = await axios.get("/" + testId, {
            timeout: 25000
        })
        return response.data

    } catch (error) {
        console.log("Error while calling get screenshots api statuscode:%d, message:%s ", error.response.status, JSON.stringify(error.response.data))
        return error

    }


}

function checkIfTestCompleted(testId) {
    return new Promise(function (resolve, reject) {
        let attempt = 0
        let teststatus = function (testId) {
            checkTestStatus(testId).then(function (response) {
                if (response.test_id) {
                    if (response.test_status === "completed" || response.test_status === "failed") {
                        resolve(response)
                    } else {
                        attempt++;
                        console.log("Test still running for testid:%s, url:%s", response.test_id, response.url)
                        if (attempt < 50) {
                            setTimeout(function () {
                                teststatus(testId)
                            }, 30000)
                        } else {
                            reject(attemptsErr)
                        }
                    }
                } else {
                    console.log("No data found for test_id", testId)
                    reject(Error(response))
                }

            }).catch(function (error) {
                console.log("Could not check test status reason:", error)
                reject(Error(error))
            });
        }
        teststatus(testId)
    });
}



async function takeScreenshot(payload) {

    try {
        const response = await axios.post("/", payload, {
            timeout: 25000
        })

        console.log("Test Started for url: %s, response:", payload.url, response.data)
        return response.data

    } catch (error) {
        console.log("Error while calling start screenshot test api message:%s ", JSON.stringify(error.response.data))
        throw error

    }

}

async function stopTest(testId) {

    try {
        const response = await axios.put("stop/" + testId, {
            timeout: 25000
        })
        console.log("Stop test api response :", response)

    } catch (error) {
        console.log("Error while calling get screenshots api message:", error)

    }


}


async function startTest() {

    //Array of all testIDS of completed tests
    let testIDS = [];
    //Your URLS for which to take screenshots
    let urls = ["https://balega-socks.implus.com/","https://balega-socks.implus.com/products/all-products/","https://balega-socks.implus.com/products/all-products/balega-blister-resist-crew-running-socks"]
    //Your OS and Browser configurations on which to take screenshots
    let osBrowserConfig = {
        "windows 10": {
            "chrome": [
                "76",
                "75"
            ],
            "firefox": [
                "67",
                "66"
            ],
            "opera": [
                "58",
                "57"
            ],
            "ie": [
                "11"
            ]
        }
    }
    let testPayload = {}

    for (var i = 0, len = urls.length; i < len; i++) {
        try {

            testPayload = {
                defer_time: 2,
                email: false,
                layout: "portrait",
                mac_res: "1024x768",
                win_res: "1366X768",
                smart_scroll: true,
                url: urls[i],
                configs: osBrowserConfig
            }


            response = await takeScreenshot(testPayload)

            if (response && response.test_id) {

                try {
                    testOutput = await checkIfTestCompleted(response.test_id)
                    testIDS.push(testOutput.test_id)
                    console.log("Test Completed for url:%s with test_id:%s", urls[i], testOutput.test_id)
                } catch (error) {
                    console.log("Unable to check test status reason: ", error.message)
                    if (error instanceof AttemptsExcededError) {
                        console.log("Stopping tests using API")
                        await stopTest(response.test_id)
                    }

                }

            } else {
                console.log("Cannot check test status, reason:", response)
            }

        } catch (error) {
            console.log("Cannot call start test api reason:", error)
            break;
        }

    }

    console.log("TestIDs of all completed screenshot tests: ", testIDS)
    console.log("Done")

}




startTest()