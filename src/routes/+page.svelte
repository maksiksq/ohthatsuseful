<script lang="ts">
    import TagSeg from "./TagSeg.svelte";
    import confetti from "canvas-confetti";
    import {enhance} from "$app/forms";
    import {onMount} from "svelte";
    import { fade, blur } from 'svelte/transition';
    import {expoIn, sineIn, sineOut} from "svelte/easing";

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
            "la-la",
            "booyah",
            "crisp",
            "wicked",
            "sleek",
            "hai",
            "gremlin",
            "poppies",
            "hey",
            "grass",
            "slug",
            "heavens",
            "dangit",
            "yowza",
            "derp",
            "heckin",
            "zesty",
            "shiny",
            "dandy",
            "juices",
            "bling",
            "scoundrel",
            "blast",
            "bonkers",
        ]

    // Easter egg (cursed)
    let rotationCount = $state(0);
    let discovered = $state(new Set<string>());
    let discoveredCount = $derived(discovered.size);
    let addiction = $state(false);
    const rotateWowies = (manually = false) => {
        if (wowiesInterval) clearInterval(wowiesInterval);
        const rotate = () => wowie = wowies[Math.floor(Math.random() * wowies.length)];
        rotationCount += 1;
        console.log(rotationCount);
        discovered = new Set(discovered).add(wowie);
        if (manually) rotate();
        wowiesInterval = setInterval(() => rotate(), 10000)
        if (rotationCount > 25) addiction = true;
        console.log(addiction);
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

    //

    let focus = $state(false);
    let focusedNift = $state<typeof data.nifties[number]>();
    let focusedNiftTags = $derived<typeof data.tags>(focusedNift?.tags);
    let bodyElem = $state<HTMLElement | null>(null);
    const handleFocus = (e: Event, nift: typeof data.nifties[number]) => {
        focus = true;
        focusedNift = nift;
        let elem = e.target as HTMLElement | null;
        if (!elem) return;

        // if it's the link (clickable) let's just pretend it was the wrapper
        if (elem.classList.contains('card-info-link')) {
            elem = elem.closest('.card-wrapper') as HTMLElement | null;
            if (!elem) return;
        }

        const elemBottom = elem.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const scrollToY = elemBottom + window.innerHeight/2 - elem.offsetHeight/2;
        scrollTo({ top: scrollToY, behavior: 'smooth' });

        if (!bodyElem) return;
        document.documentElement.classList.add('scroll-lock');
    }

    let focusElem: HTMLElement | null = $state(null);
    const handleUnfocus = (e: Event) => {
        const target = e.target as HTMLElement;
        if (focusElem?.contains(target)) {
            focus = false;

            if (!bodyElem) return;
            document.documentElement.classList.remove('scroll-lock');
        }
    }
</script>


<svelte:window onclick={focus ? (e) => {handleUnfocus(e)} : () => {}} onkeydown={summonDevOverlay}/>
<svelte:body bind:this={bodyElem}/>
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
<!-- -->
<main>
    <section class="h1-seg">
        {#if addiction}
            <div class="addiction">
                <p>{congratulations ? "🎉🎉🎉" : `Congratulations, on your newly found gambling addiction! ${discoveredCount}/${wowies.length}`}</p>
                <canvas id="confetti-canvas"></canvas>
            </div>
        {/if}
        <h1>oh <span class="wowie" role="button" tabindex="-1" onclick={() => rotateWowies(true)}
                     onkeydown={(e: KeyboardEvent) => {if (e.key === 'Enter') rotateWowies(true)}}>{wowie}</span>,<br>
            that's useful</h1>
    </section>
    <TagSeg bind:query={query} tags={data.tags}/>
    <section class="content-seg">
        <div class="content-cards">
            {#each data.nifties as nift (nift.id)}
                <div class="card-wrapper">
                    <div role="button" tabindex="0" class={`card ${(focusedNift?.title === nift.title) && focus ? 'focused' : ''}`}
                         onclick={(e) => {handleFocus(e, nift)}} onkeydown={(e) => {handleFocus(e, nift)}}>
                        <div class="h2-wrap">
                            <h2 title={nift.display_name}>{nift.display_name}</h2>
                        </div>
                        <div class="card-info">
                            <p class="card-info-favicon-wrap">
                                <img class="card-info-favicon" src={nift.favicon} alt={`${nift.name} favicon`}>
                            </p>
                            <p class="card-info-title">{nift.title}</p>
                            <a class="card-info-link" href={nift.link} target="_blank" rel="noopener">🔗</a>
                        </div>
                        <p class="card-screenshot-link-wrap">
                            <img class="card-screenshot" src={nift.screenshot} alt={nift.name}>
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</main>
{#if focus && focusedNift}
    <div bind:this={focusElem} class="focus">
        <div transition:blur={{duration: 200, easing: expoIn}} class="lightbox" ></div>
        <div transition:blur={{duration: 400}} class="desc">
            <h2>{focusedNift.title}</h2>
            <div class="desc-tags">
                {#each Object.entries(focusedNiftTags) as [key, values] (key)}
                    <p class="desc-tag-cat">{key}</p>
                    <ul>
                        {#each values as tag (tag)}
                            <li>
                                <p class="desc-tag">#{tag}</p>
                            </li>
                        {/each}
                    </ul>
                {/each}
            </div>
            <p>{focusedNift.metadesc}</p>
            <div class="desc-separator"></div>
            <p>{focusedNift.comment}</p>
            {#if focusedNift.warning}
                <div class="desc-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        <path fill="#ffffff"
                              d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.9 536.6 69.6 524.5C62.3 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 232C306.7 232 296 242.7 296 256L296 368C296 381.3 306.7 392 320 392C333.3 392 344 381.3 344 368L344 256C344 242.7 333.3 232 320 232zM346.7 448C347.3 438.1 342.4 428.7 333.9 423.5C325.4 418.4 314.7 418.4 306.2 423.5C297.7 428.7 292.8 438.1 293.4 448C292.8 457.9 297.7 467.3 306.2 472.5C314.7 477.6 325.4 477.6 333.9 472.5C342.4 467.3 347.3 457.9 346.7 448z"/>
                    </svg>
                    <p>{focusedNift.warning}</p>
                </div>
            {/if}
            <p class="desc-small-gray">Added at: {focusedNift.created_at}</p>
        </div>
    </div>
{/if}

<style>
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(16, 16, 16, 0.6);
        z-index: 1000;
    }

    .desc {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
        width: 100%;
        max-width: 70vw;
        padding: 2rem;
        color: white;

        .desc-tags {
            & ul {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }
        }
    }

    .focused {
        position: relative;
        z-index: 1002;

        /* notice that it's not a border because layout shift */
        outline: 1px solid #151515 !important;
    }

    .addiction {
        position: absolute;
        top: 7vh;
        left: 50%;
        text-align: center;
        transform: translateX(-50%);
        pointer-events: none;
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
            margin-top: calc(3vh + 1rem);
            display: flex;
            flex-direction: row;
            align-items: flex-start;

            & .content-cards {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: flex-start;
                row-gap: 1rem;

                box-sizing: border-box;
                padding: 0 2rem 0 2rem;

                & .card-wrapper {
                    flex: 1 1 25%;
                    max-width: 25%;
                    display: flex;
                    box-sizing: border-box;
                    font-weight: 400;
                    padding: 0.3rem;

                    cursor: pointer;

                    & .card {
                        display: flex;
                        flex-direction: column;
                        height: 100%;

                        box-sizing: border-box;

                        padding: 1rem 1rem;

                        word-break: break-word;
                        overflow-wrap: anywhere;

                        background-color: white;
                        border-radius: 3px;
                        border: 1px solid #151515;

                        box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 25%), 0 5px 0 1px rgba(0, 0, 0, 15%);

                        * {
                            pointer-events: none;
                        }

                        &:hover {
                            /* notice that it's not a border because layout shift */
                            outline: 1px solid #151515;
                        }

                        & .h2-wrap {
                            display: flex;
                            align-items: center;
                            line-height: 1.2em;
                            height: 2.4em;
                            margin-top: 1rem;

                            & h2 {
                                font-size: 1.5rem;
                                line-height: 1.2em;
                                font-weight: 400;

                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                line-clamp: 2;
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                            }
                        }

                        & .card-info {
                            padding-left: 0.3rem;
                            padding-top: 1.3rem;
                            padding-bottom: 0.3rem;
                            gap: 0.65rem;
                            display: flex;
                            align-items: center;

                            & .card-info-link {
                                margin-left: auto;
                                pointer-events: initial;
                            }

                            & .card-info-favicon-wrap {
                                & .card-info-favicon {
                                    aspect-ratio: 1/1;
                                    width: 1rem;
                                    height: 1rem;
                                }
                            }

                            & .card-info-title {
                                display: flex;
                                align-items: center;
                                height: 2em;
                            }
                        }

                        & .card-screenshot-link-wrap {
                            border-top: 1px solid #151515;
                            padding-top: 0.9rem;

                            & .card-screenshot {
                                border: 1px solid #151515;
                                width: 100%;
                            }
                        }
                    }
                }
            }

        }
    }
</style>