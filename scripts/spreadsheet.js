const sheetId = '12CsMGAgYtUda54FL2OVm8nNiF_suZU0BPf1efY0eDV8';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'filter-recipe';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`
 
const data = []
document.addEventListener('DOMContentLoaded', init)
 
const cards = document.querySelector('.cards')

function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(rep)
 
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
  
function processRows(json) {
   // insert to table
	for (var i = 0, len = data.length; i < len; i++) {
		$(".cards").append(
        `<div class="card" data-country="${data[i].country}" data-ingredients="${data[i].ingredients}" data-time="${data[i].time}">
            <div class="card__image-holder">
                <img class="card__image" src="${data[i].image}" alt="Card image cap"> 
            </div>
            <div class="card-title">
                <a href="#" class="toggle-info btn">
                    <span class="left"></span>
                    <span class="right"></span>
                </a>
                <h2>
                    ${data[i].title}
                    <small class="mt-2">${data[i].time}<small>
                </h2>
            </div>
            <div class="card-flap flap1">
                <div class="card-description">
                    ${data[i].recipe}
                </div>
            </div>
        </div>`
        )
	};
}