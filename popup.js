document.getElementById('checkButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code: `
                var urls = Array.from(new Set(Array.from(document.querySelectorAll('a'))
                .map(a => a.href)))
                .filter(url => url); // filter out empty urls
                chrome.runtime.sendMessage({action: "storeUrls", urls: urls});
                console.log(urls)
            `
        }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "storeUrls") {
        var urls = request.urls;
        urls.forEach(function(url) {
            chrome.runtime.sendMessage(
                {action: "checkSiteCategories", url: url}, 
                function(response) {
                    var resultText = response.categoriesCount ? 
                        `The URL ${url} is categorized as malicious by ${response.categoriesCount} sources.` : 
                        `The URL ${url} is not categorized as malicious.`;
                    
                    // Create a new paragraph element
                    var p = document.createElement('p');
                    p.textContent = resultText;

                    // Change the color of the text based on whether the URL is malicious
                    p.style.color = response.categoriesCount ? 'red' : 'green';
                    
                    // Append the paragraph to the 'result' element
                    document.getElementById('result').appendChild(p);
                }
            );
        });
    }
});
