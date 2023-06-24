const getTimeline = document.getElementById("getTimeline");
const CurrentUrl = document.getElementById("currenturl");
const getFinalYAML = document.getElementById("getFinalYAML")
const getLogsView = document.getElementById("getLogsView")
const getTaskVersion = document.getElementById("getTaskVersion")
const getProperties = document.getElementById("getProperties")
const getTaskIdInput = document.getElementById("task-ids")
const getTaskIdCSV = document.getElementById("getTaskIDCsvs")
const openTestAccount = document.getElementById("openTestAccount")
const openProdAccount = document.getElementById("openProdAccount")
const getProdVersion = document.getElementById("getProdVersion")
const getOrgName = document.getElementById("orgname")
const openOrgPage = document.getElementById("openOrgTasks")
const searchErrorFix = document.getElementById("SearchErrorFix")
const errorFix = document.getElementById("error_fix")

// Build Logs
const getBuildLogs = document.getElementById("getBuildLogs")
const getAdoAccount = document.getElementById("adoAccount")
const getProjectId = document.getElementById("projectId")
const getBuildId = document.getElementById("buildId")

cons

function extractInformation(url) {
    let currURL = new URL(url)
    let pathname = currURL.pathname
    let host = currURL.host
    let params = currURL.toJSON().split("?")[1]
    console.log(params)
    let searchparams = new URLSearchParams(params)
    let buildId = searchparams.get('buildId')
    let orgName;
    let project;
    if (host.split('.')[1] == 'visualstudio') {
        orgName = host.split('.')[0]
        project = pathname.split('/')[1]
    } 
    if (host.includes('dev.azure.com')) {
        orgName = pathname.split('/')[1]
        project = pathname.split('/')[2]
    }
    if (buildId == undefined) {
        
    }
    return {
        "orgname": orgName,
        "project": project,
        "buildId": buildId
    }
}

function getSelectedText() { 
    console.log("Running error tracking on selected text")
    return document.getSelection().toString(); 
}

function getErrorTextTorch() {
    console.log("Fetching error text from troubleshooting button.")
    let error_content = document.querySelector(".bolt-panel-root > .bolt-panel-content code").innerText
    return error_content
}

function getErrorTextPipelineView() {
    let issue_card = document.querySelector(".issues-card-content")
    let has_error_parent = issue_card.children[0].querySelector('.bolt-tab.selected').innerText.toLowerCase().includes('error')
    if (has_error_parent) {
        let error_rows = issue_card.children[1].querySelectorAll(':not(.secondary-text).text-ellipsis')
        let error_contents = []
        const run_details_page = document.querySelector('.run-details-page.bolt-page')
        for (let i = 0; i < error_rows.length; i++)
        {
            const rect = error_rows[i].getBoundingClientRect();
            const pos = {
                left: rect.left + run_details_page.scrollLeft,
                top: rect.top + run_details_page.scrollTop
            };
            error_contents.push({'error_text': error_rows[i].innerText, 'offset': pos})
        }
        return error_contents
    } 
    return null
}


if (searchErrorFix) {
    searchErrorFix.onclick = function() {
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
            target : {tabId : tabs[0].id, allFrames : true},
            func : getErrorTextPipelineView,
            })
            .then(async (injectionResults) => {
                console.log(injectionResults)
                if (injectionResults == null || injectionResults[0]['result'] == null) 
                {
                    errorFix.innerHTML = `<h4>Error</h4><p>We could not located any error, please try again. Make sure the troubleshooting pane is open.</p>`
                    throw new Error("We could not located any error, please try again. Make sure the troubleshooting pane is open")
                }
                console.log(injectionResults)
                try {
                    let response = await fetch('http://127.0.0.1:5000/api/error?' + new URLSearchParams({q: injectionResults[0]['result'][0]['error_text']}))
                    const resp = await response.json()
                    errorFix.innerHTML = `<h4>Possible solution</h4><p>${resp[0]['suggestion']}</p>`
                    console.log(resp)
                } catch (err) {
                    console.log(err)
                }
            })
            .catch(err => console.error(err));
        })
    }
}

if (getTimeline) {
    getTimeline.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            url_info = extractInformation(tabs[0].url)
            chrome.tabs.create({"url": `https://dev.azure.com/${url_info['orgname']}/${url_info['project']}/_apis/build/builds/${url_info['buildId']}/timeline?api-version=6.0`})
        });
    };
}

if (getFinalYAML) {
    getFinalYAML.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            url_info = extractInformation(tabs[0].url)
            chrome.tabs.create({"url": `https://dev.azure.com/${url_info['orgname']}/${url_info['project']}/_apis/build/builds/${url_info['buildId']}/logs/1`})
        });
    };
}

if (getLogsView) {
    getLogsView.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            url_info = extractInformation(tabs[0].url)
            chrome.tabs.create({"url": `https://dev.azure.com/${url_info['orgname']}/${url_info['project']}/_build/results?buildId=${url_info['buildId']}&view=logs`})
        });
    }
}

if (getProperties) {
    getProperties.onclick = function() {
        chrome.tabs.query({
            active: true, currentWindow: true
        }, function(tabs) {
            url_info = extractInformation(tabs[0].url)
            chrome.tabs.create({"url": `https://dev.azure.com/${url_info['orgname']}/${url_info['project']}/_apis/build/builds/${url_info['buildId']}/properties?api-version=7.0`})
        })
    }
}

function getJSON() { 
    let json_string = document.querySelector("pre").innerHTML;
    let parsed_json = JSON.parse(json_string)
    return parsed_json
}

