chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'checkSiteCategories') {
      checkSiteCategories(request.url, sendResponse);
      return true; // This line indicates that sendResponse will be called asynchronously
    }
  });
  
  function checkSiteCategories(url, sendResponse) {
    var apiKey = 'ebb1afffe448c04b0d1cbd00a8ae588c780c03284e0d9f366b808ed709dfccec'; // Replace with your actual VirusTotal API key
    var apiEndpoint = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${url}`;
  
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(result => {
        if (result['response_code'] === 1) {
          var categoriesDetails = Object.entries(result['scans'])
            .filter(([_, details]) => ['malware site', 'phishing site', 'malicious site'].includes(details['result']))
            .map(([scan, details]) => [scan, details['result']]);
          var categoriesCount = categoriesDetails.length;
  
          sendResponse({
            categoriesCount: categoriesCount,
            categoriesDetails: categoriesDetails
          });
        } else {
          sendResponse({ categoriesCount: null, categoriesDetails: null });
        }
      })
      .catch(error => {
        console.error('Error checking site categories:', error);
        sendResponse({ categoriesCount: null, categoriesDetails: null });
      });
  }
  