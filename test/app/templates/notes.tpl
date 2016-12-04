<div ng-repeat="note in notes">
	<a href="{{note.link}}" target="_blank" title="Go to {{note.text}}">
		{{note.text}}
	</a>
</div>
