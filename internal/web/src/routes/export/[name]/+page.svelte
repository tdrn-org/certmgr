<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import MainNavBar from '$lib/components/mainnavbar.svelte';
	import api, { EntryDetails } from '$lib/api';
	import { Button, Heading, Secondary } from 'flowbite-svelte';

	const base: string = '../..';

	let entryName: string;
	let entryDetails: EntryDetails;

	$: entryName = $page.params['name'];

	onMount(() => {
		api.details.get(base, entryName).then((response) => {
			entryDetails = response;
		});
	});

	function onExport() {
		goto(base);
	}
</script>

<MainNavBar {base} />
<div class="p-8">
	<div class="mb-6">
		<Heading tag="h3"><Secondary>Export</Secondary> {entryName}</Heading>
	</div>
	<div class="mb-6">
		<Button class="mt-8" size="sm" href={base}>Export</Button>
		<Button class="mt-8" color="light" size="sm" on:click={onExport}>Cancel</Button>
	</div>
</div>
