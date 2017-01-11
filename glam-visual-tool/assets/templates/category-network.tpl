<ul style="font-size:0.9em" class="list">
{{#each nodes}}
	<li style="margin-bottom:20px">
		<span class="id" id="{{id}}">{{id}}</span>
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