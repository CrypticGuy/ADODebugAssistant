chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
        console.log("HERE!")
        err = window.getSelection().toString()
        fetch('http://127.0.0.1:5000/api/error' + new URLSearchParams({q: err}))
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            sendResponse({data: JSON.stringify(resp)})
        })
        .catch(err => {
            sendResponse({data: "Error has occured"})
        })
    }
    else
      sendResponse({}); // snub them.
});