// Contains the logic for the filter feature

let results = {
    total: 0,
    items: []
}

function reset() {

    // Found here https://www.w3schools.com/howto/howto_js_filter_table.asp
    let tr = document.getElementsByClassName("repo")
    let td = null

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]
        if (td) {
            tr[i].style.display = ""
        }
    }
    
    let total = 0
    if(results && results.total)
    {
        total = results.total
    }

    document.getElementById("total-count").innerHTML = total
}

function filter() {

        let query = document.getElementById("finder-bar").value

        if(!query || query === "")
        {
            return reset()
        }
        
        let tr = document.getElementsByClassName("repo")
        let td = null
        let name = null
        let description = null
        let topics = null
        let counter = 0
        let notfound = -1

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            
            td = tr[i].getElementsByTagName("td")
            name = td[0].innerHTML.toLowerCase()
            description = td[1].innerHTML.toLowerCase()
            topics = td[2].innerHTML.toLowerCase()

            if (td) {
                tr[i].style.display = "none"

                if (name.indexOf(query) != notfound ||
                    description.indexOf(query) != notfound ||
                    topics.indexOf(query) != notfound) {

                    tr[i].style.display = ""
                    counter++
                }
            }
        }
    
        document.getElementById("total-count").innerHTML = counter
}

function fetch_repos()
{
    let endpoint = `https://api.github.com/search/repositories?q=masonite&topic=masonite&sort=stars&order=desc`
    
    fetch(endpoint, {
        method:"GET", 
        headers:{"Accept": "application/vnd.github.mercy-preview+json"}
    }).then((response) => {

        if (response.status !== 200) {
            console.log("Looks like there was a problem.", response)
            return Promise.reject("Could not fetch repos :C")
        }

        response.json().then(function(data) {
            
            results.total = data.total_count
            results.items = data.items

            document.getElementById("total-count").innerHTML = data.total_count
            document.getElementById("finder-section").style.display = ""
            document.getElementById("results").style.display = ""
            document.getElementById("fetching").style.display = "none"

            let license = null
            let updated = null
            let url = null
            let topics = null

            data.items.forEach(element => {

                license = "Unknown"
                if(element && element.license && element.license.name)
                {
                    license = element.license.name
                }
                
                updated = "Unknown"
                if(element.updated_at)
                {
                    // https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd#comment58447831_29774197
                    updated = new Date(element.updated_at).toISOString().split('T')[0]
                }

                url = element.html_url
                if(element.homepage)
                {
                    url = element.homepage
                }

                // Topics may not exist thats why they are hidden
                topics = ""
                if(element.topics && element.topics.length > 0)
                {
                    topics = element.topics.join()
                }

                document.getElementById("table-projects-body").innerHTML += `
                <tr class="repo">
                    <td class="data name" style="text-transform: capitalize;"><a href="${url}">${element.name}</a></td>
                    <td class="data description"> ${element.description || ""} </td>
                    <td class="data topics" style="display:none">${topics}</td>
                    <td class="data license"> ${license} </td>
                    <td class="data stars"> ${element.stargazers_count || 0} </td>
                    <td class="data github"><a href="${element.html_url || "#"}">Github</a></td>
                    <td class="data updated">${updated}</td>
                </tr>
                `
            })

        }).catch(error => {
            console.log(error)
            alert(error)
        })
    })
}

if (document.readyState !== 'loading') {
    fetch_repos();
    
    let el = document.getElementById("finder-bar");

    el.addEventListener("input keyup change", () => {
        filter();
    })

} else {
    document.addEventListener('DOMContentLoaded', fetch_repos);
}
