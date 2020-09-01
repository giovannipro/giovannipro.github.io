<table>
{{#each this}}
	<tr>
		<th class="id">
			{{@index}}
		</th>
		<th>
			{{subject}}
		</th>
		<th class="number">
			{{articles}}
		</th>
		<th class="number">
			{{size}}
		</th>
		<th class="number">
			{{average_daily_visit}}
		</th>
	</tr>
{{/each}}
</table>