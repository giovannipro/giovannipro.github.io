<ul style="font-size:0.9em" class="list">
{{#each this}}
{{#each users}}
	<li style="margin-bottom:20px">
		<span class="id" id="{{user}}">user: {{user}}</span>

		<ul>
		{{#each files}}
			<li class="files">
				<span>{{date}}</span>
				<br/>
				<span>{{count}} files</span>
			</li>
		{{/each}}
		</ul>
		<!--<span>
			<a href="https://commons.wikimedia.org/wiki/Category:{{id}}" title="{{id}}" target="_blank">
				link
			</a>
		</span>-->
	</li>
{{/each}}
{{/each}}
</ul>