const TaskIds = ["23e7e394-a081-42a5-b5ad-ebc10128b977", "f89744ab-807f-45c3-9761-bb0a3414d4dd", "f3669b85-73f2-436d-9391-3ebd8061b38c", "a8534dce-3050-4b23-9843-336458a59bc3", "2b97374b-e8b0-4a3b-adce-3405efca44b5", "e15f804e-1c74-44fc-bbd1-742bd47c7d7c", "b25e1883-b739-49ef-97bb-84ad71a209b5"]

if (getTaskVersion) {
    getTaskVersion.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting
            .executeScript({
            target : {tabId : tabs[0].id},
            func : getJSON,
            })
            .then((value) => {
                let output = []
                console.log(value)
                const result = value[0]["result"]
                console.log(result)
                const values = result["value"]
                console.log(TaskIds)
                values.forEach((item) => {
                    if (TaskIds.includes(item['id'])) {
                        console.log("MATCH")
                        output.push([item['id'], item['name'], item['version'], item['contributionVersion'], item['iconUrl']])
                    }
                })
                console.log(output)
                let bodyTag = document.getElementsByTagName("body")[0]
                let holderTag = document.getElementById("versionString")
                let versionString = "<table id='versionString'><tr><th></th><th>Task Guid</th><th>Task Identifier</th><th>Task Version</th><th>Extension Version</th></tr>"
                output.forEach((item) => {
                    versionString += `<tr><td><img src="${item[4]}" height=30 width=30 /></td><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]['major']}.${item[2]['minor']}.${item[2]['patch']}</td><td>${item[3]}</td></tr>`
                })
                versionString += "</table>"
                if (holderTag) {
                    holderTag.innerHTML = versionString
                } else {
                    bodyTag.innerHTML += versionString
                }
            });
        });
    }
}

const ProdIds = ["30aa99f6-20a0-4774-a912-893420204a7b", "3fce1203-d52d-494f-b7ca-cee52b4db770", "c34c2105-3d04-470f-bb0b-2bc8849a436d", "10bee223-5abd-488a-a803-3917097683b6", "f3b80a1c-3097-429d-861d-62cfdd1b52b1", "68f707e9-6dbd-4820-8a3f-5f1799925d80"]

if (getProdVersion) {
    getProdVersion.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting
            .executeScript({
            target : {tabId : tabs[0].id},
            func : getJSON,
            })
            .then((value) => {
                let output = []
                const result = value[0]["result"]
                const values = result["value"]
                console.log(ProdIds)
                values.forEach((item) => {
                    if (ProdIds.includes(item['id'])) {
                        console.log("MATCH")
                        output.push([item['id'], item['name'], item['version'], item['contributionVersion'], item['iconUrl']])
                    }
                })
                console.log(output)
                let bodyTag = document.getElementsByTagName("body")[0]
                let holderTag = document.getElementById("versionString")
                let versionString = "<table id='versionString'><tr><th></th><th>Task Guid</th><th>Task Identifier</th><th>Task Version</th><th>Extension Version</th></tr>"
                output.forEach((item) => {
                    versionString += `<tr><td><img src="${item[4]}" height=30 width=30 /></td><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]['major']}.${item[2]['minor']}.${item[2]['patch']}</td><td>${item[3]}</td></tr>`
                })
                versionString += "</table>"
                if (holderTag) {
                    holderTag.innerHTML = versionString
                } else {
                    bodyTag.innerHTML += versionString
                }
            });
        });
    }
}

if (getBuildLogs) {
    getBuildLogs.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const adoAccount = getAdoAccount.value
            const projectId  = getProjectId.value
            const buildId    = getBuildId.value
            chrome.tabs.create({"url": `https://${adoAccount}.visualstudio.com/${projectId}/_build/results?buildId=${buildId}`})
        })
    }
}

if (getTaskIdCSV) {
    getTaskIdCSV.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting
            .executeScript({
            target : {tabId : tabs[0].id},
            func : getJSON,
            })
            .then((value) => {
                let output = []
                const result = value[0]["result"]
                console.log(Object.keys(result))
                const values = result["value"]
                console.log(TaskIds)
                values.forEach((item) => {
                    let TaskIds = getTaskIdInput.value.split(',')
                    if (TaskIds.includes(item['id']) || TaskIds.includes(item['name'])) {
                        console.log("MATCH")
                        output.push([item['id'], item['name'], item['version'], item['contributionVersion'], item['iconUrl']])
                    }
                })
                console.log(output)
                let bodyTag = document.getElementsByTagName("body")[0]
                let holderTag = document.getElementById("versionString")
                let versionString = "<table id='versionString'><tr><th></th><th>Task Guid</th><th>Task Identifier</th><th>Task Version</th><th>Extension Version</th></tr>"
                output.forEach((item) => {
                    versionString += `<tr><td><img src="${item[4]}" height=30 width=30 /></td><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]['major']}.${item[2]['minor']}.${item[2]['patch']}</td><td>${item[3]}</td></tr>`
                })
                versionString += "</table>"
                if (holderTag) {
                    holderTag.innerHTML = versionString
                } else {
                    bodyTag.innerHTML += versionString
                }
            });
        });
    }
}

if (openOrgPage) {
    openOrgPage.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let orgname = getOrgName.value
            if (orgname.length > 0) chrome.tabs.create({"url": `https://${orgname}.visualstudio.com/_apis/distributedtask/tasks`})
        });
    };
}
