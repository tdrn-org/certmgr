<script lang="ts">
	import { Helper, Label, Select, type SelectOptionType } from 'flowbite-svelte';

	export let sources: SelectOptionType<string>[];
	export let source: string;
	export const valid = {
		check(): boolean {
			if (source.trim().length == 0) {
				checkResult = false;
				checkMessage = 'Select an entry';
				return false;
			}
			checkResult = true;
			checkMessage = '';
			return true;
		}
	};
	let checkResult: boolean = true;
	let checkMessage: string = '';
</script>

<div class="mb-6">
	<Label color={checkResult ? 'gray' : 'red'}>
		Select an import source
		<Select
			color={checkResult ? 'base' : 'red'}
			class="mt-2"
			items={sources}
			bind:value={source}
			on:change={() => valid.check()}
		/>
		<Helper color="red">{checkMessage}</Helper>
	</Label>
</div>
