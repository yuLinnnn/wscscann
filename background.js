let scannedUrls = {};

chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details.frameId === 0) { // 主框架的导航
        let url = new URL(details.url);
        let fullUrl = url.origin; // 获取协议+域名，不包括路径

        if (!scannedUrls[fullUrl]) {
            scannedUrls[fullUrl] = true; // 标记该域名为已扫描

            const hostname = url.hostname;
            const domainParts = hostname.split('.'); // 分割域名部分

            const extensions = [".zip", ".7z", ".gz", ".rar", ".tar", ".tar.gz"];
            domainParts.forEach(part => {
                extensions.forEach(ext => {
                    let backupFileName = `${part}${ext}`;
                    let backupFilePath = `${fullUrl}/${backupFileName}`;

                    // 执行 HEAD 请求检查文件是否存在
                    fetch(backupFilePath, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok && (response.headers.get('content-type') || '').includes('application')) {
                                console.log(`Found backup file: ${backupFilePath}`);
                            } else {
                                console.log(`No backup file at: ${backupFilePath}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching:', backupFilePath, error);
                        });
                });
            });
        }
    }
}, {url: [{urlMatches: 'http://*/*'}, {urlMatches: 'https://*/*'}]});