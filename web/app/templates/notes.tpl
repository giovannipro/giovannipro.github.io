<div ng-repeat="note in notes" class="note">
	<a href="{{note.link}}" target="_blank" title="Go to {{note.text}}">
		{{note.text}}
	</a>
</div>
