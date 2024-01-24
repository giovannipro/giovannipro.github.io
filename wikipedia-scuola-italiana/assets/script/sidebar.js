function update_sidebar_text(){
	const sort_option = document.getElementById('sort_article');
	const text_box = document.getElementById('sidebar_text');

	sort = sort_option.options[sort_option.selectedIndex].text
	text_box.innerHTML = sort
	// console.log(sort, sort_option)
}

function sidebar(dv,data,the_sort){
	// console.log(data[0])
	// console.log(the_sort)

	const button_open = document.getElementById('sidebar_button_open');
	const button_close = document.getElementById('sidebar_close_icon');
	const the_sidebar = document.getElementById('sidebar');
	const container = document.getElementById('sidebar_content');
	
	let output = ''
	detail = ''
	
	container.innerHTML = ''

	function load_sidebar(){
		max = -Infinity;

		output = ''
		output += '<ul>'

		update_sidebar_text()

		// sort data and get max
		if (dv ==1){
			if (the_sort == 1){
				data.sort((a, b) => {
					return a.article - b.article;
				})
				max = -Infinity;
			}
			else if (the_sort == 2){
				data.sort((a, b) => {
					return b.days - a.days;
				})
				max = Math.max(...data.map((a,b) => a.days))
			}
			else if (the_sort == 3){
				data.sort((a, b) => {
					return b.size - a.size;
				})
				max = Math.max(...data.map((a,b) => a.size))
			}
			else if (the_sort == 4){
				data.sort((a, b) => {
					return b.discussion_size - a.discussion_size;
				})
				max = Math.max(...data.map((a,b) => a.discussion_size))
			}
			else if (the_sort == 5){
				data.sort((a, b) => {
					return b.incipit_size - a.incipit_size;
				})
				max = Math.max(...data.map((a,b) => a.incipit_size))
			}
			else if (the_sort == 6){
				data.sort((a, b) => {
					return b.issues - a.issues;
				})
				max = Math.max(...data.map((a,b) => a.issues))
			}
			else if (the_sort == 7){
				data.sort((a, b) => {
					return b.images - a.images;
				})
				max = Math.max(...data.map((a,b) => a.images))
			}
			else if (the_sort == 8){
				data.sort((a, b) => {
					return b.linguistic_versions - a.linguistic_versions;
				})
				max = Math.max(...data.map((a,b) => a.linguistic_versions))
			}
		}
		else if (dv == 2) {
			if (the_sort == 1){
				max = Math.max(...data.map(item => item.issues));
			}
			else if (the_sort == 2){ // title
				max = -Infinity;
			}
			else if (the_sort == 3){
				max = Math.max(...data.map(item => item.references));
			}
			else if (the_sort == 4){
				max = Math.max(...data.map(item => item.notes));
			}
			else if (the_sort == 5){
				max = Math.max(...data.map(item => item.images));
			}
			else if (the_sort == 6){
				max = Math.max(...data.map(item => item.linguistic_versions));
			}
		}
		// console.log(max,sort)		

		// add item in the sidebar
		data.forEach(function (d,i) {

			if (dv ==1){
				if (the_sort == 1){
					detail = ''
					num = 0
				}
				else if (the_sort == 2){
					detail = d.first_edit
					num = d.days
				}
				else if (the_sort == 3){
					detail = formatNumber(d.size)
					num =  d.size
				}
				else if (the_sort == 4){
					detail = formatNumber(d.discussion_size)
					num = d.discussion_size
				}
				else if (the_sort == 5){
					detail = formatNumber(d.incipit_size) // .toLocaleString()
					num = d.incipit_size
				}
				else if (the_sort == 6){
					detail = d.issues
					num = d.issues
				}
				else if (the_sort == 7){
					detail = d.images
					num = d.images
				}
				else if (the_sort == 8){
					detail = formatNumber(d.linguistic_versions) //.toLocaleString()
					num = d.linguistic_versions
				}
				console.log(detail)
			}
			else if (dv == 2) {
				if (the_sort == 1){
					detail = d.issues
					num = d.issues
				}
				else if (the_sort == 2){
					detail = ''
					num = 0
				}
				else if (the_sort == 3){
					detail = formatNumber(d.references) //.toLocaleString()
					num = d.references
				}
				else if (the_sort == 4){
					detail = formatNumber(d.notes) // .toLocaleString()
					num = d.notes
				}
				else if (the_sort == 5){
					detail = formatNumber(d.images) //.toLocaleString()
					num = d.images
				}
				else if (the_sort == 6){
					detail = formatNumber(d.linguistic_versions) //.toLocaleString()
					num = d.linguistic_versions
				}
			}

			if (max != 0) {
				size = num * 100 / max
			}
			else {
				size = 0
			}

			output += '<li>'
			output += '<div id="data">'
			output += '<a href=" ' + wiki_link + d.article + '" target="_blank"><div class="article">' + d.article + '</div></a>'

			if (isNaN(max) == false) {
				output += '<div class="value">' + detail + '</div>'
			}

			output += '</div>'

			if (the_sort != 2 || isNaN(max) == false){
				output += '<div id="bar" style="width: ' + size + '%;"></div>'
			}

			output += '</li>'
		})

		output += '</ul>'

		container.innerHTML = output
	}
	load_sidebar()

	let open = false;
	button_open.addEventListener('click', (event) => {

		if (open == false){
			the_sidebar.style.display = 'block'
			open = true

			button_close.style.display = 'block'
			button_open.style.display = 'none'
		}
	})

	button_close.addEventListener('click', (event) => {

		if (open == true){
			the_sidebar.style.display = 'none'
			open = false

			button_close.style.display = 'none'
			button_open.style.display = 'block'
		}
	})
	// console.log(open)

}