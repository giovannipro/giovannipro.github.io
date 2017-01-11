<ul style="font-size:0.9em">
{{#each nodes}}
	<li style="margin-bottom:20px" class="list" style="cursor: pointer;">
		<span class="id" id="{{id}}">
			{{id}}
		</span>
		<span>
			<a href="https://commons.wikimedia.org/wiki/Category:{{id}}" title="{{id}}" target="_blank">
				link
			</a>
		</span>
		<br>
		<span>{{files}} files</span>
	</li>
{{/each}}
</ul>