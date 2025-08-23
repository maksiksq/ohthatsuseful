<script>
    import { enhance } from '$app/forms';

    let link = $state('');
    let {form} = $props();

    const previewData = $derived(form?.data);

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
        <p>{previewData.title}</p>
    {/if}
</main>