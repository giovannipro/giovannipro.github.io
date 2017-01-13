<ul style="font-size:0.9em" class="list">
{{#each this}}
	<li style="margin-bottom:20px">
		<span class="id" id="{{date}}">{{date}}</span>
		<!--<span>
			<a href="https://commons.wikimedia.org/wiki/Category:{{id}}" title="{{id}}" target="_blank">
				link
			</a>
		</span>-->
		<br>
		<span>{{count}} count</span>
	</li>
{{/each}}
</ul>