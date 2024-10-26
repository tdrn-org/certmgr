<script lang="ts">
	import { onMount } from 'svelte';
	import { A, Alert, Button, Badge, Card, Dropdown, DropdownItem, DropdownDivider, Modal } from 'flowbite-svelte';
	import {
		DotsHorizontalOutline,
		InfoCircleOutline,
		FileExportOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import api, { Entries, EntriesFilter } from '$lib/api';
	import certs from '$lib/certs';
	import ui from '$lib/ui';
	import MainNavBar from '$lib/components/mainnavbar.svelte';

	const base: string = '.';

	let deleteName: string = '';
	let confirmDeleteModal: boolean = false

	let entries: Entries = new Entries();

	onMount(() => {
		reload();
	});

	function reload() {
		let entriesRange = new EntriesFilter();
		entriesRange.start = 0;
		entriesRange.limit = 100;
		api.entries.get(base, entriesRange).then((response) => {
			entries = response;
		});
	}
	function onDetails(name: string) {
		goto(base + '/details/' + name);
	}
	function onExport(name: string) {
		goto(base + '/export/' + name);
	}
	function onConfirmDelete(name: string) {
		deleteName = name;
		confirmDeleteModal = true;
	}
	function onCancelDelete() {
		confirmDeleteModal = false;
	}
	function onDelete() {
		confirmDeleteModal = false;
		api.del.delete(base, deleteName).then((response) => {
			reload();
		});
	}
	function expiryColor(date: Date): 'red' | 'yellow' | 'none' {
		switch (certs.checkValidTo(date)) {
			case 'expired':
				return 'red';
			case 'expiring':
				return 'yellow';
			default:
				return 'none';
		}
	}
</script>

<MainNavBar {base} />
<div class="mt-10 flex flex-wrap justify-center gap-4">
	{#if entries.entries.length == 0}
	<Alert color="dark" border>
		<span class="font-medium">Empty store!</span>
		Select <A href="{base}/new">New</A> or <A href="{base}/import">Import</A> to add certificates.
	</Alert>
	{/if}
	{#each entries.entries as entry, entryIndex}
		<Card>
			<div class="flex justify-between">
				<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{entry.name}</h5>
				<DotsHorizontalOutline />
				<Dropdown class="w-36">
					<DropdownItem class="flex gap-2" on:click={() => onDetails(entry.name)}
						><InfoCircleOutline size="sm" /> Details</DropdownItem
					>
					<DropdownItem class="flex gap-2" on:click={() => onExport(entry.name)}
						><FileExportOutline size="sm" /> Export</DropdownItem
					>
					<DropdownDivider />
					<DropdownItem class="flex gap-2" on:click={() => onConfirmDelete(entry.name)}><TrashBinOutline size="sm" /> Delete</DropdownItem>
				</Dropdown>
			</div>
			<div class="items-left flex flex-col">
				<span class="pb-2 text-sm text-gray-500 dark:text-gray-400">
					{#if entry.key}
						<Badge color="green">Key</Badge>
					{/if}
					{#if entry.crt}
						<Badge color="dark">CRT</Badge>
					{/if}
					{#if entry.csr}
						<Badge color="indigo">CSR</Badge>
					{/if}
					{#if entry.crl}
						<Badge color="yellow">CRL</Badge>
					{/if}
					{#if entry.ca}
						<Badge>CA</Badge>
					{/if}
				</span>
				<span class="pb-2 text-sm text-gray-500 dark:text-gray-400">
					{entry.dn}
				</span>
				<span class="pb-2 text-sm text-gray-500 dark:text-gray-400">
					Serial: {entry.serial}
				</span>
				{#if entry.crt}
					<span class="pb-2 text-sm text-gray-500 dark:text-gray-400">
						<Badge border color={expiryColor(new Date(entry.validTo))}
							>Expires: {ui.dateTimeFormat.format(new Date(entry.validTo))}</Badge
						>
					</span>
				{/if}
			</div>
		</Card>
	{/each}
</div>
<Modal bind:open={confirmDeleteModal}>
	<svelte:fragment slot="footer">
		<Button on:click={onDelete}>Delete</Button>
		<Button color="alternative" on:click={onCancelDelete}>Cancel</Button>
	</svelte:fragment>
</Modal>