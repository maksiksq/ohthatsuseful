<script lang="ts">
    import TagSeg from "./TagSeg.svelte";
    import confetti from "canvas-confetti";
    import {enhance} from "$app/forms";
    import {onMount} from "svelte";

    const {data} = $props();

    let devOverlay = $state(false);
    const summonDevOverlay = (e: KeyboardEvent) => {
        if (e.key === 'o') {
            devOverlay = !devOverlay;
        }
    };

    let query = $state('');
    let selectedTags = $state('');

    // wowiews
    let wowie = $state('neat')

    const wowies =
        [
            "neat",
            "cool",
            "sh*t",
            "wowie",
            "wowza",
            "snap",
            "hell",
            "woah",
            "damn",
            "well",
            "greg",
            "holy",
            "shucks",
            "rats",
            "sheesh",
            "yeet",
            "bananas",
            "toast",
            "yikes",
            "alas",
            "yes",
            "sweet",
            "gee",
            "gosh",
            "bless",
            "my",
            "goodness",
            "crumbs",
            "mercy",
            "zoinks",
            "yippee",
            "boy",
            "la la",
            "booyah",
            "crisp",
            "wicked",
            "heavens",
            "dangit",
            "yowza",
            "derp",
            "heckin",
        ]

    // Easter egg (cursed)
    let rotationCount = $state(0);
    let discovered = $state(new Set<string>());
    let discoveredCount = $derived(discovered.size);
    let addiction = $state(false);
    const rotateWowies = (manually = false) => {
        if (wowiesInterval) clearInterval(wowiesInterval);
        const rotate = () => wowie = wowies[Math.floor(Math.random() * wowies.length)]; rotationCount += 1; discovered = new Set(discovered).add(wowie);
        if (manually) rotate();
        wowiesInterval = setInterval(() => rotate(), 10000)
        if (rotationCount > 25) addiction = true;
    }

    let wowiesInterval: ReturnType<typeof setInterval>
    onMount(() => {
        rotateWowies();
    })

    let congratulations = $state(false);
    $effect(() => {
        if (discoveredCount.toString() === wowies.length.toString()) {
            congratulations = true;
            confetti();
        }
    })

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
<aside class="nift-aside"></aside>
<main>
    <section class="h1-seg">
        {#if addiction}
            <div class="addiction">
            <p>{congratulations ? "🎉🎉🎉" : `Congratulations, on your newly found gambling addiction! ${discoveredCount}/${wowies.length}`}</p>
            <canvas id="confetti-canvas"></canvas>
            </div>
        {/if}
        <h1>oh <span class="wowie" role="button" tabindex="-1" onclick={() => rotateWowies(true)} onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter') rotateWowies(true)}}>{wowie}</span>,<br> that's useful</h1>
    </section>
    <TagSeg bind:query={query} tags={data.tags}/>
    <section class="content-seg">
        {#each data.nifties as nift (nift.id)}
            <div class="card-wrapper">
                <div class="card">
                    <h2>{nift.display_name}</h2>
                    <img class="favicon" src={nift.favicon} alt="favicon">
                    I'm a card
                    hi
                    <a href={nift.link}>🔗 link</a>
<!--                    <p>{nift.metadesc}</p>-->
<!--                    <p>{nift.comment}</p>-->
                    <img src={nift.screenshot} alt={nift.name}>
                </div>
            </div>
        {/each}
    </section>
</main>

<style>
    .addiction {
        position: absolute;
        top: 7vh;
        left: 50%;
        text-align: center;
        transform: translateX(-50%);
        z-index: -1;
    }

    :global {
        body {
            background-image: url("/img/fancy.svg");
            background-size: 100% auto;
            background-repeat: no-repeat;
            font-family: 'Montserrat', sans-serif;
        }

        main > section {
            width: 100%;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;

        & .h1-seg {
            width: 100%;
            margin-top: 7.125rem;

            & h1 {
                font-size: 8.25rem;
                /*this originally was Onest but apparently figma just uses */
                /*the wrong font for Onest and that is not Onest???*/
                /*Could not find what the actual font in there was. Enshittified software...*/
                /*This one looks better tho so whatever*/
                font-family: 'Rozanova', sans-serif;
                font-weight: bold;
                text-align: center;
                line-height: 1em;

                /*force 2 lines*/
                min-height: 2em;

                max-width: 60vw;
                user-select: none;

                & .wowie {
                    color: #ffdc8e;
                    font-family: 'Rozanova', sans-serif;
                    -webkit-text-stroke: 1px black;
                    cursor: pointer;
                }
            }
        }

        /* + tag seg, a component */

        & .content-seg {
            width: 100%;
            margin-top: 3vh;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-items: center;

            box-sizing: border-box;
            padding: 1rem 2rem 0 2rem;

            & .card-wrapper {
                flex: 1 1 25%;
                max-width: 25%;
                box-sizing: border-box;
                padding: 0.3rem;

                & .card {
                    background-color: white;
                    display: flex;
                    flex-direction: column;

                    word-break: break-word;
                    overflow-wrap: anywhere;

                    .favicon {
                        aspect-ratio: 1/1;
                        width: 1rem;
                        height: 1rem;
                    }

                    & h2 {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }

                }
            }

        }
    }
</style>