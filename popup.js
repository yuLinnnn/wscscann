// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['scannedSubdomains'], function(result) {
        const resultsElement = document.getElementById('results');
        if (result.scannedSubdomains) {
            const scannedSubdomains = JSON.parse(result.scannedSubdomains);
            Object.keys(scannedSubdomains).forEach(domain => {
                const domainInfo = scannedSubdomains[domain];
                Object.keys(domainInfo).forEach(file => {
                    const fileInfo = domainInfo[file];
                    if (fileInfo.status === 'Success') {
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="https://${domain}/${file}" target="_blank" class="successful">${domain}/${file}</a>`;
                        resultsElement.appendChild(li);
                    }
                });
            });
        } else {
            resultsElement.textContent = '暂时没有成功的URL...';
        }
    });
});