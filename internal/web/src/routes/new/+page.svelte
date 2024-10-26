<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Button,
		Accordion,
		AccordionItem,
		Toggle,
		Modal,
		Spinner,
		type SelectOptionType
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import api, { GenerateAcme, GenerateLocal, GenerateRemote } from '$lib/api';
	import certs, { BasicConstraints, ExtKeyUsage, KeyUsage, KeyUsageFlag } from '$lib/certs';
	import ui from '$lib/ui';
	import MainNavBar from '$lib/components/mainnavbar.svelte';
	import NameInput from '$lib/components/nameinput.svelte';
	import CaInput from '$lib/components/cainput.svelte';
	import DnInput from '$lib/components/dninput.svelte';
	import KeyTypeInput from '$lib/components/keytypeinput.svelte';
	import IssuerInput from '$lib/components/issuerinput.svelte';
	import ValidFromToInput from '$lib/components/validfromtoinput.svelte';
	import KeyUsageInput from '$lib/components/keyusageinput.svelte';
	import ExtKeyUsageInput from '$lib/components/extkeyusageinput.svelte';
	import BasicConstraintInput from '$lib/components/basicconstraintsinput.svelte';
	import DomainsInput from '$lib/components/domainsinput.svelte';

	const base: string = '..';

	// Global options
	let generating: boolean = false;
	let selectedName: string = '';
	let selectedNameValid: any;
	let cas: SelectOptionType<string>[] = [];
	let selectedCa: string = '';
	let selectedCaValid: any;

	// Local options
	let selectedLocalDn: string = '';
	let selectedLocalDnValid: any;
	let localKeyTypes: SelectOptionType<string>[] = certs.defaultKeyTypes.map((keyType) => {
		return { name: keyType, value: keyType };
	});
	let selectedLocalKeyType: string = '';
	let selectedLocalKeyTypeValid: any;
	let selectedLocalIssuer: string = '';
	let selectedLocalIssuerValid: any;
	let selectedLocalValidFrom: string = '';
	let selectedLocalValidTo: string = '';
	let selectedLocalValidFromToValid: any;
	let localKeyUsageEnabled: boolean = false;
	let localKeyUsage: KeyUsage = new KeyUsage();
	let localExtKeyUsageEnabled: boolean = false;
	let localExtKeyUsage: ExtKeyUsage = new ExtKeyUsage();
	let localBasicConstraintEnabled: boolean = false;
	let localBasicConstraints: BasicConstraints = new BasicConstraints();

	// Remote options
	let selectedRemoteDn: string = '';
	let selectedRemoteDnValid: any;
	let remoteKeyTypes: SelectOptionType<string>[] = localKeyTypes;
	let selectedRemoteKeyType: string = '';
	let selectedRemoteKeyTypeValid: any;

	// ACME options
	let selectedAcmeDomains: string = '';
	let selectedAcmeDomainsValid: any;
	let acmeKeyTypes: SelectOptionType<string>[] = certs.acmeKeyTypes.map((keyType) => {
		return { name: keyType, value: keyType };
	});
	let selectedAcmeKeyType: string = '';
	let selectedAcmeKeyTypeValid: any;

	function onGenerate() {
		let checked: boolean = selectedNameValid.check();
		checked = selectedCaValid.check() && checked;
		if (!checked) {
			return;
		}
		if (certs.isLocalCa(selectedCa)) {
			onGenerateLocal();
		} else if (certs.isRemoteCa(selectedCa)) {
			onGenerateRemote();
		} else if (certs.isAcmeCa(selectedCa)) {
			onGenerateAcme();
		}
	}

	function onGenerateLocal() {
		let checked: boolean = selectedLocalDnValid.check();
		checked = selectedLocalKeyTypeValid.check() && checked;
		checked = selectedLocalIssuerValid.check() && checked;
		checked = selectedLocalValidFromToValid.check() && checked;
		if (!checked) {
			return;
		}
		generating = true;
		let generate = new GenerateLocal();
		generate.name = selectedName.trim();
		generate.ca = selectedCa.trim();
		generate.dn = selectedLocalDn.trim();
		generate.keyType = selectedLocalKeyType.trim();
		generate.issuer = selectedLocalIssuer === '*' ? '' : selectedLocalIssuer.trim();
		generate.validFrom = ui.inputToDate(selectedLocalValidFrom.trim()).toJSON();
		generate.validTo = ui.inputToDate(selectedLocalValidTo.trim()).toJSON();
		if (localKeyUsageEnabled) {
			generate.keyUsage = localKeyUsage.toSpec();
		}
		if (localExtKeyUsageEnabled) {
			generate.extKeyUsage = localExtKeyUsage.toSpec();
		}
		if (localBasicConstraintEnabled) {
			generate.basicConstraints = localBasicConstraints.toSpec();
		}
		api.generateLocal.put('..', generate).then((response) => {
			generating = false;
			goto('..');
		});
	}

	function onGenerateRemote() {
		let checked: boolean = selectedRemoteDnValid.check();
		checked = selectedRemoteKeyTypeValid.check() && checked;
		if (!checked) {
			return;
		}
		generating = true;
		let generate = new GenerateRemote();
		generate.name = selectedName.trim();
		generate.ca = selectedCa.trim();
		generate.dn = selectedRemoteDn.trim();
		generate.keyType = selectedRemoteKeyType.trim();
		api.generateRemote.put(base, generate).then((response) => {
			generating = false;
			goto(base);
		});
	}

	function onGenerateAcme() {
		let checked: boolean = selectedAcmeDomainsValid.check();
		checked = selectedAcmeKeyTypeValid.check() && checked;
		if (!checked) {
			return;
		}
		generating = true;
		let generate = new GenerateAcme();
		generate.name = selectedName.trim();
		generate.ca = selectedCa.trim();
		generate.domains = selectedAcmeDomains.split(',').map((domain) => domain.trim());
		generate.keyType = selectedAcmeKeyType.trim();
		api.generateAcme.put(base, generate).then((response) => {
			generating = false;
			goto(base);
		});
	}

	function onCancel() {
		goto(base);
	}

	onMount(() => {
		api.cas.get(base).then((response) => {
			cas = response.cas.map((ca) => {
				return { name: ca.name, value: ca.name };
			});
		});
		let defaultValidFrom = new Date();
		let defaultValidTo = new Date();
		defaultValidTo.setMonth(defaultValidTo.getMonth() + 6);
		selectedLocalValidFrom = ui.dateToInput(defaultValidFrom);
		selectedLocalValidTo = ui.dateToInput(defaultValidTo);
	});
