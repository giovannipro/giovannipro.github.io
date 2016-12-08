<div ng-repeat="d in data | orderBy: 'group'" class="library">
	<a href="{{d.link}}" title="Go to {{d.title}}" target="_blank">
		<h2>
			{{d.title}}
		</h2>
		<p class="description">
			{{d.description}}
		</p>
	</a>
</div>
