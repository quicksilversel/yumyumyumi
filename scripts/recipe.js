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

// process google drive images
function processImages(url){

    if (url.includes("https://drive.google.com")){
        var id = url.split("https://drive.google.com/file/d/")[1].split('/')[0];
        id = id.split('/')[0];
    
        console.log(id);
    
        var newURL = "https://drive.google.com/uc?export=view&id=" + id;
        
        return newURL;
    }

    else return url;
}


// dynamically add recipes to page
function processRows(json) {

    // get URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    result = data[id-1]

    // change title of page
    document.title = result.title + "のレシピ";

    // insert to HTML
    const recipe = lineBreak(result.recipe);
    const ingredients = lineBreak(result.ingredient);
    const point = lineBreak(result.point);
    const categories = processCategories(result.category);
    const imageURL = processImages(result.image);

    $(".recipe-image").append(`<img src="${imageURL}" alt="image">`)
    $(".recipe-title").append(`${result.title}`)
    $(".recipe-time").append(`${result.time}`)
    $(".recipe-category").append(`${categories}`)
    $(".recipe-source").append(`参考：${result.source}`)
    $(".recipe-ingredients").append(`${ingredients}`)
    $(".recipe-summary").append(`${result.summary}`)
    $(".recipe-content").append(`${recipe}`)
    $(".recipe-point").append(`${point}`)
}