// Contains the logic for the filter feature

let results = {
    total: 0,
    items: []
}

function reset() {

    // Found here https://www.w3schools.com/howto/howto_js_filter_table.asp
    let tr = document.getElementsByClassName("repo")

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
        let counter = 0

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0]
            if (td) {
                tr[i].style.display = "none"
                if (td.innerHTML.toLowerCase().indexOf(query) > -1) {
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
            
    console.log('Fetching', endpoint)
    
    fetch(endpoint).then((response) => {

        if (response.status !== 200) {
            console.log("Looks like there was a problem.", response)
            return Promise.reject("Could not fetch repos :C")
        }

        response.json().then(function(data) {
            
            results.total = data.total_count
            results.items = data.items

            document.getElementById("total-count").innerHTML = data.total_count
            document.getElementById("finder-section").style.display = ''
            document.getElementById("results").style.display = ''
            document.getElementById("fetching").style.display = 'none'

            data.items.forEach(element => {

                let license = 'Unknown'
                if(element && element.license && element.license.name)
                {
                    license = element.license.name
                }
                
                let updated = 'Unknown'
                if(element.updated_at)
                {
                    // https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd#comment58447831_29774197
                    updated = new Date(element.updated_at).toISOString().split('T')[0]
                }

                let url = element.html_url

                if(element.homepage)
                {
                    url = element.homepage
                }

                document.getElementById("table-projects-body").innerHTML += `
                <tr class="repo">
                    <td class="data" style="text-transform: capitalize;"><a href="${url}">${element.name}</a></td>
                    <td class="data"> ${element.description || ""} </td>
                    <td class="data"> ${license} </td>
                    <td class="data"> ${element.stargazers_count || 0} </td>
                    <td class="data"><a href="${element.html_url || "#"}">Github</a></td>
                    <td class="data">${updated}</td>
                </tr>
                `
            })

        }).catch(error => {
            console.log(error)
            alert(error)
        })
    })
}

$(document).ready(() => {
    
    fetch_repos()

    $('#finder-bar').on('input keyup change', () => {
        filter()
    })
})