<ul style="font-size:0.9em" class="list">
{{#each this}}
	<li style="margin-bottom:20px">
		<span class="id" id="{{user}}">
			<a href="https://commons.wikimedia.org/wiki/User:{{user}}" title="{{user}}" target="_blank">
				{{user}}
			</a>
		</span>
		<ul class="uploads">
		{{#each uploads}}
			
			{{#each files}}
			<li>
				<a href="https://commons.wikimedia.org/wiki/File:{{this}}" target="_blank" title="{{this}}">
					{{this}}
				</a>
			</li>
			{{/each}}

		{{/each}}
		</ul>
	</li>
{{/each}}
</ul>