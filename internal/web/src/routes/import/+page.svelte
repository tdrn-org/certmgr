<script lang="ts">
	import {
		Button,
		Fileupload,
		Textarea,
		Input,
		type SelectOptionType
	} from 'flowbite-svelte';
	import ImportSourceInput from '$lib/components/importsourceinput.svelte';
	import { goto } from '$app/navigation';
	import MainNavBar from '$lib/components/mainnavbar.svelte';

	const base: string = '..';

	const inputSource = 'input';
	const localSource = 'local';
	const remoteSource = 'remote';
	const serverSource = 'server';
	let sources: SelectOptionType<string>[] = [
		{ name: 'Input', value: inputSource },
		{ name: 'File', value: localSource },
		{ name: 'URL', value: remoteSource },
		{ name: 'Server', value: serverSource }
	];
	let selectedSource: string = '';
	let selectedSourceValid: any;

	// input source
	let input: string;

	function onInputChanged() {
		console.log(input);
	}

	// local source
	let files: FileList;

	function onFilesChanged() {
		console.log(files.length);
	}

	// remote source
	let url: string;

	function onUrlChanged() {
		console.log(url);
	}

	// server source
	let address: string;

	function onAddressChanged() {
		console.log(address);
	}

	function onImport() {
		goto(base);
	}

	function onCancel() {
		goto(base);
	}
</script>

<MainNavBar {base} />
<div class="p-8">
	<div class="mb-6">
		<ImportSourceInput {sources} bind:source={selectedSource} bind:valid={selectedSourceValid} />
	</div>
	{#if selectedSource == inputSource}
		<div class="mb-6">
			<Textarea id={inputSource} placeholder="Enter/paste input" rows="4" name="input" bind:value={input} on:change={onInputChanged} />
		</div>
	{/if}
	{#if selectedSource == localSource}
		<div class="mb-6">
			<Fileupload id="{localSource}}" bind:files={files} on:change={onFilesChanged}  />
		</div>
	{/if}
	{#if selectedSource == remoteSource}
		<div class="mb-6">
			<Input type="text" id="{remoteSource}}" placeholder="Enter URL" bind:value={url} on:change={onUrlChanged} />
		</div>
	{/if}
	{#if selectedSource == serverSource}
		<div class="mb-6">
			<Input type="text" id="{serverSource}}" placeholder="Enter address" bind:value={address} on:change={onAddressChanged} />
		</div>
	{/if}
	<div class="mb-6">
		<Button type="submit" size="sm" on:click={onImport}>Import</Button>
		<Button color="alternative" size="sm" on:click={onCancel}>Cancel</Button>
	</div>
</div>
