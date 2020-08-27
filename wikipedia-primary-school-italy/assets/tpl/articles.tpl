{{!-- 

{
    "article": "article",
    "typology": "typology",
    "subject": "subject",
    "year": "year",
    "argument": "argument",
    "topic": "topic",
    "average_daily_visit": "daily_visit",
    "size": "size",
    "incipit_size": "incipit_size",
    "issues": "issues",
    "notes": "notes",
    "images": "images",
    "incipit_on_size": "incipit/size"
}

--}}


<table>
{{#each this}}
	<tr>
		<th class="id">
			{{@index}}
		</th>
		<th class="article_title">
			<a href="https://it.wikipedia.org/wiki/{{article}}" target="_blank">
				{{article}}
			</a>
		</th>
		<th>
			{{subject}}
		</th>
		<th class="year">
			{{year}}
		</th>
		<th>
			{{argument}}
		</th>
		<th class="number">
			{{average_daily_visit}}
		</th>
		<th class="number">
			{{size}}
		</th>
		<th class="number">
			{{incipit_on_size}}
		</th>
		<th class="number">
			{{issues}}
		</th>
		<th class="number">
			{{notes}}
		</th>
		<th class="number">
			{{images}}
		</th>
	</tr>
{{/each}}
</table>