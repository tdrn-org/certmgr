<script lang="ts">
    import { page } from '$app/stores';
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl, DarkMode } from "flowbite-svelte";
	import {
		CirclePlusOutline,
		FileImportOutline,
		HomeOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import NavContainer from 'flowbite-svelte/NavContainer.svelte';

	export let base: string;

    $: activeUrl = $page.url.pathname;
	$: rootUrl = new URL(base + '/', $page.url).pathname;
	$: newUrl = new URL(base + '/new/', $page.url).pathname;
	$: importUrl = new URL(base + '/import/', $page.url).pathname;
	$: aboutUrl = new URL(base + '/about/', $page.url).pathname;
</script>
<Navbar>
    <NavBrand href="{rootUrl}">
        <img src="{base}/images/certmgr.svg" class="me-3 h-6 sm:h-9" alt="CertMgr Logo" />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">CertMgr</span>
    </NavBrand>
    <div class="flex md:order-2">
        <DarkMode />
        <NavHamburger />
    </div>
    <NavUl {activeUrl} >
        <NavLi href="{rootUrl}">Certificates</NavLi>
        <NavLi href="{newUrl}">New</NavLi>
        <NavLi href="{importUrl}">Import</NavLi>
        <NavLi href="{aboutUrl}">About</NavLi>
    </NavUl>
</Navbar>
