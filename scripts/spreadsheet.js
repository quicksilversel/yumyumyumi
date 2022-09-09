const sheetId = '1TmlxsBkGr_iWww1AeU8Xgq2fqWRDJky4AD56FumlfFI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'yumi-recipe';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`
 
const data = []
document.addEventListener('DOMContentLoaded', init)
 
const cards = document.querySelector('.cards')

// fetch data from google sheets
function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            // remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            // console.log(rep)
 
            const colz = [];
            const tr = document.createElement('tr');
            // extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    th.innerText = column;
                    tr.appendChild(th);
                }
            })
 
            // extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            processRows(data);
        })
}

// get all categories from spreadsheet and dynamically add to page 
function addCategories(categories){
    categories = categories.flat();
    categories = [...new Set(categories)];
	for (var i = 0, len = categories.length; i < len; i++) {
        $(".condition#categories").append(`
            <button data-id="${categories[i]}" data-type="category" class="stat category my-1" role="button">#${categories[i]}</button>
        `)
    }
}

// add durations to page
function addDurations(){
    durations = [10,20,30,40,50,60];
	for (var i = 0, len = durations.length; i < len; i++) {
        $(".condition#duration").append(`
            <button data-id="${durations[i]}" data-type="duration" class="stat duration my-1" role="button">${durations[i]}分以下</button>
        `)
    }
}

// preserve line break from cells
function lineBreak(text){
    text = text.replace(/\n/g, '<br>');
    return text;
}

// strip non-numeric value from duration
function processDuration(text){
    text = text.replace(/\D/g,'');
    return text;
}

// replace "," with "#" for categories
function processCategories(text){
    var categories = [];
    categories = text.split(",");
    var result = "";
    for (var i = 0, len = categories.length; i < len; i++) {
        result = result + "#" + categories[i] + " ";
    }
    return result;
}

// process google drive images
function processImages(url){

    var id = url.substring(url.lastIndexOf('/')+1)

    var newURL = "https://drive.google.com/uc?export=view&id=" + id;
    
    return newURL;
}

// dynamically add recipes to page
function processRows(json) {

    // list of all categories
    categories = [];
    
	for (var i = 0, len = data.length; i < len; i++) {

        if(data[i].title != ""){

            // preserve line breaks
            ingredient = lineBreak(data[i].ingredient);
            recipe = lineBreak(data[i].recipe);
            point = lineBreak(data[i].point);

            // used for creating list of categories
            category = data[i].category.split(",");
            categories.push(category);
    
            // processed category list with #
            hashtags = processCategories(data[i].category);

            // process duration by removing non-numeric values
            duration = processDuration(data[i].time);

            // create new url (modify google drive share link)
            imageURL = processImages(data[i].image)
    
            // insert recipe to page
            $(".cards").append(
            `<div class="card" data-id="${data[i].id}" data-category="${data[i].category}" data-duration="${duration}">
                <div class="card__image-holder">
                    <div class="image-wrapper">
                        <div class="bookmarker">
                            <input type="checkbox" class="checkbox-theme" id="checkbox-theme${data[i].id}">
                            <label for="checkbox-theme${data[i].id}" id="${data[i].id}" class="fas checkbox-label m-2"></label>
                        </div>
                        <a href="recipe.html?id=${data[i].id}">
                            <img class="card__image" src="${imageURL}" alt="image">
                        </a>
                    </div>
                </div>  
                <div class="card-title">
                    <a href="#" class="toggle-info btn">
                        <span class="left"></span>
                        <span class="right"></span>
                    </a>
                    <h2 class="mt-1">
                    <a href="recipe.html?id=${data[i].id}"><span title="${data[i].title}">${data[i].title}</span></a>
                    </h2>
                    <small class="time mt-2"><i class="fa fa-clock mr-2"></i>${data[i].time}<small>
                    <p class="summary mt-1">
                        ${data[i].summary}
                    </p>
                </div>
                <div class="card-flap flap2">
                    <h3>Ingredients</h3>
                    <div class="card-description ingredient">
                        ${ingredient}
                    </div>
                </div>
            </div>`
            )

            // preseve check for bookmarks
            const bookmark = document.querySelector(`#checkbox-theme${data[i].id}`);
            bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

            if(bookmarks.indexOf(data[i].id) >= 0){
                bookmark.checked = true;
            }
        }
	};

    // add category to filters
    addCategories(categories);
    addDurations();
    
}