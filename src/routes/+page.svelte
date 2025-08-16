<script lang="ts">
    import {dev} from "$app/environment";

    const {data} = $props();
    import {enhance} from "$app/forms";

    let devOverlay = $state(false);
    const summonDevOverlay = (e: KeyboardEvent) => {
        if (e.key === 'o') {
            devOverlay = !devOverlay;
        }
    };

</script>

<svelte:window onkeydown={summonDevOverlay}></svelte:window>

<!-- dev only -->
<div class={`dev-overlay ${devOverlay ? '' : 'd-none'}`}>
    <form method="POST" action="?/testApiUpdateAll" use:enhance>
        <button type="submit">Update All (REEEEE)</button>
    </form>
    <form method="POST" action="?/testApiUpdateSpecific" use:enhance>
        <button type="submit">Update Specific (REEE)</button>
    </form>
</div>

<main>
    <section class="h1-seg">
        <h1>Oh that's useful</h1>
    </section>
    <section class="tag-seg">
        Search and a tags weeeeeeeeeeeeha
    </section>
    <section class="content-seg">
        {#each data.nifties as nift (nift.id)}
            <div class="card">
                <img src={nift.favicon} alt="favicon">
                I'm a card
                hi
                <a href={nift.link}>🔗 link</a>
                <p>{nift.metadesc}</p>
                <p>{nift.comment}</p>
                <img src="https://placehold.it/100x100.jpg" alt="placeholder">
            </div>
        {/each}
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;

        & section {
            width: 100%;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;
            align-items: center;
        }

        & .h1-seg {
            & h1 {
                font-size: 2rem;
            }
        }
    }
</style>