</script>

<MainNavBar {base} />
<div class="p-8">
	<div class="mb-6">
		<NameInput bind:name={selectedName} bind:valid={selectedNameValid} />
	</div>
	<div class="mb-6">
		<CaInput {cas} bind:ca={selectedCa} bind:valid={selectedCaValid} />
	</div>
	{#if certs.isLocalCa(selectedCa)}
		<DnInput label="Certificate DN" bind:dn={selectedLocalDn} bind:valid={selectedLocalDnValid} />
		<KeyTypeInput
			keyTypes={localKeyTypes}
			bind:keyType={selectedLocalKeyType}
			bind:valid={selectedLocalKeyTypeValid}
		/>
		<IssuerInput
			keyUsage={KeyUsageFlag.KeyCertSign}
			bind:issuer={selectedLocalIssuer}
			bind:valid={selectedLocalIssuerValid}
		/>
		<ValidFromToInput
			bind:validFrom={selectedLocalValidFrom}
			bind:validTo={selectedLocalValidTo}
			bind:valid={selectedLocalValidFromToValid}
		/>
		<div class="mb-6">
			<Accordion flush multiple>
				<AccordionItem>
					<span slot="header"
						><Toggle size="small" bind:checked={localKeyUsageEnabled}>Key usage extension</Toggle
						></span
					>
					<KeyUsageInput bind:extension={localKeyUsage} />
				</AccordionItem>
				<AccordionItem>
					<span slot="header"
						><Toggle size="small" bind:checked={localExtKeyUsageEnabled}
							>Extended key usage extension</Toggle
						></span
					>
					<ExtKeyUsageInput bind:extension={localExtKeyUsage} />
				</AccordionItem>
				<AccordionItem>
					<span slot="header"
						><Toggle size="small" bind:checked={localBasicConstraintEnabled}
							>Basic constraint extension</Toggle
						></span
					>
					<BasicConstraintInput bind:extension={localBasicConstraints} />
				</AccordionItem>
			</Accordion>
		</div>
	{/if}
	{#if certs.isRemoteCa(selectedCa)}
		<DnInput
			label="Certificate Request DN"
			bind:dn={selectedRemoteDn}
			bind:valid={selectedRemoteDnValid}
		/>
		<KeyTypeInput
			keyTypes={remoteKeyTypes}
			bind:keyType={selectedRemoteKeyType}
			bind:valid={selectedRemoteKeyTypeValid}
		/>
	{/if}
	{#if certs.isAcmeCa(selectedCa)}
		<DomainsInput bind:domains={selectedAcmeDomains} bind:valid={selectedAcmeDomainsValid} />
		<KeyTypeInput
			keyTypes={acmeKeyTypes}
			bind:keyType={selectedAcmeKeyType}
			bind:valid={selectedAcmeKeyTypeValid}
		/>
	{/if}
	<div class="mb-6">
		<Button type="submit" size="sm" on:click={onGenerate}>Generate</Button>
		<Button color="alternative" size="sm" border on:click={onCancel}>Cancel</Button>
	</div>
</div>
<Modal title="Generating..." bind:open={generating}>
	<Spinner />
</Modal>
