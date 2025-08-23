<script>
    import {enhance} from '$app/forms';
    import Card from "$lib/Card.svelte";

    let link = $state('');
    let {form} = $props();

    const previewData = $derived(form?.data);

    // TODO: make real?
    const dummyHandleFocus = () => {
        console.log("grass");
    }

    $inspect(form);
</script>

<main>
    <p>Very official secret lair.</p>
    <p>You heard of a shrimp but have you heard of a shrip?</p>

    <form method="POST" action="?/add" use:enhance>
        <label> Link
            <input type="text" name="link" bind:value={link} placeholder="Search">
        </label>
        <button formaction="?/preview">Get Preview</button>
        <label> Display name
            <input type="text" placeholder="Display name">
        </label>
        <button>Add entry</button>
    </form>

    {#if form?.threat}
        <p>{form?.threat}</p>
    {/if}
    {#if previewData}
        <div class="card-wrapper">
            <Card nift={previewData} focusedNift={previewData} handleFocus={dummyHandleFocus}/>
        </div>
    {/if}
</main>

<style>
    .card-wrapper {
        flex: 1 1 25%;
        max-width: 25%;
        display: flex;
        box-sizing: border-box;
        font-weight: 400;
        padding: 0.3rem;

        cursor: pointer;

        /* more inside Card.svelte */
    }
</style>