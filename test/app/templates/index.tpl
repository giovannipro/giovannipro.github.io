<div class="row">
	<div class="col-md-12">
		<ul>
			<li ng-repeat="note in notes | orderBy: 'id'">
				<h2>{{note.title}}</h2>
				<p>{{note.id}}</p>
				<p>{{note.text}}</p>
				<span class="fa fa-close" ng-click="deleteNote($title)"></span>
			</li>
		</ul>
	</div>
</div>

