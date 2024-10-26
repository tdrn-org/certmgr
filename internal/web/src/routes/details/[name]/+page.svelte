<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Heading, Secondary, Hr, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import api, { EntryDetails } from '$lib/api';
	import MainNavBar from '$lib/components/mainnavbar.svelte';

	const base: string = '../..';

	let entryName: string;
	let entryDetails = new EntryDetails();

	$: entryName = $page.params['name'];

	onMount(() => {
		api.details.get(base, entryName).then((response) => {
			entryDetails = response;
		});
	});
</script>
<MainNavBar base="{base}" />
<div class="p-8">
	<div class="mb-6">
		<Heading tag="h3"><Secondary>Details </Secondary>{entryDetails.name}</Heading>
	</div>
	<div class="mb-6">
		<Table noborder={true}>
			<TableBody>
				{#each entryDetails.groups as group}
				<TableBodyRow>
					<TableBodyCell class="py-2 text-right">{group.title}</TableBodyCell>
					<TableBodyCell class="py-2 w-full"><Hr hrClass="my-2" /></TableBodyCell>
				</TableBodyRow>
				{#each group.attributes as attribute}
				<TableBodyRow>
					<TableBodyCell class="py-1 text-right">{attribute.key}</TableBodyCell>
					<TableBodyCell class="py-1 w-full">{attribute.value}</TableBodyCell>
				</TableBodyRow>
				{/each}
				{/each}
			</TableBody>
		</Table>
	</div>
	<div class="mb-6">
		<Button class="mt-8" color="light" size="sm" href="{base}">Back</Button>
	</div>
</div>
