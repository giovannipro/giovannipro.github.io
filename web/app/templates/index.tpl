<!--<div id="search">
	<label>Search: <input ng-model="name"></label>
</div>-->
<div id="filter">
	<span ng-click="myFilter = {group: undefined}">All</span>
	<span ng-click="myFilter = {group: 'loader'}">Loader</span>
	<span ng-click="myFilter = {group: 'framework'}">Framework</span>
	<span ng-click="myFilter = {group: 'templating'}">Templating</span>
	<span ng-click="myFilter = {group: 'style'}">Style</span>
	<span ng-click="myFilter = {group: 'tool'}">Tool</span>
	<span ng-click="myFilter = {group: 'dataviz'}">Dataviz</span>
</div>

<div class="libraries">
	<div ng-repeat="d in data | orderBy: 'name' | filter: myFilter" class="library">
		<a href="{{d.link}}" title="Go to {{d.name}}" target="_blank">
			<h2>
				{{d.name}}
			</h2>
			<p class="description">
				{{d.description}}
			</p>
		</a>
	</div>
</div>
