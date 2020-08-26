<ul>
{{#each this}}
	<li>
		<span>
			<a href="https://it.wikipedia.org/wiki/{{article}}" target="_blank">
				{{article}}
			</a>
		</span>
		<span>
			{{subject}}
		</span>
		<span>
			{{year}}
		</span>
		<span>
			{{argument}}
		</span>
		<span>
			{{average_daily_visit}}
		</span>
	</li>
{{/each}}
</ul>