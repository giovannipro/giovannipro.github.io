<div class="tool">
	<h2>
		Sum by range
	</h2>
	<div>
		<input id="input_file" type="file" multiple size="50"/>
		<select id="function">
			<option value="sum">Sum</option>
			<option value="none">None</option>
		</select>
		<!--<input id="value" type="text" placeholder="value_name" />-->
		<input id="submit" type="submit" onclick="get_file()">
	</div>
	<textarea id="result" class="result"></textarea>
</div>

<div class="tool">
	<h2>
		Random numbers
	</h2>
	<div>
		<input id="tot_values" type="text" placeholder="amount of values">
		<input id="min" type="text" placeholder="min">
		<input id="max" type="text" placeholder="max">
		<input id="submit" type="submit" onclick="get_random()">
	</div>
	<textarea id="result_random" class="result"></textarea>
</div>

<div>
	<h2>
		Color converter
	</h2>
	<div>
		<label>RGB color
			<input id="rgb_color" type="text" value="rgb(255, 255, 255)">
		</label>
		<input id="submit" type="submit" onclick="rgb_to_hex()">
	</div>
	<div>
		<label>Hexadecimal color
			<input id="hex_color" type="text" value="#ffffff">
		</label>
		<input id="submit" type="submit" onclick="hex_to_rgb()">	
	</div>
	<textarea id="result_color" class="result"></textarea>
</div>