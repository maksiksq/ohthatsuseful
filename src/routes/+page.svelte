<script lang="ts">
    const {data} = $props();
    import {enhance} from "$app/forms";

    let devOverlay = $state(false);
    const summonDevOverlay = (e: KeyboardEvent) => {
        if (e.key === 'o') {
            devOverlay = !devOverlay;
        }
    };


    let query = $state('');
    let selectedTags = $state('');
</script>


<svelte:window onkeydown={summonDevOverlay}/>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com"/>
</svelte:head>

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
        <h1>oh wowie that's useful</h1>
    </section>
    <section class="tag-seg">
        Search and a tags weeeeeeeeeeeeha
        <input name="query" id="query" class="search" type="text" autocomplete="off" placeholder="Search..."
               bind:value={query}/>
        <button class="sr-only">Search</button>
        {#each Object.entries(data.tags) as [key, values] (key)}
            <p>{key}</p>
                <ul>
                    {#each values as tag}
                        <li>
                            {tag}
                        </li>
                    {/each}
                </ul>
        {/each}

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
    :global {
        body {
            background-image: url("/img/fancy.svg");
            background-size: cover;
            font-family: 'Montserrat', sans-serif;
        }
    }

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
            margin-top: 13.2vh;

            & h1 {
                font-size: 6.25rem;
                /*this originally was Onest but apparently figma just uses */
                /*the wrong font for Onest and that is not Onest???*/
                /*Could not find what the actual font in there was. Typical enshittified software.*/
                /*This one looks better tho so whatever*/
                font-family: 'Rozanova', sans-serif;
                font-weight: bold;
                text-align: center;
                line-height: 1em;

                max-width: 60vw;
            }
        }
    }
</style>