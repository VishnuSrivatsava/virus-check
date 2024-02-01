document.getElementById('checkButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage(
        {action: "checkSiteCategories", url: tabs[0].url}, 
        function(response) {
          document.getElementById('result').textContent = 
            response.categoriesCount ? 
            `This site is categorized as malicious by ${response.categoriesCount} sources.` : 
            'This site is not categorized as malicious.';
        }
      );
    });
  });