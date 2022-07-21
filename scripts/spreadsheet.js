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
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            // console.log(rep)
 
            const colz = [];
            const tr = document.createElement('tr');
            //Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    th.innerText = column;
                    tr.appendChild(th);
                }
            })
 
            //extract row data:
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

// preserve line break from cells
function lineBreak(text){
    text = text.replace(/\n/g, '<br>');
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

// dynamically add recipes to page
function processRows(json) {

    // list of all categories
    categories = [];
    
	for (var i = 0, len = data.length; i < len; i++) {

        if(data[i].title != ""){

            ingredient = lineBreak(data[i].ingredient);
            recipe = lineBreak(data[i].recipe);
            point = lineBreak(data[i].point);
            category = data[i].category.split(",");
            categories.push(category)
    
            hastags = processCategories(data[i].category)
    
            // insert recipe to page
            $(".cards").append(
            `<div class="card" data-category="${data[i].category}">
                <div class="card__image-holder">
                    <img class="card__image" src="${data[i].image}" alt="Card image cap"> 
                </div>
                <div class="card-title">
                    <a href="#" class="toggle-info btn">
                        <span class="left"></span>
                        <span class="right"></span>
                    </a>
                    <h2 class="mt-1">
                    <a href="recipe.html?id=${data[i].id}">${data[i].title}</a>
                    </h2>
                    <small class="mt-2">${data[i].time}<small>
                    <p class="hashtags mt-1">
                        ${hastags}
                    </p>
                    <p class="summary mt-1">
                        ${data[i].summary}
                    </p>
                    <a href="recipe.html?id=${data[i].id}" class="recipeLink mt-2">レシピを見る</a>
                </div>
                <div class="card-flap flap2">
                    <h3>材料</h3>
                    <div class="card-description ingredient">
                        ${ingredient}
                    </div>
                </div>
            </div>`
            )
        }
	};
    // add category to filters
    addCategories(categories);
    console.log(data)
}